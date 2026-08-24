# Mytinerary

## Firebase real-time collaboration

The app keeps a local backup in `localStorage` and syncs the active trip to
Cloud Firestore. Collaborators open the same shared trip URL and authenticate
anonymously.

The repository is connected to Firebase project `itinerary-hei08285744` and
uses the Hong Kong Firestore region (`asia-east2`). Deploy updates with:

```bash
firebase deploy
```

### Firebase setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Add a Web App under **Project settings > Your apps**.
3. Enable **Authentication > Sign-in method > Anonymous**.
4. Create a **Cloud Firestore** database.
5. Paste the Web App values into `js/firebase-config.js`.
6. Publish the rules from `firestore.rules` in **Firestore Database > Rules**.
7. Add the deployed site domain under **Authentication > Settings > Authorized domains**.

Example configuration:

```js
window.FIREBASE_CONFIG = {
	apiKey: 'your-api-key',
	authDomain: 'your-project.firebaseapp.com',
	projectId: 'your-project',
	storageBucket: 'your-project.firebasestorage.app',
	messagingSenderId: 'your-sender-id',
	appId: 'your-app-id',
};
```

After setup, open **Profile > Shared trip** and use **Share trip**. Anyone with
that URL can edit the same trip. Changes are delivered in real time; if two
people change the itinerary at nearly the same instant, the latest saved
snapshot wins.

## Korea maps and routing

Trips whose destination is Korea or a recognized Korean city use a no-key map
stack:

- Leaflet with OpenStreetMap tiles for the embedded map.
- Nominatim for Korean place search and geocoding.
- OSRM for estimated driving routes and travel-time matrices.
- Naver Maps search links for external navigation.

Other destinations continue to use Google Maps. A mixed-country trip keeps the
Google trip-map canvas while each Korean activity still opens with Naver Maps
and uses the Korea route provider. No Naver API credentials are required.

Nominatim requests run through Firebase Functions with a descriptive User-Agent,
a 1.1-second per-instance delay, and a 30-day Firestore cache. The public
Nominatim and OSRM endpoints have no production SLA and may rate-limit or reject
heavy traffic. They are appropriate for development and low-traffic prototypes.
For production, host Nominatim/OSRM yourself or replace the endpoint with a
commercial provider while preserving the normalized callable response.

The current Korea integration is driving-first and OSRM times are estimates,
not live-traffic predictions. ODsay public-transit routing can be added as a
separate provider without changing the normalized route data supplied to
Aitinerary.

The provided rules require an authenticated Firebase session, but possession
of the shared URL grants access to its trip. Add explicit user membership and
stricter rules before using the app for sensitive travel information.

## Aitinerary

The **Aitinerary** button calls an authenticated Firebase callable function and
adds the generated activities to the current itinerary. Existing activities
are preserved. The function uses Gemini 2.5 Flash through Vertex AI and
authenticates with the Cloud Function runtime service account. No browser or
server API key is required.

Each authenticated Firebase UID can request up to five AI plans per UTC day.
The limit is enforced atomically by the Cloud Function in the `_aiUsage`
Firestore collection, which browser clients cannot access under the provided
rules. The `getAIUsageStatus` callable shows the current remaining usage in the
planner without consuming a request. Clearing browser data can create a new
anonymous UID, so App Check and Google Cloud quotas are still recommended for a
public deployment.

The planner uses one prompt for all tasks. The model identifies whether the user
wants a new trip, nearby activity recommendations, or route optimization, then
shows the corresponding preview. No trip data changes until the matching Apply
button is selected. Route optimization changes only activity times and transport
notes; titles, places, dates, expenses, remarks, and existing flight times remain
unchanged. Before route optimization, the browser supplies a Google Maps travel-time
matrix for same-day stops so the model can reduce total travel time and long transfers
without sacrificing meals, rest, opening-hour practicality, or worthwhile experiences.
Verified travel times also appear in the preview. Activity recommendations balance
traveler fit, local character, variety, pace, setting, accessibility, and geographic
fit; ratings and review volume are reliability signals rather than primary ranking
factors.

Each trip keeps its five most recent verified AI previews. The **Recent Aitinerary** list
can reopen a generated trip, activity suggestion, or route preview without using
another AI request, and individual entries can be deleted. History is part of the
trip snapshot, so it follows trip switching and Firebase collaboration sync.

For live integration testing, add an authenticated UID to the server-only
`_aiTesters` collection with `{ "enabled": true }`. Tester calls bypass
`_aiUsage` and the planner displays **Unlimited tester access**. Never hardcode
tester UIDs in browser or Function source. Delete the `_aiTesters/{uid}` document
to restore the normal daily limit. Firebase Emulator Suite remains preferable
for automated and destructive tests; use the allowlist only when real Vertex AI
and Google Maps integration must be exercised.

Prerequisites:

1. Upgrade the Firebase project to the Blaze plan so Cloud Functions can make
	outbound requests.
2. Enable the Vertex AI API for the Firebase Google Cloud project.
3. Grant the **Vertex AI User** role to the Cloud Function runtime service
	account in Google Cloud IAM.
4. Install the Firebase CLI and sign in with an account that can deploy the
	project.

Install the function dependencies and deploy:

```bash
npm install --prefix functions
firebase deploy --only functions,hosting
```

Anonymous Authentication must remain enabled because the callable function
rejects unauthenticated requests. For a public production deployment, enable
Firebase App Check and request quotas to further limit automated abuse and
unexpected model costs.