const { initializeApp } = require('firebase-admin/app');
const { FieldValue, getFirestore } = require('firebase-admin/firestore');
const { HttpsError, onCall } = require('firebase-functions/v2/https');
const { GoogleAuth } = require('google-auth-library');

initializeApp();

const GEMINI_MODEL = 'gemini-2.5-flash';
const REGION = 'asia-east2';
const VERTEX_LOCATION = 'global';
const AI_DAILY_LIMIT = 5;
const CATEGORIES = new Set(['sight', 'meal', 'transport', 'hotel', 'shopping', 'other']);
const firestore = getFirestore();
const googleAuth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function getTripLength(startDate, endDate) {
  const milliseconds = Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`);
  return Math.floor(milliseconds / 86400000) + 1;
}

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function cleanActivity(activity, startDate, endDate) {
  if (!activity || typeof activity !== 'object') return null;
  const date = cleanText(activity.date, 10);
  const title = cleanText(activity.title, 120);
  const location = cleanText(activity.location, 160);
  if (!isIsoDate(date) || date < startDate || date > endDate || !title || !location) return null;
  const time = cleanText(activity.time, 5);
  const category = cleanText(activity.category, 20);
  return {
    date,
    time: /^([01]\d|2[0-3]):[0-5]\d$/.test(time) ? time : '',
    title,
    category: CATEGORIES.has(category) ? category : 'other',
    location,
    description: cleanText(activity.description, 240),
    remarks: cleanText(activity.remarks, 300),
  };
}

function cleanCurrentActivity(activity, startDate, endDate) {
  if (!activity || typeof activity !== 'object') return null;
  const id = cleanText(activity.id, 80);
  const date = cleanText(activity.date, 10);
  const title = cleanText(activity.title, 120);
  const location = cleanText(activity.location, 160);
  if (!/^[a-zA-Z0-9_-]+$/.test(id) || !isIsoDate(date) || date < startDate || date > endDate || !title || !location) return null;
  return {
    id,
    date,
    time: cleanText(activity.time, 5),
    title,
    location,
    address: cleanText(activity.address || activity.description, 240),
    category: CATEGORIES.has(activity.category) ? activity.category : 'other',
  };
}

function cleanOptimizedActivity(activity, currentById) {
  if (!activity || typeof activity !== 'object') return null;
  const id = cleanText(activity.id, 80);
  const time = cleanText(activity.time, 5);
  const currentActivity = currentById.get(id);
  if (!currentActivity || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
  return {
    id,
    time: currentActivity.category === 'flight' && /^([01]\d|2[0-3]):[0-5]\d$/.test(currentActivity.time)
      ? currentActivity.time
      : time,
    routeNote: cleanText(activity.routeNote, 240),
  };
}

function cleanRecommendedActivity(activity, startDate, endDate) {
  const cleaned = cleanActivity(activity, startDate, endDate);
  if (!cleaned || !cleaned.location) return null;
  return {
    ...cleaned,
    visitorVibe: cleanText(activity.visitorVibe || activity.reviewReason || activity.whyFavorite, 120),
  };
}

async function reserveAIUsage(uid) {
  const testerSnapshot = await firestore.collection('_aiTesters').doc(uid).get();
  if (testerSnapshot.data()?.enabled === true) {
    return {
      limit: null,
      remaining: null,
      unlimited: true,
      resetTimeZone: 'UTC',
    };
  }
  const day = new Date().toISOString().slice(0, 10);
  const usageRef = firestore.collection('_aiUsage').doc(uid);
  const count = await firestore.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(usageRef);
    const usage = snapshot.data();
    const currentCount = usage?.day === day ? Number(usage.count) || 0 : 0;
    if (currentCount >= AI_DAILY_LIMIT) {
      throw new HttpsError('resource-exhausted', `Daily limit of ${AI_DAILY_LIMIT} AI plans reached.`, {
        limit: AI_DAILY_LIMIT,
        resetTimeZone: 'UTC',
      });
    }
    const nextCount = currentCount + 1;
    transaction.set(usageRef, {
      day,
      count: nextCount,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return nextCount;
  });
  return {
    limit: AI_DAILY_LIMIT,
    remaining: Math.max(0, AI_DAILY_LIMIT - count),
    resetTimeZone: 'UTC',
  };
}

async function getAIUsageStatus(uid) {
  const [testerSnapshot, usageSnapshot] = await Promise.all([
    firestore.collection('_aiTesters').doc(uid).get(),
    firestore.collection('_aiUsage').doc(uid).get(),
  ]);
  const testerEnabled = testerSnapshot.data()?.enabled === true;
  if (testerEnabled) {
    return { limit: null, remaining: null, unlimited: true, resetTimeZone: 'UTC' };
  }
  const day = new Date().toISOString().slice(0, 10);
  const usage = usageSnapshot.data();
  const count = usage?.day === day ? Number(usage.count) || 0 : 0;
  return {
    limit: AI_DAILY_LIMIT,
    remaining: Math.max(0, AI_DAILY_LIMIT - count),
    unlimited: false,
    resetTimeZone: 'UTC',
  };
}

exports.getAIUsageStatus = onCall({ region: REGION }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in before checking AI usage.');
  return getAIUsageStatus(request.auth.uid);
});

exports.generateItinerary = onCall({
  region: REGION,
  timeoutSeconds: 90,
  memory: '256MiB',
}, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in before generating a trip.');

  const destination = cleanText(request.data?.destination, 120);
  const startDate = cleanText(request.data?.startDate, 10);
  const endDate = cleanText(request.data?.endDate, 10);
  const preferences = cleanText(request.data?.preferences, 1200);
  const requestedMode = request.data?.mode;
  const mode = requestedMode === 'assistant' || requestedMode === 'optimize-route' || requestedMode === 'recommend-activities'
    ? requestedMode
    : 'create-plan';
  const language = request.data?.language === 'zh' ? 'Traditional Chinese' : 'English';
  if (!destination || !isIsoDate(startDate) || !isIsoDate(endDate) || endDate < startDate) {
    throw new HttpsError('invalid-argument', 'Destination and a valid date range are required.');
  }
  const tripLength = getTripLength(startDate, endDate);
  if (tripLength < 1 || tripLength > 14) {
    throw new HttpsError('invalid-argument', 'AI plans can cover between 1 and 14 days.');
  }

  const currentActivities = mode !== 'create-plan'
    ? (Array.isArray(request.data?.activities) ? request.data.activities : [])
      .slice(0, 80)
      .map((activity) => cleanCurrentActivity(activity, startDate, endDate))
      .filter(Boolean)
    : [];
  if (mode === 'optimize-route' && currentActivities.length < 2) {
    throw new HttpsError('invalid-argument', 'At least two activities with locations are required to optimize a route.');
  }

  const prompt = mode === 'assistant'
    ? [
      `Act as one itinerary copilot for ${destination} from ${startDate} through ${endDate}.`,
      'Infer exactly one requested action from the traveler prompt: create-plan for a complete new trip, recommend-activities for adding a few places to the current trip, or optimize-route for reordering the current trip.',
      currentActivities.length
        ? 'A current itinerary is supplied. Use it for recommendations or route optimization. Only choose create-plan when the traveler clearly asks for a new or replacement itinerary.'
        : 'No usable current itinerary is supplied, so choose create-plan.',
      'For create-plan: include breakfast, lunch, dinner, 2 to 4 sightseeing stops per day, and a small number of shopping stops. Keep each day in one compact area or neighboring districts.',
      'For recommend-activities: return 2 to 4 real, non-duplicate places that fit reachable open slots near that day’s existing activities. For each visitorVibe, write one short natural sentence (maximum 90 characters) about the atmosphere or qualities visitors generally enjoy. Do not address the traveler or predict a favorite.',
      'For optimize-route: return every supplied activity ID exactly once, keep dates and flight times fixed, reduce backtracking, and provide practical local times.',
      'Treat 30 minutes between consecutive stops as a planning target and 60 minutes as a soft warning, not a prohibition. Prefer a friendlier nearby alternative when possible; if a longer transfer is worthwhile, keep it and explain why.',
      'Respect stated transportation preferences and account for typical traffic, transfers, opening hours, meals, and rest. Use official names of real places searchable on Google Maps.',
      `Write all traveler-facing text in ${language}. Do not invent ratings, review counts, prices, URLs, or booking details.`,
      preferences ? `Traveler request: ${preferences}` : 'Traveler request: create a balanced, reachable itinerary.',
      `Current activities JSON: ${JSON.stringify(currentActivities)}`,
    ].join('\n')
    : mode === 'optimize-route'
    ? [
      `Optimize the visit order for this existing ${destination} itinerary from ${startDate} through ${endDate}.`,
      'Group nearby places and reduce backtracking. Optimize each date independently; never move an activity to another date.',
      'Keep flight times fixed. Use hotel stops as sensible daily start or end points. Return every supplied ID exactly once with a practical local time.',
      `Write each concise routeNote in ${language}; mention the suggested transport to that stop or why it follows the previous stop.`,
      preferences ? `Traveler preferences: ${preferences}` : 'Traveler preferences: efficient routing at a comfortable pace.',
      `Existing activities JSON: ${JSON.stringify(currentActivities)}`,
    ].join('\n')
    : mode === 'recommend-activities'
      ? [
        `Recommend 2 to 4 fun additional activities for this existing ${destination} itinerary from ${startDate} through ${endDate}.`,
        'Use the traveler prompt as the main signal. Avoid duplicating existing activities. Choose currently operating, real places with an official name searchable on Google Maps and fit them into realistic open time slots.',
        'Set location to the official venue or landmark name, not a neighborhood, generic activity, or invented place. Prefer places with a strong volume of positive visitor feedback when that is relevant, but never invent ratings or review counts.',
        'For visitorVibe, write one short natural sentence (maximum 90 characters) about the atmosphere or qualities visitors generally enjoy. Do not address the traveler or predict a favorite. Do not invent ratings, review counts, or quotes.',
        `Write all text in ${language}.`,
        preferences ? `Traveler ideas: ${preferences}` : 'Traveler ideas: add surprising, memorable local experiences.',
        `Existing activities JSON: ${JSON.stringify(currentActivities)}`,
      ].join('\n')
      : [
      `Create a practical ${tripLength}-day itinerary for ${destination}, from ${startDate} through ${endDate}.`,
      'Plan each day in chronological order with breakfast, lunch, and dinner at three distinct real restaurants. Use practical meal times and never omit one of these meals.',
      'Add 2 to 4 sightseeing stops per day and a small number of shopping stops across the trip. Do not turn every stop into shopping, and keep enough unplanned time for rest.',
      'Assign one compact geographic area or neighboring districts to each day. Target 30 minutes or less between consecutive places under typical traffic. Treat 60 minutes as a soft warning: prefer a closer alternative, but keep a worthwhile longer transfer when needed and explain it clearly.',
      'For island or region-wide destinations, divide the trip into geographic zones and dedicate separate days to distant zones. Place all three meals near that day’s sightseeing area rather than sending the traveler back across the destination.',
      'Respect the traveler’s stated transportation preferences. Account for realistic walking, driving, or public-transit time, transfers, rush-hour traffic, meal duration, and likely opening hours. Add a transport stop only when it is useful to understand the day.',
      'Every activity must be anchored to a real, currently operating venue, landmark, station, park, or restaurant with its official name searchable on Google Maps.',
      'Set location to that official place name, never a neighborhood, generic activity, or invented venue. Prefer well-reviewed places where suitable, but do not invent booking confirmations, prices, ratings, review counts, or URLs.',
      `Write title, location, description, and remarks in ${language}.`,
      preferences ? `Traveler preferences: ${preferences}` : 'Traveler preferences: balanced sightseeing, food, and rest.',
    ].join('\n');

  const activitySchema = {
    type: 'OBJECT',
    required: ['date', 'time', 'title', 'category', 'location', 'description', 'remarks'],
    properties: {
      date: { type: 'STRING', description: 'ISO date YYYY-MM-DD within the requested range' },
      time: { type: 'STRING', description: '24-hour local time HH:MM' },
      title: { type: 'STRING' },
      category: { type: 'STRING', enum: [...CATEGORIES] },
      location: { type: 'STRING', description: 'Official name of a real place searchable on Google Maps' },
      description: { type: 'STRING' },
      remarks: { type: 'STRING' },
      visitorVibe: { type: 'STRING', description: 'One short sentence, maximum 90 characters, summarizing the atmosphere or qualities visitors generally enjoy' },
    },
  };
  const recommendedActivitySchema = {
    ...activitySchema,
    required: [...activitySchema.required, 'visitorVibe'],
  };
  const optimizedActivitySchema = {
    type: 'OBJECT',
    required: ['id', 'time', 'routeNote'],
    properties: {
      id: { type: 'STRING', description: 'An ID copied exactly from the supplied current activities' },
      time: { type: 'STRING', description: '24-hour local time HH:MM' },
      routeNote: { type: 'STRING' },
    },
  };
  const responseSchema = mode === 'assistant'
    ? {
      type: 'OBJECT',
      required: ['action'],
      properties: {
        action: { type: 'STRING', enum: ['create-plan', 'recommend-activities', 'optimize-route'] },
        activities: { type: 'ARRAY', items: activitySchema },
        recommendedActivities: { type: 'ARRAY', items: recommendedActivitySchema },
        optimizedActivities: { type: 'ARRAY', items: optimizedActivitySchema },
      },
    }
    : mode === 'optimize-route'
    ? {
      type: 'OBJECT',
      required: ['optimizedActivities'],
      properties: {
        optimizedActivities: {
          type: 'ARRAY',
          items: optimizedActivitySchema,
        },
      },
    }
    : mode === 'recommend-activities'
      ? {
        type: 'OBJECT',
        required: ['recommendedActivities'],
        properties: {
          recommendedActivities: {
            type: 'ARRAY',
            items: activitySchema,
          },
        },
      }
      : {
      type: 'OBJECT',
      required: ['activities'],
      properties: {
        activities: {
          type: 'ARRAY',
          items: recommendedActivitySchema,
        },
      },
    };

  try {
    const usage = await reserveAIUsage(request.auth.uid);
    const projectId = process.env.GCLOUD_PROJECT || JSON.parse(process.env.FIREBASE_CONFIG || '{}').projectId;
    if (!projectId) throw new HttpsError('failed-precondition', 'Google Cloud project is not configured.');
    const accessToken = await googleAuth.getAccessToken();
    if (!accessToken) throw new HttpsError('unauthenticated', 'Vertex AI authentication failed.');
    const endpoint = `https://aiplatform.googleapis.com/v1/projects/${projectId}/locations/${VERTEX_LOCATION}/publishers/google/models/${GEMINI_MODEL}:generateContent`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: mode === 'optimize-route' ? 0.3 : 0.7,
          maxOutputTokens: mode === 'create-plan' || mode === 'assistant' ? 16384 : 4096,
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: 'application/json',
          responseSchema,
        },
      }),
    });
    if (!response.ok) {
      console.error('Gemini request failed', response.status, await response.text());
      throw new HttpsError('unavailable', 'The AI planner is temporarily unavailable.');
    }
    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
    const generated = JSON.parse(text);
    const action = mode === 'assistant' ? generated.action : mode;
    if (action === 'optimize-route') {
      if (currentActivities.length < 2) throw new HttpsError('invalid-argument', 'At least two activities with locations are required to optimize a route.');
      const currentById = new Map(currentActivities.map((activity) => [activity.id, activity]));
      const seenIds = new Set();
      const optimizedActivities = (Array.isArray(generated.optimizedActivities) ? generated.optimizedActivities : [])
        .slice(0, currentActivities.length)
        .map((activity) => cleanOptimizedActivity(activity, currentById))
        .filter((activity) => {
          if (!activity || seenIds.has(activity.id)) return false;
          seenIds.add(activity.id);
          return true;
        });
      if (optimizedActivities.length < 2) throw new HttpsError('internal', 'The AI planner returned no usable route.');
      return { action, optimizedActivities, usage };
    }
    if (action === 'recommend-activities') {
      const recommendedActivities = (Array.isArray(generated.recommendedActivities) ? generated.recommendedActivities : [])
        .slice(0, 4)
        .map((activity) => cleanRecommendedActivity(activity, startDate, endDate))
        .filter(Boolean);
      if (!recommendedActivities.length) throw new HttpsError('internal', 'The AI planner returned no usable recommendations.');
      return { action, recommendedActivities, usage };
    }
    const maxActivities = tripLength * 10;
    const activities = (Array.isArray(generated.activities) ? generated.activities : [])
      .slice(0, maxActivities)
      .map((activity) => cleanActivity(activity, startDate, endDate))
      .filter(Boolean);
    if (!activities.length) throw new HttpsError('internal', 'The AI planner returned no usable activities.');
    return { action: 'create-plan', activities, usage };
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    console.error('AI itinerary generation failed', error);
    throw new HttpsError('internal', 'The AI itinerary could not be generated.');
  }
});
