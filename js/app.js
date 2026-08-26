const STORAGE_KEY = 'itinerary-app-data';

// Fixed Google Maps API key (restrict it to your domain via HTTP referrer restrictions in Google Cloud Console).
const GOOGLE_MAPS_API_KEY = 'AIzaSyDpcKhIMm0_2uX79oKv1WkvZOSyXhCWX74';

const state = loadState();
const requestedTripId = new URLSearchParams(window.location.search).get('trip');
if (/^[a-zA-Z0-9_-]{8,80}$/.test(requestedTripId || '')) state.activeTripId = requestedTripId;
let selectedDayIndex = 0;
const weatherCache = {};
let weatherRequestId = 0;
let destinationClockTimer = null;
let destinationClockRequestId = 0;
let currentDestinationCity = '';
let currentDestinationCoordinates = null;
let collaborationStarted = false;
let applyingRemoteState = false;
let cloudSaveTimer = null;
let aiPlansRemaining = null;
let aiPlansUnlimited = false;
let pendingAIRoutePreview = null;
let pendingAICreatePreview = null;
let pendingAIActivitySuggestions = null;
let pendingAIReferencePlaceList = null;
let aiReferencePlaces = [];

const tripNameInput = document.getElementById('tripName');
const tripDestinationInput = document.getElementById('tripDestination');
const tripStartDateInput = document.getElementById('tripStartDate');
const tripEndDateInput = document.getElementById('tripEndDate');
const themeButtons = document.querySelectorAll('[data-theme-option]');
const mapStatus = document.getElementById('mapStatus');
const mapLegend = document.getElementById('mapLegend');
const tripMapEl = document.getElementById('tripMap');
const activityForm = document.getElementById('activityForm');
const itineraryDays = document.getElementById('itineraryDays');
const emptyState = document.getElementById('emptyState');
const addActivityBtn = document.getElementById('addActivityBtn');
const aiPlanBtn = document.getElementById('aiPlanBtn');
const aiPlanUsageBadge = document.getElementById('aiPlanUsageBadge');
const aitineraryAssistantDock = document.getElementById('aitineraryAssistantDock');
const hideAitineraryBtn = document.getElementById('hideAitineraryBtn');
const showAitineraryBtn = document.getElementById('showAitineraryBtn');
const aiPlannerModal = document.getElementById('aiPlannerModal');
const aiPlannerForm = document.getElementById('aiPlannerForm');
const closeAIPlannerBtn = document.getElementById('closeAIPlannerBtn');
const generateAIPlanBtn = document.getElementById('generateAIPlanBtn');
const aiPlannerDestination = document.getElementById('aiPlannerDestination');
const aiPlannerStartDate = document.getElementById('aiPlannerStartDate');
const aiPlannerEndDate = document.getElementById('aiPlannerEndDate');
const aiPlannerPreferences = document.getElementById('aiPlannerPreferences');
const aiPlacesFileInput = document.getElementById('aiPlacesFileInput');
const aiPlacesFileSummary = document.getElementById('aiPlacesFileSummary');
const aiPlacesFileName = document.getElementById('aiPlacesFileName');
const removeAIPlacesFileBtn = document.getElementById('removeAIPlacesFileBtn');
const aiPlannerStatus = document.getElementById('aiPlannerStatus');
const aiPlannerUsageRemaining = document.getElementById('aiPlannerUsageRemaining');
const aiPlannerUsageReset = document.getElementById('aiPlannerUsageReset');
const aiPlannerUid = document.getElementById('aiPlannerUid');
const aiPlannerAccessLevel = document.getElementById('aiPlannerAccessLevel');
const aiThinkingIndicator = document.getElementById('aiThinkingIndicator');
const aiSearchHistory = document.getElementById('aiSearchHistory');
const aiSearchHistoryList = document.getElementById('aiSearchHistoryList');
const aiPlannerDetailsTitle = document.getElementById('aiPlannerDetailsTitle');
const aiPlannerDescription = document.getElementById('aiPlannerDescription');
const aiRoutePreview = document.getElementById('aiRoutePreview');
const aiRoutePreviewList = document.getElementById('aiRoutePreviewList');
const aiRoutePreviewSummary = document.getElementById('aiRoutePreviewSummary');
const applyAIRouteBtn = document.getElementById('applyAIRouteBtn');
const aiPreviewTitle = document.getElementById('aiPreviewTitle');
const activityModalOverlay = document.getElementById('activityModalOverlay');
const closeActivityModalBtn = document.getElementById('closeActivityModalBtn');
const activityLocationInput = document.getElementById('activityLocation');
const activityRatingInput = document.getElementById('activityRating');
const activityDescriptionInput = document.getElementById('activityDescription');
const activityMapProviderInput = document.getElementById('activityMapProvider');
const activityWebsiteInput = document.getElementById('activityWebsite');
const activityExpenseInput = document.getElementById('activityExpense');
const activityExpenseCurrencyInput = document.getElementById('activityExpenseCurrency');
const activityPaymentMethodInput = document.getElementById('activityPaymentMethod');
const activityCardNetworkField = document.getElementById('activityCardNetworkField');
const activityCardNetworkInput = document.getElementById('activityCardNetwork');
const activityCardMarkupField = document.getElementById('activityCardMarkupField');
const activityCardMarkupInput = document.getElementById('activityCardMarkup');
const activityCardRateHint = document.getElementById('activityCardRateHint');
const activityPaidByInput = document.getElementById('activityPaidBy');
const activityBillMemberInput = document.getElementById('activityBillMember');
const activitySettledInput = document.getElementById('activitySettled');
const locationSuggestions = document.getElementById('locationSuggestions');
const activityCategoryInput = document.getElementById('activityCategory');
const flightDetails = document.getElementById('flightDetails');
const shoppingDetails = document.getElementById('shoppingDetails');
const shoppingNameInput = document.getElementById('shoppingNameInput');
const shoppingImageInput = document.getElementById('shoppingImageInput');
const shoppingProductUrlInput = document.getElementById('shoppingProductUrlInput');
const shoppingImagePreview = document.getElementById('shoppingImagePreview');
const shoppingImageStatus = document.getElementById('shoppingImageStatus');
const shoppingItemList = document.getElementById('shoppingItemList');
let shoppingItemsDraft = [];
const AITINERARY_LAUNCHER_HIDDEN_KEY = 'mytinerary-aitinerary-launcher-hidden';
const MAX_AI_PLACES_FILE_BYTES = 2 * 1024 * 1024;
const placeLookupStatus = document.getElementById('placeLookupStatus');

const currencyFromInput = document.getElementById('currencyFrom');
const currencyToInput = document.getElementById('currencyTo');
const currencySwapBtn = document.getElementById('currencySwapBtn');
const currencyAmountInput = document.getElementById('currencyAmount');
const currencyResult = document.getElementById('currencyResult');
const currencyRateStatus = document.getElementById('currencyRateStatus');
const walletBudgetInput = document.getElementById('walletBudget');
const budgetCurrencyLabel = document.getElementById('budgetCurrencyLabel');
const walletTotalSpent = document.getElementById('walletTotalSpent');
const walletBudgetLeft = document.getElementById('walletBudgetLeft');
const expenseList = document.getElementById('expenseList');
const memberOwesSummary = document.getElementById('memberOwesSummary');
const billTabs = document.getElementById('billTabs');
const settlementLog = document.getElementById('settlementLog');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const expenseModalOverlay = document.getElementById('expenseModalOverlay');
const closeExpenseModalBtn = document.getElementById('closeExpenseModalBtn');
const expenseForm = document.getElementById('expenseForm');
const billMemberInput = document.getElementById('billMember');
const billPaidByInput = document.getElementById('billPaidBy');
const billSettledInput = document.getElementById('billSettled');
const billExpenseCurrencyInput = document.getElementById('billExpenseCurrency');
const billPaymentMethodInput = document.getElementById('billPaymentMethod');
const billCardNetworkField = document.getElementById('billCardNetworkField');
const billCardNetworkInput = document.getElementById('billCardNetwork');
const billCardMarkupField = document.getElementById('billCardMarkupField');
const billCardMarkupInput = document.getElementById('billCardMarkup');
const billCardRateHint = document.getElementById('billCardRateHint');
const removeExpenseBtn = document.getElementById('removeExpenseBtn');
const splitBillModalOverlay = document.getElementById('splitBillModalOverlay');
const closeSplitBillModalBtn = document.getElementById('closeSplitBillModalBtn');
const cancelSplitBillBtn = document.getElementById('cancelSplitBillBtn');
const applySplitBillBtn = document.getElementById('applySplitBillBtn');
const splitBillMemberOptions = document.getElementById('splitBillMemberOptions');
let currentExchangeRate = null;
const expenseConversionRates = {};
const CARD_MARKUP_BY_NETWORK = {
  visa: 1.95,
  mastercard: 1.95,
  amex: 2,
  unionpay: 1,
};
const CARD_NETWORK_LABELS = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  unionpay: 'UnionPay',
};

function getCardMarkupForNetwork(network) {
  return CARD_MARKUP_BY_NETWORK[network] ?? CARD_MARKUP_BY_NETWORK.visa;
}

function getCardNetworkLabel(network) {
  return CARD_NETWORK_LABELS[network] ?? CARD_NETWORK_LABELS.visa;
}

// Shows/hides the card network + markup fields depending on the chosen payment method.
function toggleCardFields(methodSelect, networkField, markupField, rateHint) {
  const isCard = methodSelect.value === 'card';
  networkField.classList.toggle('hidden', !isCard);
  markupField.classList.toggle('hidden', !isCard);
  rateHint.classList.toggle('hidden', !isCard);
}

activityPaymentMethodInput.addEventListener('change', () => (
  toggleCardFields(activityPaymentMethodInput, activityCardNetworkField, activityCardMarkupField, activityCardRateHint)
));
billPaymentMethodInput.addEventListener('change', () => (
  toggleCardFields(billPaymentMethodInput, billCardNetworkField, billCardMarkupField, billCardRateHint)
));
activityCardNetworkInput.addEventListener('change', () => {
  activityCardMarkupInput.value = getCardMarkupForNetwork(activityCardNetworkInput.value);
});
billCardNetworkInput.addEventListener('change', () => {
  billCardMarkupInput.value = getCardMarkupForNetwork(billCardNetworkInput.value);
});
let editingActivityId = null;
let editingBillId = null;
let selectedBillMember = 'all';
let highlightedOwedMember = '';
let isDebtSetoffActive = false;
let splittingBillId = null;
let currentPlaceAddress = '';
let currentPlaceId = '';
let currentPlaceCoordinates = null;
let currentNaverPlaceName = '';
let currentGoogleReviewCount = 0;
let currentPlaceWebsite = '';

const routeList = document.getElementById('routeList');
const routeStatus = document.getElementById('routeStatus');
const routeModeSelect = document.getElementById('routeMode');
const routeModeButtons = document.querySelectorAll('[data-route-mode]');
const savedRoutePanel = document.getElementById('savedRoutePanel');
const savedRoutePlatform = document.getElementById('savedRoutePlatform');
const spotASelect = document.getElementById('spotASelect');
const spotBSelect = document.getElementById('spotBSelect');
const spotRouteStatus = document.getElementById('spotRouteStatus');
const spotRouteResult = document.getElementById('spotRouteResult');
const spotFareGrid = document.getElementById('spotFareGrid');
const saveSuggestedRouteBtn = document.getElementById('saveSuggestedRouteBtn');

const topBarTripName = document.getElementById('topBarTripName');
const topBarDestination = document.getElementById('topBarDestination');
const topBarBonVoyage = document.getElementById('topBarBonVoyage');
const settingsBtn = document.getElementById('settingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const tripSettings = document.getElementById('tripSettings');
const dayStrip = document.getElementById('dayStrip');
const appViews = document.querySelectorAll('[data-app-view]');
const appTabs = document.querySelectorAll('[data-app-tab]');
const appTabBar = document.querySelector('.app-tab-bar');
const appTabIndicator = document.querySelector('.app-tab-indicator');
const profileInitials = document.getElementById('profileInitials');
const profileTripName = document.getElementById('profileTripName');
const profileDestination = document.getElementById('profileDestination');
const profileDayCount = document.getElementById('profileDayCount');
const profileMemberCount = document.getElementById('profileMemberCount');
const profileItemCount = document.getElementById('profileItemCount');
const editTripProfileBtn = document.getElementById('editTripProfileBtn');
const greetingScript = document.getElementById('greetingScript');
const greetingTitle = document.getElementById('greetingTitle');
const greetingSub = document.getElementById('greetingSub');
const todayDate = document.getElementById('todayDate');
const todayLocation = document.getElementById('todayLocation');
const todayBadge = document.querySelector('.today-badge');
const todayTime = document.getElementById('todayTime');
const todayTimeMeta = document.getElementById('todayTimeMeta');
const todayTimeLocation = document.getElementById('todayTimeLocation');
const todayWeatherDescription = document.getElementById('todayWeatherDescription');
const todayTemperature = document.getElementById('todayTemperature');
const todayWeatherIcon = document.getElementById('todayWeatherIcon');
const languageSelect = document.getElementById('languageSelect');
const targetCurrencySelect = document.getElementById('targetCurrencySelect');
const cityPeriods = document.getElementById('cityPeriods');
const addCityBtn = document.getElementById('addCityBtn');
const profileImportItineraryInput = document.getElementById('profileImportItineraryInput');
const profileExportItineraryBtn = document.getElementById('profileExportItineraryBtn');
const newTripBtn = document.getElementById('newTripBtn');
const profileTripLibrary = document.getElementById('profileTripLibrary');
const collaborationStatus = document.getElementById('collaborationStatus');
const collaborationStatusText = document.getElementById('collaborationStatusText');
const shareTripBtn = document.getElementById('shareTripBtn');
const shareTripBtnText = document.getElementById('shareTripBtnText');
const shoppingHaulList = document.getElementById('shoppingHaulList');
const shoppingHaulCount = document.getElementById('shoppingHaulCount');
const shoppingHaulProgress = document.getElementById('shoppingHaulProgress');
const shoppingHaulForm = document.getElementById('shoppingHaulForm');
const shoppingHaulActivity = document.getElementById('shoppingHaulActivity');
const shoppingHaulName = document.getElementById('shoppingHaulName');
const shoppingHaulImage = document.getElementById('shoppingHaulImage');
const shoppingHaulUrl = document.getElementById('shoppingHaulUrl');
const shoppingHaulImagePreview = document.getElementById('shoppingHaulImagePreview');
const shoppingHaulImageStatus = document.getElementById('shoppingHaulImageStatus');
const shoppingHaulModal = document.getElementById('shoppingHaulModal');
const openShoppingHaulFormBtn = document.getElementById('openShoppingHaulFormBtn');
const closeShoppingHaulFormBtn = document.getElementById('closeShoppingHaulFormBtn');
const removeShoppingHaulItemBtn = document.getElementById('removeShoppingHaulItemBtn');
const shoppingHaulSubmitBtn = document.getElementById('shoppingHaulSubmitBtn');
const shoppingHaulModalTitle = document.getElementById('shoppingHaulModalTitle');
const shoppingHaulTotal = document.getElementById('shoppingHaulTotal');
const shoppingHaulDone = document.getElementById('shoppingHaulDone');
const shoppingHaulRemaining = document.getElementById('shoppingHaulRemaining');
const shoppingHaulPercent = document.getElementById('shoppingHaulPercent');
let editingShoppingItem = null;
let editingShoppingActivity = null;
let shoppingProductLookupId = 0;
let shoppingHaulProductLookupId = 0;
const memberNameInput = document.getElementById('memberNameInput');
const addMemberBtn = document.getElementById('addMemberBtn');
const memberList = document.getElementById('memberList');

const TRANSLATIONS = {
  en: {
    tripDetails: 'Trip Details', tripName: 'Trip Name', destination: 'Destination', theme: 'Theme', settings: 'Settings', language: 'Language', targetCurrency: 'Target currency',
    startDate: 'Start Date', endDate: 'End Date', saveClose: 'Save & Close', today: 'TODAY',
    addItem: '+ Add Item', aiPlan: 'Aitinerary', clearDay: 'Clear Day', tripMap: 'Trip Map', route: 'Route', suggestedRoute: 'Suggested route · Google Maps', bestTravelMode: 'Best travel mode', spotA: 'Spot A', spotB: 'Spot B', saveRoute: 'Save route', savedRoutes: 'Saved routes',
    travelMode: 'Travel Mode', driving: 'Driving', automobile: 'Car', walking: 'Walk', bicycling: 'Bicycle', transit: 'Transit', mapPlatform: 'Map platform',
    itinerary: 'Itinerary', profile: 'Profile', tripProfile: 'Trip profile', editTrip: 'Edit trip', tripFiles: 'Trip Files', tripFilesHint: 'Load another saved itinerary to replace this trip.', loadAnotherTrip: 'Load another trip', trips: 'Trips', currentTrip: 'Current trip', removeSavedTrip: 'Remove saved trip', removeSavedTripConfirm: 'Remove this saved trip?', days: 'Days', items: 'Items', wallet: 'Wallet', tripBudget: 'Trip budget', totalSpent: 'Total spent', budgetLeft: 'Budget left', currencyExchange: 'Currency Exchange', bills: 'Bills', billsRateNote: 'Credit card amounts apply your entered markup over the European Central Bank (ECB) reference rate.', addExpense: '+ Add Expense',
    multipleCities: 'Multiple cities', addCity: '+ Add city', city: 'City', remove: 'Remove', editItem: 'Edit Item', saveItem: 'Save Item',
    members: 'Trip members', addMember: '+ Add', memberPlaceholder: 'e.g. Alex', shoppingHaul: 'Shopping Haul', shoppingHaulKicker: 'Shopping haul', shoppingHaulHint: 'Keep every shopping target in one place.', targetItems: 'Target items',
    exportItinerary: 'Download trip', importItinerary: 'Load itinerary', newTrip: '+ New trip', sharedTrip: 'Shared trip', shareTrip: 'Share trip',
  },
  zh: {
    tripDetails: '行程詳情', tripName: '行程名稱', destination: '目的地', theme: '主題', settings: '設定', language: '語言', targetCurrency: '目標貨幣',
    startDate: '開始日期', endDate: '結束日期', saveClose: '儲存並關閉', today: '今天',
    addItem: '+ 新增項目', aiPlan: 'Aitinerary', clearDay: '清除當天', tripMap: '行程地圖', route: '路線', suggestedRoute: '建議路線 · Google 地圖', bestTravelMode: '最佳交通方式', spotA: '地點 A', spotB: '地點 B', saveRoute: '儲存路線', savedRoutes: '已儲存路線',
    travelMode: '交通方式', driving: '開車', automobile: '汽車', walking: '步行', bicycling: '自行車', transit: '大眾運輸', mapPlatform: '地圖平台',
    itinerary: '行程', profile: '個人檔案', tripProfile: '行程檔案', editTrip: '編輯行程', tripFiles: '行程檔案', tripFilesHint: '載入另一個已儲存的行程以取代目前行程。', loadAnotherTrip: '載入其他行程', trips: '行程', currentTrip: '目前行程', removeSavedTrip: '移除已儲存行程', removeSavedTripConfirm: '要移除這個已儲存行程嗎？', days: '天', items: '項目', wallet: '錢包', tripBudget: '旅程預算', totalSpent: '已支出', budgetLeft: '剩餘預算', currencyExchange: '貨幣兌換', bills: '帳單', billsRateNote: '信用卡金額會在歐洲央行（ECB）參考匯率上，加計你輸入的加成％。', addExpense: '+ 新增支出',
    multipleCities: '多城市行程', addCity: '+ 新增城市', city: '城市', remove: '移除', editItem: '編輯項目', saveItem: '儲存項目',
    members: '同行成員', addMember: '+ 新增', memberPlaceholder: '例如：小明', shoppingHaul: '購物清單', shoppingHaulKicker: '購物整理', shoppingHaulHint: '把所有想買的商品集中在這裡。', targetItems: '目標商品',
    exportItinerary: '下載行程', importItinerary: '載入行程', newTrip: '+ 新行程', sharedTrip: '共享行程', shareTrip: '分享行程',
  },
};

function t(key) {
  return TRANSLATIONS[state.language || 'en'][key] || TRANSLATIONS.en[key] || key;
}

function applyTranslations() {
  const language = state.language || 'en';
  document.documentElement.lang = language === 'zh' ? 'zh-Hant' : 'en';
  languageSelect.value = language;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  if (collaborationStatus?.dataset.status) updateCollaborationStatus(collaborationStatus.dataset.status);
  settingsBtn.setAttribute('aria-label', language === 'zh' ? '行程設定' : 'Trip settings');
  renderCityPeriods();
  renderMembers();
  updateAIPlanUsage();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved itinerary', e);
  }
  return {
    tripName: '',
    tripDestination: '',
    tripStartDate: '',
    tripEndDate: '',
    multipleCities: false,
    cities: [],
    members: [],
    language: 'en',
    departureFlight: '',
    returnFlight: '',
    geocodeCache: {},
    activities: [],
    bills: [],
    routeFees: {},
    settlementLogs: [],
    walletBudget: 0,
    theme: 'cobalt',
    savedRoutes: [],
    aiSearchHistory: [],
    walletTargetCurrency: 'HKD',
  };
}

function saveState() {
  syncCurrentTripToLibrary();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (!collaborationStarted || applyingRemoteState || !window.itinerarySync?.isConfigured()) return;
  clearTimeout(cloudSaveTimer);
  const tripId = state.activeTripId;
  const snapshot = createTripSnapshot();
  cloudSaveTimer = setTimeout(() => {
    if (state.activeTripId === tripId) window.itinerarySync.save(tripId, snapshot);
  }, 350);
}

function createTripId() {
  return `trip-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function createTripSnapshot() {
  const snapshot = { ...state };
  delete snapshot.tripLibrary;
  delete snapshot.activeTripId;
  return snapshot;
}

function syncCurrentTripToLibrary() {
  if (!Array.isArray(state.tripLibrary)) state.tripLibrary = [];
  if (!state.activeTripId) state.activeTripId = createTripId();
  const snapshot = { id: state.activeTripId, savedAt: new Date().toISOString(), data: createTripSnapshot() };
  const index = state.tripLibrary.findIndex((trip) => trip.id === state.activeTripId);
  if (index >= 0) state.tripLibrary[index] = snapshot;
  else state.tripLibrary.unshift(snapshot);
}

function updateCollaborationStatus(status) {
  if (!collaborationStatus || !collaborationStatusText) return;
  const labels = state.language === 'zh'
    ? { 'not-configured': '需要設定 Firebase', connecting: '連線中…', saving: '儲存中…', online: '已同步', error: '同步無法使用' }
    : { 'not-configured': 'Firebase setup required', connecting: 'Connecting…', saving: 'Saving…', online: 'Synced', error: 'Sync unavailable' };
  collaborationStatus.dataset.status = status;
  collaborationStatusText.textContent = labels[status] || labels.error;
  if (shareTripBtn) shareTripBtn.disabled = status === 'not-configured' || status === 'error';
}

function applyRemoteTrip(remoteState) {
  if (!remoteState || typeof remoteState !== 'object') return;
  applyingRemoteState = true;
  const tripLibrary = state.tripLibrary || [];
  const activeTripId = state.activeTripId;
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, remoteState, { tripLibrary, activeTripId });
  syncCurrentTripToLibrary();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  init();
  applyingRemoteState = false;
}

function connectActiveTrip() {
  if (!collaborationStarted || !window.itinerarySync) return;
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.set('trip', state.activeTripId);
  window.history.replaceState(null, '', shareUrl);
  window.itinerarySync.connect({
    tripId: state.activeTripId,
    initialState: createTripSnapshot(),
    onRemoteState: applyRemoteTrip,
    onStatus: updateCollaborationStatus,
  });
}

async function copyActiveTripLink() {
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.set('trip', state.activeTripId);
  try {
    await navigator.clipboard.writeText(shareUrl.toString());
    shareTripBtnText.textContent = state.language === 'zh' ? '已複製連結' : 'Link copied';
    setTimeout(() => {
      shareTripBtnText.textContent = t('shareTrip');
    }, 1800);
  } catch (error) {
    window.prompt(state.language === 'zh' ? '複製此行程連結' : 'Copy this trip link', shareUrl.toString());
  }
}

function initializeCollaboration() {
  collaborationStarted = true;
  if (shareTripBtn) shareTripBtn.addEventListener('click', copyActiveTripLink);
  connectActiveTrip();
}

function init() {
  if (!TRANSLATIONS[state.language]) state.language = 'en';
  tripNameInput.value = state.tripName || '';
  tripDestinationInput.value = state.tripDestination || '';
  tripStartDateInput.value = state.tripStartDate || '';
  tripEndDateInput.value = state.tripEndDate || '';
  if (!['joy', 'violet', 'cobalt', 'coffee'].includes(state.theme)) state.theme = 'cobalt';
  applyTheme();
  setAitineraryLauncherHidden(localStorage.getItem(AITINERARY_LAUNCHER_HIDDEN_KEY) === 'true', false);
  if (!state.geocodeCache) state.geocodeCache = {};
  if (!state.bills) state.bills = [];
  if (!state.routeFees) state.routeFees = {};
  if (!Array.isArray(state.settlementLogs)) state.settlementLogs = [];
  if (!isFinite(Number(state.walletBudget))) state.walletBudget = 0;
  if (!Array.isArray(state.savedRoutes)) state.savedRoutes = [];
  if (!Array.isArray(state.aiSearchHistory)) state.aiSearchHistory = [];
  if (!state.walletTargetCurrency) state.walletTargetCurrency = 'HKD';
  walletBudgetInput.value = state.walletBudget;
  if (!Array.isArray(state.cities)) state.cities = [];
  if (!Array.isArray(state.members)) state.members = [];
  if (!Array.isArray(state.tripLibrary)) state.tripLibrary = [];
  if (!state.activeTripId) state.activeTripId = createTripId();
  if (!state.cities.length && (state.tripDestination || state.tripStartDate || state.tripEndDate)) {
    state.cities = [{ destination: state.tripDestination, startDate: state.tripStartDate, endDate: state.tripEndDate }];
  }
  if (state.multipleCities && state.cities[0]) {
    state.tripDestination = state.cities[0].destination || '';
    state.tripStartDate = state.cities[0].startDate || '';
    state.tripEndDate = state.cities[0].endDate || '';
  }
  state.multipleCities = state.cities.length > 1;
  syncCurrentTripToLibrary();
  renderCityPeriods();
  renderMembers();
  selectedDayIndex = closestDayIndexToToday();
  render();
  loadTripMapProvider();
  if (collaborationStarted) connectActiveTrip();
}

languageSelect.addEventListener('change', () => {
  state.language = languageSelect.value === 'zh' ? 'zh' : 'en';
  saveState();
  render();
});

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.theme = button.dataset.themeOption;
    applyTheme();
    saveState();
  });
});

function applyTheme() {
  document.documentElement.dataset.theme = state.theme || 'joy';
  themeButtons.forEach((button) => {
    const isSelected = button.dataset.themeOption === state.theme;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
  if (map && activeMapProvider === 'google') map.setOptions({ styles: getTravelMapStyles(state.theme) });
}

settingsBtn.addEventListener('click', () => {
  tripSettings.classList.toggle('hidden');
});

closeSettingsBtn.addEventListener('click', () => {
  tripSettings.classList.add('hidden');
});

appTabs.forEach((tab) => {
  tab.addEventListener('click', () => setActiveAppView(tab.dataset.appTab));
});

editTripProfileBtn.addEventListener('click', () => {
  setActiveAppView('itinerary');
  tripSettings.classList.remove('hidden');
  tripSettings.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function setActiveAppView(viewName) {
  document.body.dataset.activeView = viewName;
  appViews.forEach((view) => {
    view.classList.toggle('app-view-hidden', view.dataset.appView !== viewName);
  });
  appTabs.forEach((tab) => {
    const isActive = tab.dataset.appTab === viewName;
    tab.classList.toggle('is-active', isActive);
    tab.toggleAttribute('aria-current', isActive);
  });
  updateAppTabIndicator();
  if (viewName === 'map' && mapsApiLoaded) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (activeMapProvider === 'naver') map.invalidateSize({ animate: false });
        else google.maps.event.trigger(map, 'resize');
        updateMapMarkers();
      });
    });
  }
}

function updateAppTabIndicator() {
  const activeTab = document.querySelector('.app-tab.is-active');
  if (!activeTab) return;
  const barBounds = appTabBar.getBoundingClientRect();
  const tabBounds = activeTab.getBoundingClientRect();
  appTabBar.style.setProperty('--active-tab-x', `${tabBounds.left - barBounds.left + tabBounds.width / 2}px`);
  appTabIndicator.innerHTML = activeTab.querySelector('svg').outerHTML;
}

window.addEventListener('resize', updateAppTabIndicator);

setActiveAppView('itinerary');

addMemberBtn.addEventListener('click', addMember);
memberNameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addMember();
  }
});

function addMember() {
  const name = memberNameInput.value.trim();
  if (!name) return;
  if (!Array.isArray(state.members)) state.members = [];
  if (!state.members.includes(name)) state.members.push(name);
  memberNameInput.value = '';
  saveState();
  render();
  memberNameInput.focus();
}

function renderMembers() {
  if (!memberList) return;
  memberList.innerHTML = '';
  (state.members || []).forEach((name, index) => {
    const chip = document.createElement('span');
    chip.className = 'member-chip';
    chip.textContent = name;
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = '×';
    removeButton.title = t('remove');
    removeButton.addEventListener('click', () => {
      state.members.splice(index, 1);
      saveState();
      render();
    });
    chip.appendChild(removeButton);
    memberList.appendChild(chip);
  });
}

tripNameInput.addEventListener('input', () => {
  state.tripName = tripNameInput.value;
  saveState();
  render();
});

tripDestinationInput.addEventListener('input', () => {
  state.tripDestination = tripDestinationInput.value;
  syncPrimaryCity();
  setDefaultWalletCurrencies(state.tripDestination);
  saveState();
  render();
});

tripDestinationInput.addEventListener('change', loadTripMapProvider);

tripStartDateInput.addEventListener('input', () => {
  state.tripStartDate = tripStartDateInput.value;
  syncPrimaryCity();
  saveState();
  selectedDayIndex = 0;
  render();
});

tripEndDateInput.addEventListener('input', () => {
  state.tripEndDate = tripEndDateInput.value;
  syncPrimaryCity();
  saveState();
  render();
});

addCityBtn.addEventListener('click', () => {
  if (!state.cities.length) syncPrimaryCity();
  state.multipleCities = true;
  state.cities.push({ destination: '', startDate: '', endDate: '' });
  saveState();
  render();
});

function downloadItinerary() {
  const exportData = { ...state, exportedAt: new Date().toISOString(), formatVersion: 1 };
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `${(state.tripName || 'itinerary').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'itinerary'}.json`;
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

profileExportItineraryBtn.addEventListener('click', downloadItinerary);

newTripBtn.addEventListener('click', () => {
  saveState();
  const tripLibrary = state.tripLibrary || [];
  const language = state.language || 'en';
  const theme = state.theme || 'joy';
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, {
    tripName: '', tripDestination: '', tripStartDate: '', tripEndDate: '', multipleCities: false,
    cities: [], members: [], language, departureFlight: '', returnFlight: '', geocodeCache: {},
    activities: [], bills: [], routeFees: {}, walletBudget: 0, theme, savedRoutes: [],
    aiSearchHistory: [],
    tripLibrary, activeTripId: createTripId(),
  });
  saveState();
  selectedDayIndex = 0;
  setActiveAppView('itinerary');
  tripSettings.classList.remove('hidden');
  init();
});

profileImportItineraryInput.addEventListener('change', () => loadItineraryFile(profileImportItineraryInput));

async function loadItineraryFile(input) {
  const file = input.files[0];
  input.value = '';
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    if (!imported || typeof imported !== 'object' || !Array.isArray(imported.activities)) {
      throw new Error('Invalid itinerary file');
    }
    const message = state.language === 'zh'
      ? '載入檔案會覆蓋目前行程，確定要繼續嗎？'
      : 'Loading this file will replace the current itinerary. Continue?';
    if (!confirm(message)) return;
    const tripLibrary = state.tripLibrary || [];
    Object.keys(state).forEach((key) => delete state[key]);
    Object.assign(state, imported);
    delete state.exportedAt;
    delete state.formatVersion;
    if (!Array.isArray(state.activities)) state.activities = [];
    if (!Array.isArray(state.bills)) state.bills = [];
    if (!Array.isArray(state.members)) state.members = [];
    if (!Array.isArray(state.cities)) state.cities = [];
    if (!state.geocodeCache) state.geocodeCache = {};
    if (!state.routeFees) state.routeFees = {};
    state.tripLibrary = tripLibrary;
    state.activeTripId = createTripId();
    state.multipleCities = state.cities.length > 1;
    saveState();
    init();
  } catch (error) {
    alert(state.language === 'zh' ? '無法載入行程檔案。' : 'Could not load this itinerary file.');
  }
}

function syncPrimaryCity() {
  if (!Array.isArray(state.cities)) state.cities = [];
  state.cities[0] = {
    destination: state.tripDestination || '',
    startDate: state.tripStartDate || '',
    endDate: state.tripEndDate || '',
  };
}

function renderCityPeriods() {
  const enabled = Boolean(state.multipleCities && state.cities.length > 1);
  cityPeriods.classList.toggle('hidden', !enabled);
  if (!enabled) {
    cityPeriods.innerHTML = '';
    return;
  }

  cityPeriods.innerHTML = state.cities.slice(1).map((city, index) => `
    <div class="city-period" data-city-index="${index + 1}">
      <div class="city-period-heading">
        <strong>${t('city')} ${index + 2}</strong>
        <button type="button" class="remove-city-btn" data-remove-city="${index + 1}">${t('remove')}</button>
      </div>
      <label>
        ${t('destination')}
        <input type="text" data-city-field="destination" value="${escapeAttribute(city.destination || '')}" placeholder="e.g. Kyoto">
      </label>
      <div class="city-period-dates">
        <label>${t('startDate')}<input type="date" data-city-field="startDate" value="${city.startDate || ''}"></label>
        <label>${t('endDate')}<input type="date" data-city-field="endDate" value="${city.endDate || ''}"></label>
      </div>
    </div>
  `).join('');
}

function escapeAttribute(value) {
  return String(value).replace(/[&"<>]/g, (character) => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' }[character]));
}

cityPeriods.addEventListener('input', (event) => {
  const field = event.target.dataset.cityField;
  const period = event.target.closest('.city-period');
  if (!field || !period) return;
  const index = Number(period.dataset.cityIndex);
  state.cities[index][field] = event.target.value;
  saveState();
});

cityPeriods.addEventListener('change', (event) => {
  if (!event.target.dataset.cityField) return;
  render();
  loadTripMapProvider();
});

cityPeriods.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove-city]');
  if (!button) return;
  state.cities.splice(Number(button.dataset.removeCity), 1);
  if (state.cities.length <= 1) state.multipleCities = false;
  saveState();
  render();
});

activityForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const date = document.getElementById('activityDate').value;
  const time = document.getElementById('activityTime').value;
  const enteredTitle = document.getElementById('activityTitle').value.trim();
  const category = document.getElementById('activityCategory').value;
  const location = document.getElementById('activityLocation').value.trim();
  const rating = document.getElementById('activityRating').value.trim();
  const description = document.getElementById('activityDescription').value.trim();
  const rawExpense = activityExpenseInput.value.trim();
  const expenseCurrency = activityExpenseCurrencyInput.value || getCurrencyForDestination(getCityForDate(date));
  const expense = normalizeExpenseValue(rawExpense, expenseCurrency);
  const remarks = document.getElementById('activityRemarks').value.trim();

  if (!date) return;
  const existingActivity = editingActivityId
    ? state.activities.find((item) => item.id === editingActivityId)
    : null;
  const title = enteredTitle || existingActivity?.title || location || (state.language === 'zh' ? '未命名項目' : 'Untitled item');

  const activityData = {
    date, time, title, category, location, rating, description, expense, remarks,
    paidBy: activityPaidByInput.value,
    billMember: activityBillMemberInput.value,
    settled: Boolean(existingActivity?.settled),
    settledMembers: existingActivity?.settledMembers || [],
    paymentMethod: activityPaymentMethodInput.value,
    cardNetwork: activityPaymentMethodInput.value === 'card' ? activityCardNetworkInput.value : '',
    cardMarkup: activityPaymentMethodInput.value === 'card' ? Number(activityCardMarkupInput.value) || 0 : 0,
    address: activityDescriptionInput.value.trim() || currentPlaceAddress,
    placeId: currentPlaceId,
    naverPlaceName: currentNaverPlaceName,
    latitude: currentPlaceCoordinates?.lat,
    longitude: currentPlaceCoordinates?.lng,
    googleReviewCount: currentGoogleReviewCount,
    mapProvider: activityMapProviderInput.value || getMapProviderForDate(date),
    naverUrl: existingActivity?.naverUrl || '',
    website: activityWebsiteInput.value.trim() || currentPlaceWebsite,
    shoppingItems: category === 'shopping' ? shoppingItemsDraft : [],
    upfrontPaymentTitle: document.getElementById('activityUpfrontPaymentTitle').value.trim(),
    bookingDetails: document.getElementById('activityBookingDetails').value.trim(),
    contactDetails: document.getElementById('activityContactDetails').value.trim(),
    flightNumber: document.getElementById('flightNumber').value.trim(),
    flightDeparture: document.getElementById('flightDeparture').value.trim(),
    flightArrival: document.getElementById('flightArrival').value.trim(),
    flightArrivalDate: document.getElementById('flightArrivalDate').value,
    flightArrivalTime: document.getElementById('flightArrivalTime').value,
    departureTerminal: document.getElementById('departureTerminal').value.trim(),
    departureGate: document.getElementById('departureGate').value.trim(),
    arrivalTerminal: document.getElementById('arrivalTerminal').value.trim(),
    arrivalGate: document.getElementById('arrivalGate').value.trim(),
  };
  let savedActivity;
  if (editingActivityId) {
    const activity = state.activities.find((item) => item.id === editingActivityId);
    if (activity) {
      Object.assign(activity, activityData);
      savedActivity = activity;
    }
  } else {
    savedActivity = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      ...activityData,
    };
    state.activities.push(savedActivity);
  }
  saveState();
  render();
  activityForm.reset();
  shoppingItemsDraft = [];
  editingActivityId = null;
  closeActivityModal();
});

addActivityBtn.addEventListener('click', () => {
  openActivityModal();
});

aiPlanBtn.addEventListener('click', openAIPlanner);
hideAitineraryBtn.addEventListener('click', () => setAitineraryLauncherHidden(true));
showAitineraryBtn.addEventListener('click', () => setAitineraryLauncherHidden(false));
closeAIPlannerBtn.addEventListener('click', closeAIPlanner);
applyAIRouteBtn.addEventListener('click', applyAIRoutePreview);
aiPlannerModal.addEventListener('click', (event) => {
  if (event.target === aiPlannerModal) closeAIPlanner();
});

function clearAIPlacesFile() {
  aiReferencePlaces = [];
  aiPlacesFileInput.value = '';
  aiPlacesFileName.textContent = '';
  aiPlacesFileSummary.classList.add('hidden');
}

function normalizeAIReferencePlaces(data) {
  let entries = [];
  if (Array.isArray(data)) {
    entries = data;
  } else if (data && typeof data === 'object') {
    const listKeys = ['places', 'savedPlaces', 'locations', 'items', 'activities', 'features'];
    const listKey = listKeys.find((key) => Array.isArray(data[key]));
    if (listKey) entries = data[listKey];
  }

  const seen = new Set();
  return entries.map((entry) => {
    if (typeof entry === 'string') return { name: entry.trim() };
    if (!entry || typeof entry !== 'object') return null;
    const properties = entry.properties && typeof entry.properties === 'object' ? entry.properties : entry;
    const normalizedProperties = Object.fromEntries(Object.entries(properties).map(([key, value]) => [
      key.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ''), value,
    ]));
    const getValue = (...keys) => keys.map((key) => normalizedProperties[key]).find((value) => value !== undefined && value !== null && value !== '');
    const locationValue = String(getValue('location', 'place', 'venue') || '').trim();
    const name = getValue('name', 'title', 'placename', 'locationname') || locationValue;
    const coordinates = Array.isArray(entry.geometry?.coordinates) ? entry.geometry.coordinates : [];
    return {
      name: typeof name === 'string' ? name.trim() : '',
      address: String(getValue('address', 'streetaddress', 'fulladdress') || locationValue || '').trim(),
      notes: String(getValue('notes', 'note', 'description', 'remarks', 'comment', 'comments') || '').trim(),
      category: inferActivityCategory(getValue('category', 'type', 'types')),
      date: String(getValue('date', 'visitdate') || '').trim(),
      longitude: Number.isFinite(Number(getValue('longitude', 'lng', 'lon') ?? coordinates[0])) ? Number(getValue('longitude', 'lng', 'lon') ?? coordinates[0]) : undefined,
      latitude: Number.isFinite(Number(getValue('latitude', 'lat') ?? coordinates[1])) ? Number(getValue('latitude', 'lat') ?? coordinates[1]) : undefined,
    };
  }).filter((place) => {
    if (!place?.name) return false;
    const key = `${place.name}|${place.address}`.toLocaleLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function readAIReferencePlacesFile(file) {
  const extension = file.name.split('.').pop()?.toLocaleLowerCase();
  if (extension === 'json') return JSON.parse(await file.text());
  if (!['csv', 'xls', 'xlsx', 'xlsm', 'ods'].includes(extension)) throw new Error('unsupported-file-type');
  if (!window.XLSX) throw new Error('spreadsheet-reader-unavailable');
  const workbook = window.XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];
  return window.XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], { defval: '', raw: false });
}

function inferActivityCategory(placeTypes, fallback = 'other') {
  const values = Array.isArray(placeTypes) ? placeTypes : [placeTypes];
  const normalized = values
    .flatMap((value) => String(value || '').toLocaleLowerCase().split(/[,/|]+/))
    .map((value) => value.replace(/[_-]+/g, ' ').trim())
    .filter(Boolean);
  const appCategory = normalized.find((value) => ['flight', 'sight', 'meal', 'transport', 'hotel', 'shopping', 'other'].includes(value));
  if (appCategory) return appCategory;
  const matches = (keywords) => normalized.some((value) => keywords.some((keyword) => value.includes(keyword)));
  if (matches(['airport', 'airline', 'flight'])) return 'flight';
  if (matches(['lodging', 'hotel', 'hostel', 'motel', 'resort', 'guest house', 'accommodation', '호텔', '숙박', '리조트', '펜션'])) return 'hotel';
  if (matches(['restaurant', 'cafe', 'coffee', 'bakery', 'bar', 'food', 'meal', 'dining', 'ramen', 'sushi', '음식점', '카페', '식당', '한식', '일식', '중식', '양식'])) return 'meal';
  if (matches(['store', 'shopping', 'mall', 'market', 'supermarket', 'department store', 'boutique', '쇼핑', '백화점', '시장', '마트'])) return 'shopping';
  if (matches(['transit', 'station', 'bus', 'train', 'subway', 'taxi', 'car rental', 'transport', '교통', '지하철', '기차역', '버스'])) return 'transport';
  if (matches(['tourist attraction', 'museum', 'gallery', 'park', 'landmark', 'temple', 'church', 'place of worship', 'zoo', 'aquarium', 'amusement', '관광', '박물관', '미술관', '공원', '궁', '사찰'])) return 'sight';
  return fallback;
}

aiPlacesFileInput.addEventListener('change', async () => {
  const file = aiPlacesFileInput.files?.[0];
  if (!file) return;
  aiPlannerStatus.textContent = '';
  try {
    if (file.size > MAX_AI_PLACES_FILE_BYTES) throw new Error(state.language === 'zh' ? '附件不可超過 2 MB。' : 'The attachment must be 2 MB or smaller.');
    const places = normalizeAIReferencePlaces(await readAIReferencePlacesFile(file));
    if (!places.length) throw new Error(state.language === 'zh' ? '附件中找不到可辨識的地點清單。' : 'No recognizable place list was found in the attachment.');
    aiReferencePlaces = places;
    aiPlacesFileName.textContent = state.language === 'zh'
      ? `${file.name} · ${places.length} 個地點`
      : `${file.name} · ${places.length} places`;
    aiPlacesFileSummary.classList.remove('hidden');
    aiPlannerStatus.textContent = state.language === 'zh' ? '地點清單已附加，Aitinerary 會在規劃時分析。' : 'Place list attached. Aitinerary will analyze it with your request.';
  } catch (error) {
    clearAIPlacesFile();
    if (error instanceof SyntaxError) {
      aiPlannerStatus.textContent = state.language === 'zh' ? '無法讀取檔案，請選擇有效的 JSON。' : 'Could not read the file. Choose valid JSON.';
    } else if (error.message === 'unsupported-file-type') {
      aiPlannerStatus.textContent = state.language === 'zh' ? '請選擇 JSON、CSV、XLS、XLSX、XLSM 或 ODS 檔案。' : 'Choose a JSON, CSV, XLS, XLSX, XLSM, or ODS file.';
    } else if (error.message === 'spreadsheet-reader-unavailable') {
      aiPlannerStatus.textContent = state.language === 'zh' ? '試算表讀取器載入失敗，請重新整理後再試。' : 'The spreadsheet reader did not load. Refresh and try again.';
    } else {
      aiPlannerStatus.textContent = error.message;
    }
  }
});

removeAIPlacesFileBtn.addEventListener('click', () => {
  clearAIPlacesFile();
  aiPlannerStatus.textContent = state.language === 'zh' ? '已移除地點清單。' : 'Place list removed.';
});

async function openAIPlanner() {
  aiPlannerDestination.value = state.tripDestination || '';
  aiPlannerStartDate.value = state.tripStartDate || '';
  aiPlannerEndDate.value = state.tripEndDate || '';
  aiPlannerStatus.textContent = '';
  clearAIPlacesFile();
  aiPlannerDestination.readOnly = false;
  aiPlannerStartDate.readOnly = false;
  aiPlannerEndDate.readOnly = false;
  setAitineraryAskButton(false);
  aiPlannerModal.classList.remove('hidden');
  renderAISearchHistory();
  aiPlannerDestination.focus();
  await refreshAIUsageStatus();
}

async function refreshAIUsageStatus() {
  aiPlannerUsageRemaining.textContent = state.language === 'zh' ? '正在檢查額度…' : 'Checking usage…';
  aiPlannerUid.textContent = state.language === 'zh' ? '正在檢查…' : 'Checking…';
  aiPlannerAccessLevel.textContent = state.language === 'zh' ? '正在檢查權限…' : 'Checking access…';
  try {
    if (!window.itinerarySync?.isConfigured()) throw new Error('Firebase is not configured');
    const uid = await window.itinerarySync.authenticate();
    aiPlannerUid.textContent = uid || window.itinerarySync.getUid() || 'Unavailable';
    aiPlannerUid.title = aiPlannerUid.textContent;
    const getUsage = firebase.app().functions('asia-east2').httpsCallable('getAIUsageStatus');
    const result = await getUsage();
    setAIUsage(result.data || {});
  } catch (error) {
    console.error('AI usage lookup failed', error);
    aiPlannerUsageRemaining.textContent = state.language === 'zh' ? '每日最多 5 次' : '5 plans per day';
    aiPlannerUsageReset.textContent = state.language === 'zh' ? '無法載入即時剩餘額度' : 'Live usage unavailable';
    aiPlannerUid.textContent = window.itinerarySync?.getUid?.() || 'Unavailable';
    aiPlannerAccessLevel.textContent = state.language === 'zh' ? '無法確認權限' : 'Access unavailable';
  }
}

function setAIUsage(usage) {
  aiPlansUnlimited = usage.unlimited === true;
  aiPlansRemaining = Number.isInteger(usage.remaining) ? usage.remaining : null;
  aiPlannerAccessLevel.textContent = aiPlansUnlimited
    ? (state.language === 'zh' ? '無限測試帳號' : 'Unlimited tester')
    : (state.language === 'zh' ? '標準額度' : 'Standard access');
  aiPlannerAccessLevel.classList.toggle('is-unlimited', aiPlansUnlimited);
  updateAIPlanUsage();
}

function closeAIPlanner() {
  if (generateAIPlanBtn.disabled) return;
  clearAIRoutePreview();
  aiPlannerModal.classList.add('hidden');
}

function setAIThinking(isThinking) {
  aiPlannerForm.setAttribute('aria-busy', String(isThinking));
  aiThinkingIndicator.classList.toggle('hidden', !isThinking);
}

function setAitineraryAskButton(isThinking) {
  generateAIPlanBtn.replaceChildren();
  const icon = document.createElement('span');
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '✦';
  generateAIPlanBtn.append(icon, document.createTextNode(isThinking
    ? (state.language === 'zh' ? ' Aitinerary 思考中…' : ' Aitinerary is thinking…')
    : (state.language === 'zh' ? ' 詢問 Aitinerary' : ' Ask Aitinerary')));
}

function setAitineraryLauncherHidden(isHidden, persist = true) {
  aitineraryAssistantDock.classList.toggle('is-collapsed', isHidden);
  aiPlanBtn.tabIndex = isHidden ? -1 : 0;
  hideAitineraryBtn.tabIndex = isHidden ? -1 : 0;
  showAitineraryBtn.tabIndex = isHidden ? 0 : -1;
  if (persist) localStorage.setItem(AITINERARY_LAUNCHER_HIDDEN_KEY, String(isHidden));
}

function clearAIRoutePreview() {
  pendingAIRoutePreview = null;
  pendingAICreatePreview = null;
  pendingAIActivitySuggestions = null;
  pendingAIReferencePlaceList = null;
  aiRoutePreviewList.innerHTML = '';
  aiRoutePreviewSummary.textContent = '';
  aiRoutePreview.classList.add('hidden');
  applyAIRouteBtn.classList.add('hidden');
}

function getAIHistoryLabel(action) {
  const labels = state.language === 'zh'
    ? { 'create-plan': '新行程', 'recommend-activities': '活動建議', 'optimize-route': '路線優化' }
    : { 'create-plan': 'New trip', 'recommend-activities': 'Activity ideas', 'optimize-route': 'Route update' };
  return labels[action] || labels['create-plan'];
}

function saveAISearchHistory(action) {
  if (!Array.isArray(state.aiSearchHistory)) state.aiSearchHistory = [];
  const data = action === 'optimize-route'
    ? pendingAIRoutePreview
    : action === 'recommend-activities'
      ? pendingAIActivitySuggestions
      : pendingAICreatePreview;
  if (!data || (Array.isArray(data) && !data.length)) return;
  const prompt = aiPlannerPreferences.value.trim();
  const entry = {
    id: `ai-history-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
    action,
    prompt,
    destination: aiPlannerDestination.value.trim(),
    startDate: aiPlannerStartDate.value,
    endDate: aiPlannerEndDate.value,
    createdAt: new Date().toISOString(),
    data: JSON.parse(JSON.stringify(data)),
  };
  state.aiSearchHistory = [entry, ...state.aiSearchHistory].slice(0, 5);
  saveState();
  renderAISearchHistory();
}

function openAISearchHistoryEntry(entry) {
  clearAIRoutePreview();
  aiPlannerDestination.value = entry.destination || '';
  aiPlannerStartDate.value = entry.startDate || '';
  aiPlannerEndDate.value = entry.endDate || '';
  aiPlannerPreferences.value = entry.prompt || '';
  if (entry.action === 'optimize-route' && Array.isArray(entry.data)) {
    pendingAIRoutePreview = JSON.parse(JSON.stringify(entry.data));
    renderAIRoutePreview();
  } else if (entry.action === 'recommend-activities' && Array.isArray(entry.data)) {
    pendingAIActivitySuggestions = JSON.parse(JSON.stringify(entry.data));
    renderAIActivitySuggestions();
  } else if (entry.data?.activities?.length) {
    pendingAICreatePreview = JSON.parse(JSON.stringify(entry.data));
    renderAICreatePreview();
  } else {
    aiPlannerStatus.textContent = state.language === 'zh' ? '此歷史預覽已無法開啟。' : 'This saved preview is no longer available.';
    return;
  }
  aiPlannerStatus.textContent = state.language === 'zh' ? '已開啟最近的 Aitinerary 預覽。確認後即可套用。' : 'Recent Aitinerary preview opened. Review it before applying.';
}

function renderAISearchHistory() {
  const history = Array.isArray(state.aiSearchHistory) ? state.aiSearchHistory : [];
  aiSearchHistoryList.innerHTML = '';
  aiSearchHistory.classList.toggle('hidden', !history.length);
  history.forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'ai-search-history-item';
    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.className = 'ai-search-history-open';
    const copy = document.createElement('span');
    const title = document.createElement('strong');
    title.textContent = entry.prompt || getAIHistoryLabel(entry.action);
    const meta = document.createElement('small');
    const date = new Date(entry.createdAt);
    meta.textContent = `${getAIHistoryLabel(entry.action)} · ${Number.isNaN(date.getTime()) ? '' : date.toLocaleString(state.language === 'zh' ? 'zh-TW' : 'en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`;
    copy.append(title, meta);
    const arrow = document.createElement('span');
    arrow.className = 'ai-search-history-arrow';
    arrow.textContent = '›';
    openButton.append(copy, arrow);
    openButton.addEventListener('click', () => openAISearchHistoryEntry(entry));
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'ai-search-history-remove';
    removeButton.textContent = '×';
    removeButton.setAttribute('aria-label', state.language === 'zh' ? '刪除此 Aitinerary 歷史' : 'Delete this Aitinerary history');
    removeButton.addEventListener('click', () => {
      state.aiSearchHistory = state.aiSearchHistory.filter((item) => item.id !== entry.id);
      saveState();
      renderAISearchHistory();
    });
    row.append(openButton, removeButton);
    aiSearchHistoryList.appendChild(row);
  });
}

function requestRouteLeg(origin, destination, mode, departureTime = null) {
  return new Promise((resolve) => {
    if (!directionsService || !window.google?.maps) {
      resolve(null);
      return;
    }
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      resolve(result);
    };
    const timeoutId = setTimeout(() => finish(null), 7000);
    const request = { origin, destination, travelMode: google.maps.TravelMode[mode] };
    if (mode === 'DRIVING' && departureTime instanceof Date && departureTime > new Date()) {
      request.drivingOptions = { departureTime };
    }
    directionsService.route(request, (result, status) => {
      if (status !== 'OK' || !result.routes.length) {
        finish(null);
        return;
      }
      const leg = result.routes[0].legs[0];
      const duration = leg.duration_in_traffic || leg.duration;
      finish({
        mode,
        distanceMeters: Number(leg.distance?.value) || 0,
        distance: leg.distance?.text || '',
        durationSeconds: Number(duration?.value) || 0,
        duration: duration?.text || '',
      });
    });
  });
}

function verifyAIActivityPlace(activity, destination) {
  return new Promise((resolve) => {
    if (!placesService || !window.google?.maps?.places) {
      resolve(null);
      return;
    }
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      resolve(result);
    };
    const timeoutId = setTimeout(() => finish(null), 5000);
    const queryParts = [activity.location || activity.title, activity.address, destination]
      .filter((value, index, values) => value && values.indexOf(value) === index);
    const request = { query: queryParts.join(', ') };
    if (Number.isFinite(activity.latitude) && Number.isFinite(activity.longitude)) {
      request.location = { lat: activity.latitude, lng: activity.longitude };
      request.radius = 5000;
    }
    placesService.textSearch(request, (results, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results?.[0]) {
        finish(null);
        return;
      }
      const place = results[0];
      const rating = Number(place.rating) || 0;
      const reviewCount = Number(place.user_ratings_total) || 0;
      const latitude = place.geometry?.location?.lat();
      const longitude = place.geometry?.location?.lng();
      const keepNormalLocale = !isKoreaDestination(destination) && activeMapProvider === 'naver';
      const location = keepNormalLocale
        ? (activity.location || activity.title || place.name)
        : (place.name || activity.location);
      const address = keepNormalLocale
        ? (activity.address || activity.description || place.formatted_address || '')
        : (place.formatted_address || activity.address || '');
      finish({
        ...activity,
        location,
        address,
        rating: rating || '',
        placeId: place.place_id || '',
        placeTypes: place.types || [],
        latitude: Number.isFinite(latitude) ? latitude : activity.latitude,
        longitude: Number.isFinite(longitude) ? longitude : activity.longitude,
        category: inferActivityCategory(place.types, inferActivityCategory(activity.category)),
        googleReviewCount: reviewCount,
        googleMapsUrl: place.place_id ? `https://www.google.com/maps/search/?api=1&query_place_id=${encodeURIComponent(place.place_id)}&query=${encodeURIComponent(location)}` : '',
        googlePlaceReason: rating
          ? `Google rating ${rating.toFixed(1)}${reviewCount ? ` from ${reviewCount.toLocaleString()} reviews` : ''}`
          : 'Place verified on Google Maps',
      });
    });
  });
}

async function verifyAIKoreaActivityPlace(activity, destination) {
  const query = [activity.address || activity.location, activity.title, destination].filter(Boolean).join(' ');
  const fallback = {
    ...activity,
    mapProvider: 'naver',
    naverUrl: `https://map.naver.com/p/search/${encodeURIComponent(activity.address || activity.location || activity.title || query)}`,
  };
  const googleVerifiedPlace = await verifyAIActivityPlace(activity, destination);
  const hasKoreanGoogleDetails = /[가-힣]/.test(googleVerifiedPlace?.location || '')
    && /[가-힣]/.test(googleVerifiedPlace?.address || '');
  if (hasKoreanGoogleDetails && Number.isFinite(googleVerifiedPlace?.latitude) && Number.isFinite(googleVerifiedPlace?.longitude)) {
    return {
      ...googleVerifiedPlace,
      mapProvider: 'naver',
      naverPlaceName: googleVerifiedPlace.location || activity.location || '',
      naverUrl: '',
      googleMapsUrl: '',
      koreaCoordinateSource: 'google-places',
      googlePlaceReason: state.language === 'zh' ? '已使用 Google Places 驗證地點，並在 Naver Maps 顯示' : 'Place verified with Google Places and shown in Naver Maps',
    };
  }
  if (!window.itinerarySync?.isConfigured()) return fallback;
  try {
    await window.itinerarySync.authenticate();
    const searchKoreaPlaces = firebase.app().functions('asia-east2').httpsCallable('searchKoreaPlaces');
    const result = await searchKoreaPlaces({
      query,
      preferredName: googleVerifiedPlace?.location || '',
      latitude: googleVerifiedPlace?.latitude ?? activity.latitude,
      longitude: googleVerifiedPlace?.longitude ?? activity.longitude,
    });
    const place = result.data?.places?.[0];
    const localizedName = result.data?.preferredName || place?.naverPlaceName || place?.name || '';
    const localizedAddress = result.data?.localizedAddress || place?.address || '';
    if (!localizedName || !localizedAddress) return googleVerifiedPlace ? {
      ...activity,
      latitude: googleVerifiedPlace.latitude,
      longitude: googleVerifiedPlace.longitude,
      googlePlaceId: googleVerifiedPlace.googlePlaceId || '',
      googlePlaceRating: googleVerifiedPlace.googlePlaceRating ?? null,
      googlePlaceReviewCount: googleVerifiedPlace.googlePlaceReviewCount || 0,
      mapProvider: 'naver',
      naverPlaceName: activity.location || '',
      naverUrl: '',
      googleMapsUrl: '',
      koreaCoordinateSource: 'google-places',
    } : fallback;
    return {
      ...activity,
      ...googleVerifiedPlace,
      location: localizedName || activity.location,
      address: localizedAddress || activity.address || '',
      description: activity.description || localizedAddress || place.description || '',
      category: inferActivityCategory(place?.category, inferActivityCategory(activity.category)),
      latitude: Number.isFinite(googleVerifiedPlace?.latitude) ? googleVerifiedPlace.latitude : place?.latitude,
      longitude: Number.isFinite(googleVerifiedPlace?.longitude) ? googleVerifiedPlace.longitude : place?.longitude,
      mapProvider: 'naver',
      naverPlaceName: localizedName,
      naverUrl: place?.naverUrl || fallback.naverUrl,
      googleMapsUrl: '',
      koreaCoordinateSource: googleVerifiedPlace ? 'google-places' : 'nominatim',
      googlePlaceReason: googleVerifiedPlace
        ? (state.language === 'zh' ? '已使用 Google Places 驗證並轉換為韓文地點資料' : 'Verified with Google Places and localized to Korean')
        : (state.language === 'zh' ? '已使用韓國地圖資料驗證' : 'Verified with Korea map data'),
    };
  } catch (error) {
    console.error('Korea AI place verification failed', error);
    return fallback;
  }
}

function getAttachedReferencePlace(activity) {
  const normalizeName = (value) => String(value || '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const activityNames = [activity.location, activity.title].map(normalizeName).filter(Boolean);
  return aiReferencePlaces.find((place) => {
    const placeName = normalizeName(place.name);
    return activityNames.some((name) => name === placeName || (name.length > 5 && placeName.length > 5 && (name.includes(placeName) || placeName.includes(name))));
  }) || null;
}

async function verifyAIActivityPlaces(activities, destination) {
  const verified = [];
  const batchSize = 6;
  for (let index = 0; index < activities.length; index += batchSize) {
    const batch = activities.slice(index, index + batchSize);
    const results = await Promise.all(batch.map((activity) => {
      const attachedPlace = getAttachedReferencePlace(activity);
      if (isKoreaDestination(destination)) return verifyAIKoreaActivityPlace(attachedPlace ? {
        ...activity,
        location: attachedPlace.name,
        address: attachedPlace.address || activity.address || '',
        description: attachedPlace.notes || activity.description || '',
        latitude: attachedPlace.latitude,
        longitude: attachedPlace.longitude,
      } : activity, destination);
      if (!attachedPlace) return verifyAIActivityPlace(activity, destination);
      return Promise.resolve({
        ...activity,
        location: attachedPlace.name,
        address: attachedPlace.address || activity.address || '',
        googlePlaceReason: state.language === 'zh' ? '來自附加的地點清單' : 'From attached saved places',
      });
    }));
    verified.push(...results.filter(Boolean));
    const processed = Math.min(index + batch.length, activities.length);
    aiPlannerStatus.textContent = state.language === 'zh'
      ? `正在驗證地點 ${processed} / ${activities.length}…`
      : `Verifying places ${processed} / ${activities.length}…`;
  }
  return verified;
}

async function verifyAttachedReferencePlaces(destination) {
  const verified = await Promise.all(aiReferencePlaces.map(async (place) => {
    const query = [place.name, place.address, destination].filter(Boolean).join(', ');
    const referenceActivity = {
      title: place.name,
      location: place.name,
      address: place.address || '',
      description: place.notes || '',
      category: inferActivityCategory(place.category),
      latitude: place.latitude,
      longitude: place.longitude,
    };
    const verifiedPlace = isKoreaDestination(destination)
      ? await verifyAIKoreaActivityPlace(referenceActivity, destination)
      : await verifyAIActivityPlace(referenceActivity, destination);
    return {
      ...verifiedPlace,
      title: verifiedPlace?.title || place.name,
      location: verifiedPlace?.location || place.name,
      address: verifiedPlace?.address || place.address || '',
      description: place.notes || '',
      category: inferActivityCategory(verifiedPlace?.placeTypes, inferActivityCategory(place.category)),
      googleMapsUrl: isKoreaDestination(destination) ? '' : (verifiedPlace?.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`),
      naverUrl: verifiedPlace?.naverUrl || '',
      googlePlaceReason: verifiedPlace?.googlePlaceReason || (state.language === 'zh' ? '來自附件地點清單' : 'From attached saved-place list'),
    };
  }));
  return verified;
}

function verifyAIDailyMeals(activities, startDate, endDate) {
  const cursor = new Date(`${startDate}T00:00:00`);
  const lastDate = new Date(`${endDate}T00:00:00`);
  while (cursor <= lastDate) {
    const date = toISODate(cursor);
    const mealTimes = activities
      .filter((activity) => activity.date === date && activity.category === 'meal')
      .map((activity) => activity.time || '');
    const hasBreakfast = mealTimes.some((time) => time >= '06:00' && time <= '10:30');
    const hasLunch = mealTimes.some((time) => time >= '11:00' && time <= '15:00');
    const hasDinner = mealTimes.some((time) => time >= '17:00' && time <= '22:30');
    if (!hasBreakfast || !hasLunch || !hasDinner) {
      const missingMeals = [
        !hasBreakfast ? (state.language === 'zh' ? '早餐' : 'breakfast') : '',
        !hasLunch ? (state.language === 'zh' ? '午餐' : 'lunch') : '',
        !hasDinner ? (state.language === 'zh' ? '晚餐' : 'dinner') : '',
      ].filter(Boolean).join(', ');
      const firstActivity = activities.find((activity) => activity.date === date);
      if (firstActivity) {
        firstActivity.planningWarning = state.language === 'zh'
          ? `此日缺少已驗證的${missingMeals}，套用後請補上或重新詢問 Aitinerary。`
          : `This day is missing a verified ${missingMeals}; add it after applying or ask Aitinerary to revise the plan.`;
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }
}

async function verifyAIDailyReachability(activities, destination, validateSuggestedOnly = false, mapProvider = '') {
  const sorted = activities.slice().sort((first, second) => first.date.localeCompare(second.date) || first.time.localeCompare(second.time));
  sorted.forEach((activity) => { activity.driveFromPrevious = null; });
  const routeChecks = sorted.slice(1).map((activity, index) => {
    const previous = sorted[index];
    const shouldValidateLeg = !validateSuggestedOnly || previous._aiSuggestion || activity._aiSuggestion;
    if (previous.date !== activity.date || !shouldValidateLeg) return null;
    return { previous, activity };
  }).filter(Boolean);

  const batchSize = 4;
  for (let index = 0; index < routeChecks.length; index += batchSize) {
    const batch = routeChecks.slice(index, index + batchSize);
    const results = await Promise.all(batch.map(({ previous, activity }) => {
      if ((mapProvider || getMapProviderForDate(activity.date)) === 'naver') return null;
      const origin = previous.address || `${previous.location}, ${destination}`;
      const target = activity.address || `${activity.location}, ${destination}`;
      const departureTime = new Date(`${previous.date}T${previous.time || '09:00'}:00`);
      return requestRouteLeg(origin, target, 'DRIVING', departureTime);
    }));
    const koreaChecks = batch.map((check, resultIndex) => ({ ...check, resultIndex }))
      .filter(({ activity }) => (mapProvider || getMapProviderForDate(activity.date)) === 'naver');
    if (koreaChecks.length) {
      const koreaStops = [...new Map(koreaChecks.flatMap(({ previous, activity }) => [previous, activity])
        .map((activity) => [activity.id, activity])).values()];
      const koreaRoutes = await requestKoreaRoutes('legs', koreaStops, koreaChecks.map(({ previous, activity }) => ({
        fromId: previous.id,
        toId: activity.id,
      })));
      koreaChecks.forEach(({ previous, activity, resultIndex }) => {
        const leg = koreaRoutes?.legs?.find((candidate) => candidate.fromId === previous.id && candidate.toId === activity.id);
        if (!leg) return;
        results[resultIndex] = {
          ...leg,
          durationSeconds: leg.durationMinutes * 60,
          duration: `${leg.durationMinutes} min`,
          distance: `${(leg.distanceMeters / 1000).toFixed(1)} km`,
        };
      });
    }
    batch.forEach(({ previous, activity }, resultIndex) => {
      const warningTarget = validateSuggestedOnly && previous._aiSuggestion && !activity._aiSuggestion ? previous : activity;
      const leg = results[resultIndex];
      if (!leg || !leg.durationSeconds) {
        warningTarget.reachabilityWarning = state.language === 'zh'
          ? `無法驗證從 ${previous.location} 前往此處的交通時間，請在套用前確認。`
          : `Travel time from ${previous.location} could not be verified; check it before applying.`;
      } else {
        warningTarget.driveFromPrevious = leg;
        if (leg.durationSeconds > 3600) {
          warningTarget.reachabilityWarning = state.language === 'zh'
            ? `從 ${previous.location} 駕車約 ${leg.duration}；可考慮換成較近地點。`
            : `About ${leg.duration} by car from ${previous.location}; consider a closer alternative.`;
        } else if (leg.durationSeconds > 1800) {
          warningTarget.reachabilityWarning = state.language === 'zh'
            ? `從上一站駕車約 ${leg.duration}，屬較長移動。`
            : `About ${leg.duration} by car from the previous stop, a longer transfer.`;
        }
      }
    });
  }
  return sorted;
}

async function getAIRouteEvidence(from, to) {
  if (getMapProviderForDate(to.date) === 'naver') {
    const result = await requestKoreaRoutes('legs', [from, to], [{ fromId: from.id, toId: to.id }]);
    const leg = result?.legs?.[0];
    if (!leg) {
      return {
        mode: '', distanceMeters: 0, distance: '', duration: '',
        reason: state.language === 'zh' ? 'OpenStreetMap 暫時無法驗證此路段，請確認活動的韓文道路地址。' : 'OpenStreetMap could not verify this leg. Check the Korean road addresses.',
      };
    }
    return {
      ...leg,
      distance: `${(leg.distanceMeters / 1000).toFixed(1)} km`,
      duration: `${leg.durationMinutes} min`,
      reason: state.language === 'zh'
        ? `OSRM 預估駕車 ${(leg.distanceMeters / 1000).toFixed(1)} 公里，約 ${leg.durationMinutes} 分鐘。`
        : `OSRM estimates ${(leg.distanceMeters / 1000).toFixed(1)} km by car, about ${leg.durationMinutes} minutes.`,
    };
  }
  const city = getCityForDate(to.date) || state.tripDestination;
  const origin = city ? `${from.location}, ${city}` : from.location;
  const destination = city ? `${to.location}, ${city}` : to.location;
  const walking = await requestRouteLeg(origin, destination, 'WALKING');
  if (walking && walking.distanceMeters <= 2000) {
    return {
      ...walking,
      reason: state.language === 'zh'
        ? `兩站位於相近區域，步行 ${walking.distance}（約 ${walking.duration}）可減少折返。`
        : `Same-area stops: ${walking.distance} on foot (about ${walking.duration}), reducing backtracking.`,
    };
  }
  const driving = await requestRouteLeg(origin, destination, 'DRIVING');
  if (driving) {
    return {
      ...driving,
      reason: state.language === 'zh'
        ? `兩站距離較遠，駕車 ${driving.distance}（約 ${driving.duration}）比步行更實際。`
        : `The stops are farther apart: ${driving.distance} by car (about ${driving.duration}) is more practical than walking.`,
    };
  }
  if (walking) {
    return {
      ...walking,
      reason: state.language === 'zh'
        ? `可用步行路線為 ${walking.distance}（約 ${walking.duration}）；請確認是否符合你的步調。`
        : `A walking route is available for ${walking.distance} (about ${walking.duration}); check that it suits your pace.`,
    };
  }
  return {
    mode: '', distanceMeters: 0, distance: '', duration: '',
    reason: state.language === 'zh' ? 'Google Maps 暫時無法驗證此路段，套用前請先確認路線。' : 'Google Maps could not verify this leg; check it before applying.',
  };
}

async function buildAIRoutePreview(optimizedActivities) {
  const currentById = new Map(state.activities.map((activity) => [activity.id, activity]));
  const preview = optimizedActivities
    .map((optimized) => {
      const current = currentById.get(optimized.id);
      return current ? {
        id: current.id,
        date: current.date,
        title: current.title,
        location: current.location,
        address: current.address || current.description || '',
        originalTime: current.time || '',
        time: optimized.time,
        aiReason: optimized.routeNote || '',
        evidence: null,
      } : null;
    })
    .filter(Boolean)
    .sort((first, second) => first.date.localeCompare(second.date) || first.time.localeCompare(second.time));
  let previous = null;
  for (const item of preview) {
    if (previous && previous.date === item.date) item.evidence = await getAIRouteEvidence(previous, item);
    previous = item;
  }
  return preview;
}

function renderAIRoutePreview() {
  aiRoutePreviewList.innerHTML = '';
  if (!pendingAIRoutePreview?.length) return;
  const dayCount = new Set(pendingAIRoutePreview.map((item) => item.date)).size;
  const verifiedLegs = pendingAIRoutePreview.filter((item) => item.evidence?.distance).length;
  aiPreviewTitle.textContent = 'Suggested route';
  applyAIRouteBtn.textContent = state.language === 'zh' ? '套用路線' : 'Apply route';
  aiRoutePreviewSummary.textContent = `${dayCount} ${dayCount === 1 ? 'day' : 'days'} · ${verifiedLegs} verified legs`;
  let renderedDate = '';
  pendingAIRoutePreview.forEach((item, index) => {
    if (item.date !== renderedDate) {
      renderedDate = item.date;
      const dateHeading = document.createElement('h4');
      dateHeading.textContent = new Date(`${item.date}T00:00:00`).toLocaleDateString(state.language === 'zh' ? 'zh-TW' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      aiRoutePreviewList.appendChild(dateHeading);
    }
    const row = document.createElement('article');
    row.className = 'ai-route-preview-item';
    const order = document.createElement('span');
    order.className = 'ai-route-preview-order';
    order.textContent = String(index + 1);
    const content = document.createElement('div');
    const heading = document.createElement('div');
    heading.className = 'ai-route-preview-item-heading';
    const title = document.createElement('strong');
    title.textContent = item.location || item.title;
    const timing = document.createElement('span');
    timing.textContent = item.originalTime && item.originalTime !== item.time ? `${item.originalTime} → ${item.time}` : item.time;
    heading.append(title, timing);
    content.appendChild(heading);
    const reason = document.createElement('p');
    reason.textContent = item.evidence?.reason || item.aiReason || (state.language === 'zh' ? '當天建議起點。' : 'Suggested starting point for the day.');
    content.appendChild(reason);
    if (item.evidence?.distance) {
      const metrics = document.createElement('div');
      metrics.className = 'ai-route-preview-metrics';
      const modeLabel = item.evidence.mode === 'WALKING' ? (state.language === 'zh' ? '步行' : 'Walk') : (state.language === 'zh' ? '駕車' : 'Drive');
      [modeLabel, item.evidence.distance, item.evidence.duration].forEach((value) => {
        const metric = document.createElement('span');
        metric.textContent = value;
        metrics.appendChild(metric);
      });
      content.appendChild(metrics);
    }
    row.append(order, content);
    aiRoutePreviewList.appendChild(row);
  });
  aiRoutePreview.classList.remove('hidden');
  applyAIRouteBtn.classList.remove('hidden');
}

function renderAICreatePreview() {
  aiRoutePreviewList.innerHTML = '';
  if (!pendingAICreatePreview?.activities.length) return;
  const activities = pendingAICreatePreview.activities;
  const dayCount = new Set(activities.map((activity) => activity.date)).size;
  aiPreviewTitle.textContent = 'Suggested itinerary';
  applyAIRouteBtn.textContent = state.language === 'zh' ? '新增為新旅程' : 'Add as new trip';
  aiRoutePreviewSummary.textContent = `${dayCount} ${dayCount === 1 ? 'day' : 'days'} · ${activities.length} stops`;
  let renderedDate = '';
  activities.forEach((activity, index) => {
    if (activity.date !== renderedDate) {
      renderedDate = activity.date;
      const dateHeading = document.createElement('h4');
      dateHeading.textContent = new Date(`${activity.date}T00:00:00`).toLocaleDateString(state.language === 'zh' ? 'zh-TW' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      aiRoutePreviewList.appendChild(dateHeading);
    }
    const row = document.createElement('article');
    row.className = 'ai-route-preview-item ai-create-preview-item';
    const order = document.createElement('span');
    order.className = 'ai-route-preview-order';
    order.textContent = String(index + 1);
    const content = document.createElement('div');
    const heading = document.createElement('div');
    heading.className = 'ai-route-preview-item-heading';
    const title = document.createElement('strong');
    title.textContent = activity.title;
    const timing = document.createElement('span');
    timing.textContent = activity.time || '--:--';
    heading.append(title, timing);
    const location = document.createElement('p');
    location.className = 'ai-create-preview-location';
    location.textContent = activity.location || activity.description || '';
    const reason = document.createElement('p');
    reason.textContent = activity.remarks || activity.description || (state.language === 'zh' ? 'Aitinerary 建議的行程停靠點。' : 'Aitinerary-selected stop for this itinerary.');
    const metrics = document.createElement('div');
    metrics.className = 'ai-route-preview-metrics';
    const category = document.createElement('span');
    category.textContent = activity.category || 'other';
    metrics.appendChild(category);
    if (activity.driveFromPrevious?.duration) {
      const driveTime = document.createElement('span');
      driveTime.textContent = `${state.language === 'zh' ? '駕車' : 'Drive'} ${activity.driveFromPrevious.duration}`;
      metrics.appendChild(driveTime);
    }
    if (activity.reachabilityWarning) {
      const warning = document.createElement('p');
      warning.className = 'ai-reachability-warning';
      warning.textContent = activity.reachabilityWarning;
      content.append(heading, location, reason, warning, metrics);
    } else {
      content.append(heading, location, reason, metrics);
    }
    if (activity.planningWarning) {
      const warning = document.createElement('p');
      warning.className = 'ai-reachability-warning';
      warning.textContent = activity.planningWarning;
      content.appendChild(warning);
    }
    if (activity.googlePlaceReason) {
      const placeEvidence = document.createElement('span');
      placeEvidence.textContent = activity.googlePlaceReason;
      metrics.appendChild(placeEvidence);
    }
    row.append(order, content);
    aiRoutePreviewList.appendChild(row);
  });
  aiRoutePreview.classList.remove('hidden');
  applyAIRouteBtn.classList.remove('hidden');
}

function renderAIActivitySuggestions() {
  aiRoutePreviewList.innerHTML = '';
  if (!pendingAIActivitySuggestions?.length) return;
  aiPreviewTitle.textContent = 'Fun stops for this trip';
  applyAIRouteBtn.textContent = state.language === 'zh' ? '新增活動' : 'Add activities';
  aiRoutePreviewSummary.textContent = `${pendingAIActivitySuggestions.length} ideas · review before adding`;
  pendingAIActivitySuggestions.forEach((activity, index) => {
    const row = document.createElement('article');
    row.className = 'ai-route-preview-item ai-suggestion-preview-item';
    const order = document.createElement('span');
    order.className = 'ai-route-preview-order';
    order.textContent = String(index + 1);
    const content = document.createElement('div');
    const heading = document.createElement('div');
    heading.className = 'ai-route-preview-item-heading';
    const title = document.createElement('strong');
    title.textContent = activity.title;
    const timing = document.createElement('span');
    timing.textContent = `${activity.date} · ${activity.time || '--:--'}`;
    heading.append(title, timing);
    const location = document.createElement('p');
    location.className = 'ai-create-preview-location';
    location.textContent = activity.location;
    const meta = document.createElement('div');
    meta.className = 'ai-suggestion-meta';
    if (activity.rating) {
      const rating = document.createElement('span');
      rating.className = 'ai-suggestion-rating';
      rating.textContent = `★ ${Number(activity.rating).toFixed(1)}${activity.googleReviewCount ? ` · ${Number(activity.googleReviewCount).toLocaleString()} reviews` : ''}`;
      meta.appendChild(rating);
    }
    const vibe = document.createElement('p');
    vibe.className = 'ai-suggestion-vibe';
    vibe.textContent = activity.visitorVibe || activity.reviewReason || activity.whyFavorite || activity.remarks;
    content.append(heading, location);
    if (meta.childElementCount) content.appendChild(meta);
    if (vibe.textContent) content.appendChild(vibe);
    if (activity.reachabilityWarning) {
      const warning = document.createElement('p');
      warning.className = 'ai-reachability-warning';
      warning.textContent = activity.reachabilityWarning;
      content.appendChild(warning);
    }
    row.append(order, content);
    aiRoutePreviewList.appendChild(row);
  });
  aiRoutePreview.classList.remove('hidden');
  applyAIRouteBtn.classList.remove('hidden');
}

function renderAIReferencePlaceList() {
  aiRoutePreviewList.innerHTML = '';
  if (!pendingAIReferencePlaceList?.length) return;
  aiPreviewTitle.textContent = state.language === 'zh' ? '附件中的已儲存地點' : 'Saved places from attachment';
  aiRoutePreviewSummary.textContent = state.language === 'zh'
    ? `${pendingAIReferencePlaceList.length} 個地點`
    : `${pendingAIReferencePlaceList.length} places`;
  pendingAIReferencePlaceList.forEach((place, index) => {
    const row = document.createElement('article');
    row.className = 'ai-route-preview-item ai-suggestion-preview-item';
    const order = document.createElement('span');
    order.className = 'ai-route-preview-order';
    order.textContent = String(index + 1);
    const content = document.createElement('div');
    const heading = document.createElement('div');
    heading.className = 'ai-route-preview-item-heading';
    const title = document.createElement('strong');
    title.textContent = place.location || place.title;
    heading.appendChild(title);
    const address = document.createElement('p');
    address.className = 'ai-create-preview-location';
    address.textContent = place.address || (state.language === 'zh' ? '附件未提供地址' : 'No address in attachment');
    const details = document.createElement('p');
    details.textContent = place.description || '';
    content.append(heading, address);
    if (details.textContent) content.appendChild(details);
    const metrics = document.createElement('div');
    metrics.className = 'ai-route-preview-metrics';
    const evidence = document.createElement('span');
    evidence.textContent = place.googlePlaceReason || (state.language === 'zh' ? '來自附件' : 'From attachment');
    metrics.appendChild(evidence);
    const actions = document.createElement('div');
    actions.className = 'ai-reference-place-actions';
    const mapUrl = place.naverUrl || place.googleMapsUrl;
    if (mapUrl) {
      const mapsLink = document.createElement('a');
      mapsLink.className = 'ai-reference-place-button ai-reference-map-button';
      mapsLink.href = mapUrl;
      mapsLink.target = '_blank';
      mapsLink.rel = 'noopener noreferrer';
      const mapIcon = document.createElement('i');
      mapIcon.dataset.lucide = 'map-pin';
      mapIcon.setAttribute('aria-hidden', 'true');
      mapsLink.append(mapIcon, document.createTextNode(place.naverUrl ? 'Naver Maps' : (state.language === 'zh' ? 'Google 地圖' : 'Google Maps')));
      actions.appendChild(mapsLink);
    }
    // Add a Google -> Naver cross-reference pill: copies name/address and opens Naver search
    if (!place.naverUrl && (place.location || place.address || place.name || place.googleMapsUrl)) {
      const crossLink = document.createElement('button');
      crossLink.type = 'button';
      crossLink.className = 'ai-reference-place-button ai-reference-google-to-naver';
      crossLink.title = state.language === 'zh'
        ? '從 Google 擷取名稱與地址並在 Naver 地圖搜尋' : 'Copy Google name/address and search on Naver Maps';
      const crossIcon = document.createElement('i');
      crossIcon.dataset.lucide = 'globe';
      crossIcon.setAttribute('aria-hidden', 'true');
      crossLink.append(crossIcon, document.createTextNode(state.language === 'zh' ? 'Google → Naver' : 'Google → Naver'));
      crossLink.addEventListener('click', () => {
        const query = (place.address || place.formatted_address || place.location || place.name || '').trim();
        if (!query) return;
        const naverSearch = `https://map.naver.com/v5/search/${encodeURIComponent(query)}`;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(query);
        } catch (e) {
          // ignore clipboard failures
        }
        window.open(naverSearch, '_blank', 'noopener');
      });
      actions.appendChild(crossLink);
    }
    const addButton = document.createElement('button');
    addButton.className = 'ai-reference-place-button ai-reference-add-button';
    addButton.type = 'button';
    const addIcon = document.createElement('i');
    addIcon.dataset.lucide = 'calendar-plus';
    addIcon.setAttribute('aria-hidden', 'true');
    const tripDays = getTripDays();
    const activityDate = tripDays[selectedDayIndex] || tripDays[0] || state.tripStartDate || aiPlannerStartDate.value;
    const isAlreadyAdded = state.activities.some((activity) => activity.date === activityDate
      && String(activity.location || '').toLocaleLowerCase() === String(place.location || '').toLocaleLowerCase());
    addButton.disabled = isAlreadyAdded || !activityDate;
    addButton.append(addIcon, document.createTextNode(isAlreadyAdded
      ? (state.language === 'zh' ? '已新增' : 'Added')
      : (state.language === 'zh' ? '新增活動' : 'Add activity')));
    addButton.addEventListener('click', () => {
      const activity = createAIActivity({
        ...place,
        date: activityDate,
        time: '',
        title: place.title || place.location,
        remarks: place.description || '',
      }, index);
      if (!state.tripDestination) state.tripDestination = aiPlannerDestination.value.trim();
      if (!state.tripStartDate) state.tripStartDate = aiPlannerStartDate.value || activityDate;
      if (!state.tripEndDate) state.tripEndDate = aiPlannerEndDate.value || activityDate;
      state.activities.push(activity);
      saveState();
      render();
      addButton.disabled = true;
      addButton.replaceChildren();
      const addedIcon = document.createElement('i');
      addedIcon.dataset.lucide = 'check';
      addedIcon.setAttribute('aria-hidden', 'true');
      addButton.append(addedIcon, document.createTextNode(state.language === 'zh' ? '已新增' : 'Added'));
      window.lucide?.createIcons({ nodes: [addButton] });
      aiPlannerStatus.textContent = state.language === 'zh'
        ? `${place.location || place.title} 已新增至 ${activityDate}。`
        : `${place.location || place.title} added to ${activityDate}.`;
    });
    actions.appendChild(addButton);
    content.append(metrics, actions);
    row.append(order, content);
    aiRoutePreviewList.appendChild(row);
  });
  aiRoutePreview.classList.remove('hidden');
  applyAIRouteBtn.classList.add('hidden');
  window.lucide?.createIcons({ nodes: [aiRoutePreviewList] });
}

function applyAIRoutePreview() {
  if (pendingAICreatePreview?.activities.length) {
    const { destination, startDate, endDate, activities } = pendingAICreatePreview;
    saveState();
    const tripLibrary = state.tripLibrary || [];
    const aiSearchHistory = state.aiSearchHistory || [];
    const language = state.language || 'en';
    const theme = state.theme || 'joy';
    const walletTargetCurrency = state.walletTargetCurrency || 'HKD';
    Object.keys(state).forEach((key) => delete state[key]);
    Object.assign(state, {
      tripName: `${destination} Aitinerary`, tripDestination: destination,
      tripStartDate: startDate, tripEndDate: endDate, multipleCities: false,
      cities: [], members: [], language, departureFlight: '', returnFlight: '', geocodeCache: {},
      activities: activities.map((activity, index) => createAIActivity(activity, index, destination)), bills: [], routeFees: {}, settlementLogs: [],
      walletBudget: 0, walletTargetCurrency, theme, savedRoutes: [], aiSearchHistory, tripLibrary,
      activeTripId: createTripId(),
    });
    saveState();
    selectedDayIndex = 0;
    aiPlannerPreferences.value = '';
    clearAIRoutePreview();
    aiPlannerModal.classList.add('hidden');
    setActiveAppView('itinerary');
    init();
    return;
  }
  if (pendingAIActivitySuggestions?.length) {
    state.activities.push(...pendingAIActivitySuggestions.map(createAIActivity));
    saveState();
    render();
    clearAIRoutePreview();
    aiPlannerStatus.textContent = state.language === 'zh'
      ? '活動已加入。你可以在提示中要求 Aitinerary 再優化路線。'
      : 'Activities added. You can ask Aitinerary to optimize the route next.';
    return;
  }
  if (!pendingAIRoutePreview?.length) return;
  const previewById = new Map(pendingAIRoutePreview.map((item) => [item.id, item]));
  state.activities.forEach((activity) => {
    const preview = previewById.get(activity.id);
    if (!preview) return;
    activity.time = preview.time;
    activity.aiRouteNote = preview.evidence?.reason || preview.aiReason || '';
  });
  saveState();
  render();
  clearAIRoutePreview();
  aiPlannerStatus.textContent = state.language === 'zh' ? '最佳路線已套用至目前行程。' : 'The best route has been applied to this trip.';
}

function updateAIPlanUsage() {
  if (aiPlansUnlimited) {
    aiPlanBtn.title = state.language === 'zh' ? '此帳號已啟用開發測試無限額度。' : 'Unlimited Aitinerary usage is enabled for this development tester.';
    aiPlanUsageBadge.textContent = state.language === 'zh' ? '無限' : 'Unlimited';
    aiPlannerUsageRemaining.textContent = state.language === 'zh' ? '無限測試額度' : 'Unlimited tester access';
    aiPlannerUsageReset.textContent = state.language === 'zh' ? '開發測試帳號不計入每日額度' : 'Development calls do not use the daily quota';
    return;
  }
  if (!Number.isInteger(aiPlansRemaining)) return;
  aiPlanBtn.title = state.language === 'zh'
    ? `今天還可產生 ${aiPlansRemaining} 次行程；於 UTC 00:00 重設。`
    : `${aiPlansRemaining} Aitinerary plans remaining today; resets at 00:00 UTC.`;
  aiPlanUsageBadge.textContent = state.language === 'zh' ? `剩 ${aiPlansRemaining} 次` : `${aiPlansRemaining} left`;
  aiPlannerUsageRemaining.textContent = state.language === 'zh'
    ? `今天剩餘 ${aiPlansRemaining} / 5 次`
    : `${aiPlansRemaining} of 5 plans remaining`;
  aiPlannerUsageReset.textContent = state.language === 'zh' ? '每日 UTC 00:00 重設' : 'Resets daily at 00:00 UTC';
}

function createAIActivity(activity, index, destination = '') {
  return {
    id: `${Date.now().toString(36)}ai${index}${Math.random().toString(36).slice(2, 6)}`,
    date: activity.date,
    time: activity.time || '',
    title: activity.title,
    category: inferActivityCategory(activity.placeTypes, inferActivityCategory(activity.category)),
    location: activity.location || '',
    rating: activity.rating || '',
    description: activity.description || '',
    expense: '',
    remarks: activity.remarks || '',
    aiRecommendationNote: activity.visitorVibe || activity.reviewReason || activity.whyFavorite || '',
    paidBy: '',
    billMember: '',
    settled: false,
    settledMembers: [],
    paymentMethod: 'cash',
    cardNetwork: '',
    cardMarkup: 0,
    address: activity.address || activity.description || '',
    placeId: activity.placeId || '',
    latitude: Number.isFinite(activity.latitude) ? activity.latitude : undefined,
    longitude: Number.isFinite(activity.longitude) ? activity.longitude : undefined,
    googleReviewCount: Number(activity.googleReviewCount) || 0,
    mapProvider: isKoreaDestination(destination || getCityForDate(activity.date)) ? 'naver' : 'google',
    naverPlaceName: activity.naverPlaceName || '',
    naverUrl: activity.naverUrl || '',
    shoppingItems: [],
    upfrontPaymentTitle: '',
    bookingDetails: '',
    contactDetails: '',
    flightNumber: '',
    flightDeparture: '',
    flightArrival: '',
    flightArrivalDate: '',
    flightArrivalTime: '',
    departureTerminal: '',
    departureGate: '',
    arrivalTerminal: '',
    arrivalGate: '',
  };
}

function isSavedPlaceListRequest(prompt) {
  if (!aiReferencePlaces.length) return false;
  const normalized = String(prompt || '').toLocaleLowerCase();
  const requestsListing = /\b(list|show|display|extract|identify|find)\b/.test(normalized)
    || /(列出|顯示|展示|提取|識別|找出)/.test(normalized);
  const mentionsPlaces = /\b(place|places|location|locations|saved list|json|attachment|attached)\b/.test(normalized)
    || /(地點|位置|清單|列表|附件)/.test(normalized);
  return requestsListing && mentionsPlaces;
}

function isRouteOptimizationRequest(prompt) {
  const normalized = String(prompt || '').toLocaleLowerCase();
  return /\b(optimi[sz]e|reorder|rearrange|route|routing|travel time|backtrack|efficient order)\b/.test(normalized)
    || /(優化|最佳化|重新排序|重排行程|路線|交通時間|移動時間|減少折返|順路)/.test(normalized);
}

function requestTravelTimeMatrix(origins, destinations, mode) {
  return new Promise((resolve) => {
    if (!window.google?.maps?.DistanceMatrixService || !origins.length || !destinations.length) {
      resolve([]);
      return;
    }
    const service = new google.maps.DistanceMatrixService();
    const request = {
      origins: origins.map((activity) => activity.address || `${activity.location}, ${getCityForDate(activity.date)}`),
      destinations: destinations.map((activity) => activity.address || `${activity.location}, ${getCityForDate(activity.date)}`),
      travelMode: google.maps.TravelMode[mode] || google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
    };
    const firstActivity = origins.slice().sort((first, second) => (first.time || '').localeCompare(second.time || ''))[0];
    const departureTime = new Date(`${firstActivity.date}T${firstActivity.time || '09:00'}:00`);
    if (mode === 'DRIVING' && departureTime > new Date()) request.drivingOptions = { departureTime };
    if (mode === 'TRANSIT' && departureTime > new Date()) request.transitOptions = { departureTime };
    service.getDistanceMatrix(request, (response, status) => {
      if (status !== 'OK' || !response?.rows) {
        resolve([]);
        return;
      }
      const legs = [];
      response.rows.forEach((row, fromIndex) => {
        row.elements.forEach((element, toIndex) => {
          if (origins[fromIndex].id === destinations[toIndex].id || element.status !== 'OK' || !element.duration?.value) return;
          legs.push({
            fromId: origins[fromIndex].id,
            toId: destinations[toIndex].id,
            durationMinutes: Math.max(1, Math.round(element.duration.value / 60)),
            distanceMeters: Number(element.distance?.value) || 0,
            mode,
          });
        });
      });
      resolve(legs);
    });
  });
}

async function requestKoreaRoutes(mode, stops, pairs = [], travelMode = 'DRIVING') {
  if (!window.itinerarySync?.isConfigured()) return null;
  try {
    await window.itinerarySync.authenticate();
    const getKoreaRoutes = firebase.app().functions('asia-east2').httpsCallable('getKoreaRoutes');
    const result = await getKoreaRoutes({
      mode,
      travelMode,
      stops: stops.map((activity) => {
        const cached = state.geocodeCache[`korea:${activity.address || activity.location}`];
        return {
          id: activity.id,
          title: activity.title,
          location: activity.location,
          address: activity.address || activity.description || '',
          city: getCityForDate(activity.date) || state.tripDestination,
          latitude: Number.isFinite(activity.latitude) ? activity.latitude : cached?.lat,
          longitude: Number.isFinite(activity.longitude) ? activity.longitude : cached?.lng,
        };
      }),
      pairs,
    });
    const data = result.data || null;
    (data?.stops || []).forEach((stop) => {
      const activity = stops.find((candidate) => candidate.id === stop.id);
      if (!activity || !Number.isFinite(stop.latitude) || !Number.isFinite(stop.longitude)) return;
      state.geocodeCache[`korea:${activity.address || activity.location}`] = {
        lat: stop.latitude,
        lng: stop.longitude,
      };
      activity.latitude = stop.latitude;
      activity.longitude = stop.longitude;
      if (stop.address) {
        activity.address = stop.address;
        activity.description = stop.address;
      }
    });
    if (data?.stops?.length) saveState();
    return data;
  } catch (error) {
    console.error('Korea route lookup failed', error);
    return null;
  }
}

async function buildAITravelTimeMatrix(activities) {
  const mode = routeModeSelect.value || 'DRIVING';
  const byDate = new Map();
  activities.forEach((activity) => {
    if (!byDate.has(activity.date)) byDate.set(activity.date, []);
    byDate.get(activity.date).push(activity);
  });
  const legs = [];
  for (const dayActivities of byDate.values()) {
    if (dayActivities.length < 2) continue;
    if (getMapProviderForDate(dayActivities[0].date) === 'naver') {
      const result = await requestKoreaRoutes('matrix', dayActivities, [], mode);
      legs.push(...(Array.isArray(result?.legs) ? result.legs : []));
      continue;
    }
    if (!mapsApiLoaded || !window.google?.maps?.DistanceMatrixService) continue;
    const chunks = [];
    for (let index = 0; index < dayActivities.length; index += 10) chunks.push(dayActivities.slice(index, index + 10));
    for (const origins of chunks) {
      for (const destinations of chunks) {
        legs.push(...await requestTravelTimeMatrix(origins, destinations, mode));
      }
    }
  }
  return legs;
}

function optimizeRouteOrder(activities, travelTimeLegs) {
  const legCosts = new Map(travelTimeLegs.map((leg) => [`${leg.fromId}:${leg.toId}`, Number(leg.durationMinutes) || Infinity]));
  const getCost = (from, to) => legCosts.get(`${from.id}:${to.id}`) ?? Infinity;
  const routeCost = (route, start = null, end = null) => {
    const stops = [start, ...route, end].filter(Boolean);
    return stops.slice(1).reduce((total, stop, index) => total + getCost(stops[index], stop), 0);
  };
  const nearestNeighbor = (stops, start = null, firstStop = null) => {
    const remaining = stops.slice();
    const route = [];
    let current = start;
    if (!current) {
      const firstIndex = firstStop ? remaining.findIndex((stop) => stop.id === firstStop.id) : 0;
      current = remaining.splice(Math.max(0, firstIndex), 1)[0];
    }
    if (!start && current) route.push(current);
    while (remaining.length) {
      let nearestIndex = 0;
      let nearestCost = getCost(current, remaining[0]);
      for (let index = 1; index < remaining.length; index += 1) {
        const cost = getCost(current, remaining[index]);
        if (cost < nearestCost) {
          nearestCost = cost;
          nearestIndex = index;
        }
      }
      current = remaining.splice(nearestIndex, 1)[0];
      route.push(current);
    }
    return route;
  };
  const refineWithTwoOpt = (initialRoute, start = null, end = null) => {
    let route = initialRoute.slice();
    let improved = true;
    const firstReversibleIndex = start ? 0 : 1;
    while (improved) {
      improved = false;
      const currentCost = routeCost(route, start, end);
      for (let first = firstReversibleIndex; first < route.length - 1 && !improved; first += 1) {
        for (let last = first + 1; last < route.length; last += 1) {
          const candidate = [
            ...route.slice(0, first),
            ...route.slice(first, last + 1).reverse(),
            ...route.slice(last + 1),
          ];
          if (routeCost(candidate, start, end) < currentCost) {
            route = candidate;
            improved = true;
            break;
          }
        }
      }
    }
    return route;
  };
  const optimizeSegment = (segment, start, end) => {
    if (segment.length < 2) return segment;
    const startCandidates = start ? [null] : segment;
    return startCandidates.reduce((bestRoute, firstStop) => {
      const candidate = refineWithTwoOpt(nearestNeighbor(segment, start, firstStop), start, end);
      return !bestRoute || routeCost(candidate, start, end) < routeCost(bestRoute, start, end)
        ? candidate
        : bestRoute;
    }, null);
  };
  const byDate = new Map();
  activities.forEach((activity) => {
    if (!byDate.has(activity.date)) byDate.set(activity.date, []);
    byDate.get(activity.date).push(activity);
  });
  const optimized = [];
  [...byDate.keys()].sort().forEach((date) => {
    const day = byDate.get(date).slice().sort((first, second) => (first.time || '').localeCompare(second.time || ''));
    const timeSlots = day.map((activity) => activity.time || '');
    const ordered = [];
    let segment = [];
    let previousAnchor = null;
    day.forEach((activity) => {
      if (activity.category !== 'flight') {
        segment.push(activity);
        return;
      }
      ordered.push(...optimizeSegment(segment, previousAnchor, activity), activity);
      segment = [];
      previousAnchor = activity;
    });
    ordered.push(...optimizeSegment(segment, previousAnchor, null));
    optimized.push(...ordered.map((activity, index) => ({
      ...activity,
      time: activity.category === 'flight' ? activity.time : timeSlots[index],
    })));
  });
  return optimized;
}

aiPlannerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const startDate = aiPlannerStartDate.value;
  const endDate = aiPlannerEndDate.value;
  const tripLength = Math.floor((Date.parse(`${endDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`)) / 86400000) + 1;
  if (!Number.isFinite(tripLength) || tripLength < 1 || tripLength > 14) {
    aiPlannerStatus.textContent = state.language === 'zh' ? '請選擇 1 至 14 天的日期範圍。' : 'Choose a date range between 1 and 14 days.';
    return;
  }
  const currentActivities = state.activities.filter((activity) => activity.id && activity.date && activity.title && activity.location);
  const plannerMapProvider = isKoreaDestination(aiPlannerDestination.value.trim()) ? 'naver' : 'google';
  clearAIRoutePreview();
  generateAIPlanBtn.disabled = true;
  closeAIPlannerBtn.disabled = true;
  setAIThinking(true);
  setAitineraryAskButton(true);
  aiPlannerStatus.textContent = state.language === 'zh' ? 'Aitinerary 正在理解你的要求並選擇合適的操作。' : 'Aitinerary is interpreting your request and choosing the right action.';
  try {
    if (isSavedPlaceListRequest(aiPlannerPreferences.value)) {
      aiPlannerStatus.textContent = state.language === 'zh' ? '正在整理附件中的所有地點…' : 'Preparing every place from the attachment…';
      pendingAIReferencePlaceList = await verifyAttachedReferencePlaces(aiPlannerDestination.value.trim());
      renderAIReferencePlaceList();
      aiPlannerStatus.textContent = state.language === 'zh'
        ? `已列出附件中的全部 ${pendingAIReferencePlaceList.length} 個地點。`
        : `Listed all ${pendingAIReferencePlaceList.length} places from the attachment.`;
      return;
    }
    if (!window.itinerarySync?.isConfigured()) throw new Error('Firebase is not configured');
    await window.itinerarySync.authenticate();
    const travelTimeLegs = isRouteOptimizationRequest(aiPlannerPreferences.value) && currentActivities.length >= 2
      ? await buildAITravelTimeMatrix(currentActivities)
      : [];
    if (travelTimeLegs.length) {
      const mapServiceName = plannerMapProvider === 'naver' ? 'Naver-compatible Korea route' : 'Google Maps';
      aiPlannerStatus.textContent = state.language === 'zh'
        ? `已比較 ${travelTimeLegs.length} 條${plannerMapProvider === 'naver' ? '韓國地圖' : ' Google Maps'}移動時間，正在優化旅遊體驗…`
        : `Compared ${travelTimeLegs.length} ${mapServiceName} travel times. Optimizing the travel experience…`;
    }
    const generateItinerary = firebase.app().functions('asia-east2').httpsCallable('generateItinerary');
    const result = await generateItinerary({
      mode: 'assistant',
      destination: aiPlannerDestination.value.trim(),
      startDate,
      endDate,
      preferences: aiPlannerPreferences.value.trim(),
      language: state.language || 'en',
      mapProvider: plannerMapProvider,
      activities: currentActivities,
      referencePlaces: aiReferencePlaces,
      travelTimeLegs,
    });
    setAIUsage(result.data?.usage || {});
    const action = result.data?.action || 'create-plan';
    if (action === 'optimize-route') {
      let optimizedActivities = Array.isArray(result.data?.optimizedActivities) ? result.data.optimizedActivities : [];
      if (optimizedActivities.length < 2) throw new Error('No optimized route returned');
      const currentById = new Map(currentActivities.map((activity) => [activity.id, activity]));
      optimizedActivities = optimizeRouteOrder(optimizedActivities.map((activity) => ({
        ...currentById.get(activity.id),
        ...activity,
      })), travelTimeLegs).map((activity) => ({
        id: activity.id,
        time: activity.time,
        routeNote: activity.routeNote,
      }));
      aiPlannerStatus.textContent = plannerMapProvider === 'naver'
        ? (state.language === 'zh' ? '正在用韓國地圖驗證距離與交通時間。' : 'Verifying distances and travel times with Korea map data.')
        : (state.language === 'zh' ? '正在用 Google Maps 驗證距離與交通時間。' : 'Verifying distances and travel times with Google Maps.');
      pendingAIRoutePreview = await buildAIRoutePreview(optimizedActivities);
      renderAIRoutePreview();
      saveAISearchHistory(action);
    } else if (action === 'recommend-activities') {
      const suggestions = Array.isArray(result.data?.recommendedActivities) ? result.data.recommendedActivities : [];
      aiPlannerStatus.textContent = plannerMapProvider === 'naver'
        ? (state.language === 'zh' ? '正在用韓國地圖驗證推薦地點。' : 'Verifying recommendations with Korea map data.')
        : (state.language === 'zh' ? '正在用 Google Maps 驗證推薦地點。' : 'Verifying recommendations with Google Maps.');
      const verifiedSuggestions = await verifyAIActivityPlaces(suggestions, aiPlannerDestination.value.trim());
      const existingActivities = currentActivities.map((activity) => ({ ...activity }));
      const taggedSuggestions = verifiedSuggestions.map((activity) => ({ ...activity, _aiSuggestion: true }));
      const reachableActivities = await verifyAIDailyReachability([...existingActivities, ...taggedSuggestions], aiPlannerDestination.value.trim(), true);
      pendingAIActivitySuggestions = reachableActivities
        .filter((activity) => activity._aiSuggestion)
        .map((activity) => {
          const suggestion = { ...activity };
          delete suggestion._aiSuggestion;
          return suggestion;
        });
      if (!pendingAIActivitySuggestions.length) throw new Error('No recommendations returned');
      renderAIActivitySuggestions();
      saveAISearchHistory(action);
    } else {
      const generatedActivities = Array.isArray(result.data?.activities) ? result.data.activities : [];
      aiPlannerStatus.textContent = plannerMapProvider === 'naver'
        ? (state.language === 'zh' ? '正在用韓國地圖驗證每個地點。' : 'Verifying every place with Korea map data.')
        : (state.language === 'zh' ? '正在用 Google Maps 驗證每個地點。' : 'Verifying every place with Google Maps.');
      let verifiedActivities = await verifyAIActivityPlaces(generatedActivities, aiPlannerDestination.value.trim());
      verifyAIDailyMeals(verifiedActivities, startDate, endDate);
      const routableActivities = verifiedActivities.map((activity, index) => ({ ...activity, id: `ai-route-${index}` }));
      aiPlannerStatus.textContent = state.language === 'zh' ? '正在使用最近鄰與 2-opt 比較每日路線。' : 'Optimizing each day with nearest-neighbor and 2-opt.';
      const generatedTravelTimeLegs = await buildAITravelTimeMatrix(routableActivities);
      if (generatedTravelTimeLegs.length) verifiedActivities = optimizeRouteOrder(routableActivities, generatedTravelTimeLegs);
      const activities = await verifyAIDailyReachability(verifiedActivities, aiPlannerDestination.value.trim(), false, plannerMapProvider);
      if (!activities.length) throw new Error('No activities returned');
      pendingAICreatePreview = {
        destination: aiPlannerDestination.value.trim(),
        startDate,
        endDate,
        activities: activities.slice().sort((first, second) => first.date.localeCompare(second.date) || first.time.localeCompare(second.time)),
      };
      renderAICreatePreview();
      saveAISearchHistory('create-plan');
    }
    aiPlannerStatus.textContent = state.language === 'zh' ? '預覽已產生。確認內容後再套用。' : 'Preview ready. Review it before applying anything.';
  } catch (error) {
    console.error('AI itinerary generation failed', error);
    const rateLimited = error.code === 'functions/resource-exhausted';
    const localProcessingError = !String(error.code || '').startsWith('functions/');
    if (rateLimited) {
      aiPlansRemaining = 0;
      updateAIPlanUsage();
    }
    aiPlannerStatus.textContent = rateLimited
      ? (state.language === 'zh' ? '今天的 5 次 Aitinerary 規劃已用完，將於 UTC 00:00 重設。' : 'Today’s 5 Aitinerary plans are used. The limit resets at 00:00 UTC.')
      : localProcessingError && error.message
        ? (state.language === 'zh' ? `預覽處理失敗：${error.message}` : `Could not prepare the preview: ${error.message}`)
      : (state.language === 'zh' ? '無法產生行程。請確認 Firebase Functions 與 Vertex AI 已啟用。' : 'Could not generate the plan. Check Firebase Functions and Vertex AI access.');
  } finally {
    setAIThinking(false);
    generateAIPlanBtn.disabled = false;
    closeAIPlannerBtn.disabled = false;
    setAitineraryAskButton(false);
  }
});

closeActivityModalBtn.addEventListener('click', () => {
  closeActivityModal();
});

activityModalOverlay.addEventListener('click', (e) => {
  if (e.target === activityModalOverlay) e.stopPropagation();
});

function openActivityModal(activity = null) {
  editingActivityId = activity?.id || null;
  currentPlaceAddress = activity?.address || '';
  currentPlaceId = activity?.placeId || '';
  currentPlaceCoordinates = Number.isFinite(activity?.latitude) && Number.isFinite(activity?.longitude)
    ? { lat: activity.latitude, lng: activity.longitude }
    : null;
  currentNaverPlaceName = activity?.naverPlaceName || getLegacyNaverSearchName(activity?.naverUrl) || '';
  currentGoogleReviewCount = Number(activity?.googleReviewCount) || 0;
  currentPlaceWebsite = activity?.website || '';
  shoppingItemsDraft = activity?.shoppingItems ? activity.shoppingItems.map((item) => ({ ...item })) : [];
  activityForm.reset();
  populateExpenseCurrencyOptions(activityExpenseCurrencyInput, getExpenseCurrency(activity?.expense) || getCurrencyForDestination(getCityForDate(activity?.date || getTripDays()[selectedDayIndex])));
  populatePayerOptions(activityPaidByInput, activity?.paidBy || '');
  populateMemberOptions(activityBillMemberInput, activity?.billMember || '');
  updateActivityExpenseHint(activity?.date || getTripDays()[selectedDayIndex]);
  document.getElementById('activityModalTitle').textContent = editingActivityId ? t('editItem') : t('addItem').replace(/^\+ /, '');
  document.getElementById('activitySubmitBtn').textContent = editingActivityId ? t('saveItem') : t('addItem');
  toggleFlightDetails(activity?.category || 'flight');
  toggleShoppingDetails(activity?.category || 'flight');
  toggleBookingDetails(activity?.category || 'flight');
  renderShoppingEditor();
  const days = getTripDays();
  const selectedDate = days[selectedDayIndex];
  if (activity) {
    document.getElementById('activityDate').value = activity.date || '';
    document.getElementById('activityTime').value = activity.time || '';
    document.getElementById('activityTitle').value = activity.title || '';
    document.getElementById('activityCategory').value = activity.category || 'other';
    document.getElementById('activityLocation').value = activity.location || '';
    document.getElementById('activityRating').value = activity.rating || '';
    document.getElementById('activityDescription').value = activity.address || activity.description || '';
    activityMapProviderInput.value = activity.mapProvider || getMapProviderForDate(activity.date);
    document.getElementById('activityUpfrontPaymentTitle').value = activity.upfrontPaymentTitle || '';
    document.getElementById('activityBookingDetails').value = activity.bookingDetails || '';
    document.getElementById('activityContactDetails').value = activity.contactDetails || '';
    document.getElementById('activityExpense').value = activity.expense || '';
    activityExpenseCurrencyInput.value = getExpenseCurrency(activity.expense) || activityExpenseCurrencyInput.value;
    activityPaidByInput.value = activity.paidBy || '';
    activityBillMemberInput.value = activity.billMember || '';
    activityPaymentMethodInput.value = activity.paymentMethod || 'cash';
    activityCardNetworkInput.value = activity.cardNetwork || 'visa';
    activityCardMarkupInput.value = activity.cardMarkup !== '' && isFinite(activity.cardMarkup)
      ? activity.cardMarkup
      : getCardMarkupForNetwork(activityCardNetworkInput.value);
    toggleCardFields(activityPaymentMethodInput, activityCardNetworkField, activityCardMarkupField, activityCardRateHint);
    document.getElementById('activityRemarks').value = activity.remarks || '';
    document.getElementById('flightNumber').value = activity.flightNumber || '';
    document.getElementById('flightDeparture').value = activity.flightDeparture || '';
    document.getElementById('flightArrival').value = activity.flightArrival || '';
    document.getElementById('flightArrivalDate').value = activity.flightArrivalDate || '';
    document.getElementById('flightArrivalTime').value = activity.flightArrivalTime || '';
    document.getElementById('departureTerminal').value = activity.departureTerminal || '';
    document.getElementById('departureGate').value = activity.departureGate || '';
    document.getElementById('arrivalTerminal').value = activity.arrivalTerminal || '';
    document.getElementById('arrivalGate').value = activity.arrivalGate || '';
  } else if (selectedDate) {
    document.getElementById('activityDate').value = selectedDate;
    activityMapProviderInput.value = getMapProviderForDate(selectedDate);
  }
  updatePlaceAutocompleteRestrictions(document.getElementById('activityDate').value);
  activityWebsiteInput.value = currentPlaceWebsite;
  placeLookupStatus.textContent = '';
  if (!activity) toggleCardFields(activityPaymentMethodInput, activityCardNetworkField, activityCardMarkupField, activityCardRateHint);
  activityModalOverlay.classList.remove('hidden');
}

function toggleFlightDetails(category) {
  flightDetails.classList.toggle('hidden', category !== 'flight');
}

function toggleShoppingDetails(category) {
  shoppingDetails.classList.toggle('hidden', category !== 'shopping');
}

function toggleBookingDetails(category) {
  bookingDetails.classList.toggle('hidden', !['meal', 'transport', 'sight', 'hotel'].includes(category));
}

function renderShoppingEditor() {
  shoppingItemList.innerHTML = '';
  shoppingItemsDraft.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'shopping-item-row';
    const image = item.image ? document.createElement('img') : null;
    if (image) {
      image.src = item.image;
      image.alt = item.name;
    }
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '×';
    remove.addEventListener('click', () => {
      shoppingItemsDraft.splice(index, 1);
      renderShoppingEditor();
    });
    if (image) row.appendChild(image);
    const name = item.url ? document.createElement('a') : document.createElement('span');
    name.className = 'shopping-item-name';
    if (item.url) {
      name.href = item.url;
      name.target = '_blank';
      name.rel = 'noopener noreferrer';
    }
    name.textContent = item.name;
    row.appendChild(name);
    row.appendChild(remove);
    shoppingItemList.appendChild(row);
  });
}

document.getElementById('addShoppingItemBtn').addEventListener('click', addShoppingItem);
shoppingNameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addShoppingItem();
  }
});

async function addShoppingItem() {
  if (!shoppingNameInput.value.trim() && shoppingProductUrlInput.value.trim()) {
    await autofillProductFromUrl({
      urlInput: shoppingProductUrlInput,
      nameInput: shoppingNameInput,
      imageInput: shoppingImageInput,
      previewElement: shoppingImagePreview,
      statusElement: shoppingImageStatus,
      lookupType: 'activity',
    });
  }
  const name = shoppingNameInput.value.trim();
  const image = shoppingImageInput.value.trim();
  const url = shoppingProductUrlInput.value.trim();
  if (!name) return;
  shoppingItemsDraft.push({ name, url, image, done: false });
  shoppingNameInput.value = '';
  shoppingImageInput.value = '';
  shoppingProductUrlInput.value = '';
  shoppingImagePreview.src = '';
  shoppingImagePreview.classList.add('hidden');
  shoppingImageStatus.textContent = '';
  renderShoppingEditor();
}

function updateShoppingImagePreview(imageInput, previewElement, statusElement) {
  const image = imageInput.value.trim();
  previewElement.classList.add('hidden');
  statusElement.textContent = '';
  if (!image) return;
  previewElement.onload = () => {
    previewElement.classList.remove('hidden');
    statusElement.textContent = 'Image ready';
  };
  previewElement.onerror = () => {
    statusElement.textContent = 'Image URL could not be loaded';
  };
  previewElement.src = image;
}

function normalizeProductUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  try {
    return new URL(trimmed).href;
  } catch (error) {
    try {
      return new URL(`https://${trimmed}`).href;
    } catch (fallbackError) {
      return '';
    }
  }
}

async function fetchProductMetadata(productUrl) {
  const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(productUrl)}`);
  if (!response.ok) throw new Error('Product lookup failed');
  const payload = await response.json();
  if (payload.status === 'fail') throw new Error(payload.message || 'Product lookup failed');
  const data = payload.data || {};
  return {
    name: data.title || data.publisher || '',
    image: data.image?.url || data.logo?.url || '',
  };
}

async function autofillProductFromUrl({ urlInput, nameInput, imageInput, previewElement, statusElement, lookupType }) {
  const productUrl = normalizeProductUrl(urlInput.value);
  if (!productUrl) {
    statusElement.textContent = urlInput.value.trim() ? 'Enter a valid product URL' : '';
    return;
  }

  urlInput.value = productUrl;
  const lookupId = lookupType === 'haul' ? ++shoppingHaulProductLookupId : ++shoppingProductLookupId;
  statusElement.textContent = 'Looking up product...';

  try {
    const product = await fetchProductMetadata(productUrl);
    const latestLookupId = lookupType === 'haul' ? shoppingHaulProductLookupId : shoppingProductLookupId;
    if (lookupId !== latestLookupId) return;

    if (product.name && !nameInput.value.trim()) nameInput.value = product.name;
    if (product.image && !imageInput.value.trim()) {
      imageInput.value = product.image;
      updateShoppingImagePreview(imageInput, previewElement, statusElement);
    } else {
      statusElement.textContent = product.name || product.image ? 'Product info added' : 'No product details found';
    }
  } catch (error) {
    statusElement.textContent = 'Product details could not be fetched';
  }
}

shoppingImageInput.addEventListener('input', () => {
  updateShoppingImagePreview(shoppingImageInput, shoppingImagePreview, shoppingImageStatus);
});

shoppingProductUrlInput.addEventListener('change', () => {
  autofillProductFromUrl({
    urlInput: shoppingProductUrlInput,
    nameInput: shoppingNameInput,
    imageInput: shoppingImageInput,
    previewElement: shoppingImagePreview,
    statusElement: shoppingImageStatus,
    lookupType: 'activity',
  });
});

shoppingHaulImage.addEventListener('input', () => {
  updateShoppingImagePreview(shoppingHaulImage, shoppingHaulImagePreview, shoppingHaulImageStatus);
});

shoppingHaulUrl.addEventListener('change', () => {
  autofillProductFromUrl({
    urlInput: shoppingHaulUrl,
    nameInput: shoppingHaulName,
    imageInput: shoppingHaulImage,
    previewElement: shoppingHaulImagePreview,
    statusElement: shoppingHaulImageStatus,
    lookupType: 'haul',
  });
});

activityCategoryInput.addEventListener('change', () => {
  toggleFlightDetails(activityCategoryInput.value);
  toggleShoppingDetails(activityCategoryInput.value);
  toggleBookingDetails(activityCategoryInput.value);
  renderShoppingEditor();
});

function closeActivityModal() {
  activityModalOverlay.classList.add('hidden');
}

function updateActivityExpenseHint(date) {
  const currency = getCurrencyForDestination(getCityForDate(date));
  activityExpenseInput.placeholder = `e.g. 20 ${currency} or $20`;
}

function deleteActivity(id) {
  state.activities = state.activities.filter((a) => a.id !== id);
  state.settlementLogs = (state.settlementLogs || []).filter((log) => log.entryId !== id);
  saveState();
  render();
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
}

// Builds one ordered, de-duplicated itinerary from every configured city period.
function getTripDays() {
  const periods = state.multipleCities
    ? state.cities
    : [{ startDate: state.tripStartDate, endDate: state.tripEndDate }];
  const daySet = new Set();

  periods.forEach((period) => {
    if (!period.startDate || !period.endDate || period.startDate > period.endDate) return;
    let cursor = new Date(period.startDate + 'T00:00:00');
    const last = new Date(period.endDate + 'T00:00:00');
    while (cursor <= last) {
      daySet.add(toISODate(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  if (!daySet.size) {
    state.activities.map((activity) => activity.date).filter(Boolean).forEach((date) => daySet.add(date));
  }
  return [...daySet].sort();
}

function getCityDaySummaries(days) {
  const totals = new Map();
  days.forEach((date) => {
    const destination = getCityForDate(date).trim();
    if (!destination) return;
    totals.set(destination, (totals.get(destination) || 0) + 1);
  });
  return [...totals].map(([destination, dayCount]) => ({ destination, dayCount }));
}

function formatCityDaySummaries(days, fallbackDestination) {
  const totalDays = days.length;
  const summaries = getCityDaySummaries(days);
  if (!summaries.length) {
    return state.language === 'zh'
      ? `${fallbackDestination}共 ${totalDays} 天`
      : `${totalDays} day${totalDays > 1 ? 's' : ''} in ${fallbackDestination}`;
  }
  return summaries
    .map(({ destination, dayCount }) => (
      state.language === 'zh'
        ? `${destination} ${dayCount} 天`
        : `${dayCount} day${dayCount > 1 ? 's' : ''} in ${destination}`
    ))
    .join(state.language === 'zh' ? ' · ' : ' · ');
}

function getCityForDate(date) {
  if (!date) return state.tripDestination || '';
  const periods = state.multipleCities ? state.cities : [{
    destination: state.tripDestination,
    startDate: state.tripStartDate,
    endDate: state.tripEndDate,
  }];
  const matchingPeriod = periods.find((period) => (
    period.destination && period.startDate && period.endDate
    && date >= period.startDate && date <= period.endDate
  ));
  return matchingPeriod?.destination || state.tripDestination || '';
}

function isKoreaDestination(destination) {
  const normalized = String(destination || '').toLocaleLowerCase().replace(/[.,]/g, ' ');
  return /(^|\s)(south korea|republic of korea|korea|kr)(\s|$)/.test(normalized)
    || /(대한민국|한국|서울|부산|제주|인천|대구|대전|광주|수원|경주|강릉)/.test(normalized)
    || /(^|\s)(seoul|busan|jeju|incheon|daegu|daejeon|gwangju|suwon|gyeongju|gangneung)(\s|$)/.test(normalized);
}

function getMapProviderForDate(date) {
  return isKoreaDestination(getCityForDate(date)) ? 'naver' : 'google';
}

function getTripMapProvider() {
  const destinations = state.multipleCities
    ? state.cities.map((city) => city.destination).filter(Boolean)
    : [state.tripDestination].filter(Boolean);
  return destinations.length && destinations.every(isKoreaDestination) ? 'naver' : 'google';
}

function toISODate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function closestDayIndexToToday() {
  const days = getTripDays();
  if (!days.length) return 0;
  const todayISO = toISODate(new Date());
  const index = days.indexOf(todayISO);
  return index >= 0 ? index : 0;
}

function selectDay(index) {
  const days = getTripDays();
  if (!days.length) return;
  selectedDayIndex = Math.max(0, Math.min(index, days.length - 1));
  mapViewMode = 'day';
  clearSuggestedRouteDisplay();
  render();
}

// Palette cycled per trip day so the day strip, itinerary, and map pins share a color per day.
const DAY_COLORS = ['#bd5d3a', '#4b6b8a', '#5c8a5c', '#8a5c46', '#8a5c8a', '#a68a3d', '#4d8a8a', '#8a4d6b'];

function getDayColor(index) {
  return DAY_COLORS[index % DAY_COLORS.length];
}

function renderDayStrip(days) {
  dayStrip.innerHTML = '';

  days.forEach((dateStr, index) => {
    const date = new Date(dateStr + 'T00:00:00');
    const card = document.createElement('div');
    card.className = 'day-card' + (index === selectedDayIndex ? ' selected' : '');
    card.style.borderTop = `3px solid ${getDayColor(index)}`;

    const badge = document.createElement('span');
    badge.className = 'day-badge';
    badge.textContent = `D${index + 1}`;
    card.appendChild(badge);

    const weekday = document.createElement('div');
    weekday.className = 'weekday';
    weekday.textContent = date.toLocaleDateString(state.language === 'zh' ? 'zh-TW' : 'en-US', { weekday: 'short' });
    card.appendChild(weekday);

    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();
    card.appendChild(dayNumber);

    const month = document.createElement('div');
    month.className = 'month';
    month.textContent = date.toLocaleDateString(state.language === 'zh' ? 'zh-TW' : 'en-US', { month: 'short' });
    card.appendChild(month);

    card.addEventListener('click', () => selectDay(index));
    dayStrip.appendChild(card);
  });
}

async function loadTodayWeather(dateStr, city) {
  const requestId = ++weatherRequestId;
  currentDestinationCity = city || '';
  currentDestinationCoordinates = null;
  todayTime.textContent = '--:--';
  todayTimeMeta.textContent = '—';
  todayTimeLocation.textContent = city ? `Time in ${city}` : 'Time in destination';
  todayWeatherDescription.textContent = state.language === 'zh' ? '天氣預報' : 'Forecast';
  todayTemperature.textContent = '—°C';
  todayWeatherIcon.textContent = '☀';
  todayBadge.className = 'today-badge weather-default weather-text-light';
  if (!city) return;
  const cacheKey = `${city}|${dateStr}`;
  if (weatherCache[cacheKey]) {
    if (requestId === weatherRequestId) applyTodayWeather(weatherCache[cacheKey]);
    return;
  }
  try {
    const coordinates = await geocodeCityForWeather(city);
    if (!coordinates) return;
    currentDestinationCoordinates = coordinates;
    const destinationTime = await fetchDestinationLocalTime(coordinates.lat, coordinates.lng, city);
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lng}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max&temperature_unit=celsius&timezone=auto&forecast_days=16`);
    if (!response.ok) throw new Error('Forecast unavailable');
    const data = await response.json();
    const dates = data.daily?.time || [];
    const forecastIndex = dates.indexOf(dateStr);
    const localTime = {
      timeText: destinationTime?.timeText || parseOpenMeteoTime(data.current?.time || ''),
      metaText: '',
      locationText: destinationTime?.locationText || `Time in ${city}`,
      timeZoneId: destinationTime?.timeZoneId || data.timezone || 'UTC',
    };
    if (forecastIndex < 0) {
      const unavailable = {
        description: state.language === 'zh' ? '預報尚未提供' : 'Forecast unavailable',
        degrees: '—',
        timeText: localTime.timeText,
        metaText: localTime.metaText,
        locationText: localTime.locationText,
        timeZoneId: localTime.timeZoneId,
      };
      weatherCache[cacheKey] = unavailable;
      if (requestId === weatherRequestId) applyTodayWeather(unavailable);
      return;
    }
    const degrees = data.daily?.temperature_2m_max?.[forecastIndex];
    const description = getOpenMeteoWeatherDescription(data.daily?.weather_code?.[forecastIndex]);
    const weather = {
      description,
      degrees: degrees ?? '—',
      timeText: localTime.timeText,
      metaText: localTime.metaText,
      locationText: localTime.locationText,
      timeZoneId: localTime.timeZoneId,
    };
    weatherCache[cacheKey] = weather;
    if (requestId === weatherRequestId) applyTodayWeather(weather);
  } catch (error) {
    if (requestId === weatherRequestId) {
      todayTime.textContent = '--:--';
      todayTimeMeta.textContent = '—';
      todayTimeLocation.textContent = city ? `Time in ${city}` : 'Time in destination';
      todayWeatherDescription.textContent = state.language === 'zh' ? '無法取得預報' : 'Weather unavailable';
      todayTemperature.textContent = '—°C';
    }
  }
}

function applyTodayWeather(weather) {
  const description = weather.description || (state.language === 'zh' ? '天氣預報' : 'Forecast');
  todayWeatherDescription.textContent = description;
  todayTime.textContent = weather.timeText || '--:--';
  todayTimeMeta.textContent = weather.metaText || '';
  todayTimeLocation.textContent = weather.locationText || 'Time in destination';
  todayTemperature.textContent = `${weather.degrees}°C`;
  const value = description.toLowerCase();
  const weatherClass = value.includes('rain') ? 'weather-rain'
    : value.includes('snow') ? 'weather-snow'
      : value.includes('cloud') ? 'weather-cloudy' : 'weather-sunny';
  todayWeatherIcon.textContent = weatherClass === 'weather-rain' ? '☂'
    : weatherClass === 'weather-snow' ? '❄'
      : weatherClass === 'weather-cloudy' ? '☁' : '☀';
  const textTone = getWeatherTextTone(weatherClass);
  todayBadge.className = `today-badge ${weatherClass} weather-text-${textTone}`;
}

async function refreshDestinationClock() {
  const city = currentDestinationCity;
  if (!city) return;
  const requestId = ++destinationClockRequestId;
  if (!currentDestinationCoordinates) {
    currentDestinationCoordinates = await geocodeCityForWeather(city);
  }
  if (!currentDestinationCoordinates || requestId !== destinationClockRequestId) return;
  const destinationTime = await fetchDestinationLocalTime(
    currentDestinationCoordinates.lat,
    currentDestinationCoordinates.lng,
    city,
  );
  if (!destinationTime || requestId !== destinationClockRequestId) return;
  todayTime.textContent = destinationTime.timeText;
  todayTimeLocation.textContent = destinationTime.locationText;
}

function getWeatherTextTone(weatherClass) {
  const theme = document.documentElement.dataset.theme || state.theme || 'joy';
  const darkTextThemes = {
    joy: ['weather-sunny', 'weather-cloudy', 'weather-snow'],
    violet: ['weather-snow'],
    cobalt: ['weather-sunny', 'weather-cloudy', 'weather-snow'],
    coffee: ['weather-sunny', 'weather-cloudy', 'weather-snow'],
  };
  return darkTextThemes[theme]?.includes(weatherClass) ? 'dark' : 'light';
}

function formatDestinationTime(value, timeZoneId = null) {
  if (!value) return '--:--';
  if (typeof value === 'string' && /AM|PM/i.test(value)) return value;
  if (typeof value === 'string' && /T\d{2}:\d{2}/.test(value)) {
    const match = value.match(/T(\d{2}):(\d{2})/);
    if (!match) return '--:--';
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    const normalizedHour = hour % 12 === 0 ? 12 : hour % 12;
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${normalizedHour}:${String(minute).padStart(2, '0')} ${period}`;
  }
  if (value instanceof Date && timeZoneId) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timeZoneId,
    }).format(value);
  }
  if (typeof value === 'number') {
    return formatDestinationTime(new Date(value * 1000), timeZoneId);
  }
  return '--:--';
}

function parseOpenMeteoTime(iso) {
  if (!iso || !/T\d{2}:\d{2}/.test(iso)) return '--:--';
  const match = iso.match(/T(\d{2}):(\d{2})/);
  if (!match) return '--:--';
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const normalizedHour = hour % 12 === 0 ? 12 : hour % 12;
  const period = hour >= 12 ? 'PM' : 'AM';
  return `${normalizedHour}:${String(minute).padStart(2, '0')} ${period}`;
}

async function fetchDestinationLocalTime(lat, lng, city) {
  try {
    const normalizedCity = normalizeDestinationForTime(city);
    const lookupCity = normalizedCity || city;
    const response = await fetch(`https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lng}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (!data || typeof data.hour !== 'number' || typeof data.minute !== 'number') return null;
    const hour = Number(data.hour);
    const minute = Number(data.minute);
    const normalizedHour = hour % 12 === 0 ? 12 : hour % 12;
    const period = hour >= 12 ? 'PM' : 'AM';
    return {
      timeText: `${normalizedHour}:${String(minute).padStart(2, '0')} ${period}`,
      locationText: `Time in ${lookupCity || 'destination'}`,
      timeZoneId: data.timeZone || 'UTC',
    };
  } catch (error) {
    return null;
  }
}

function formatWeatherDate(value) {
  if (typeof value === 'string') return value;
  if (!value?.year || !value?.month || !value?.day) return '';
  return `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
}

function normalizeDestinationForTime(city) {
  const value = (city || '').trim();
  if (!value) return '';
  const lower = value.toLowerCase();
  if (lower.includes('south korea') || lower === 'korea' || lower === 'kr' || lower === 'republic of korea') return 'Seoul';
  if (lower.includes('north korea') || lower === 'dprk') return 'Pyongyang';
  if (lower.includes('japan') || lower === 'jp') return 'Tokyo';
  if (lower.includes('jeju')) return 'Jeju City';
  return value;
}

function geocodeCityForWeather(city) {
  const normalized = normalizeDestinationForTime(city);
  return fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(normalized || city)}&count=1&language=en&format=json`)
    .then((response) => response.ok ? response.json() : null)
    .then((data) => data?.results?.[0] ? { lat: data.results[0].latitude, lng: data.results[0].longitude } : null)
    .catch(() => null);
}

function getOpenMeteoWeatherDescription(code) {
  if (code === 0) return 'Sunny';
  if ([1, 2, 3].includes(code)) return 'Cloudy';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Forecast';
}

// Maps a destination name to a native-language traveler greeting, falling back to English.
const GREETINGS_BY_DESTINATION = [
  { keywords: ['italy', 'italia', 'rome', 'roma', 'venice', 'venezia', 'milan', 'florence'], greeting: 'Ciao, viaggiatore!', bonVoyage: 'Buon Viaggio' },
  { keywords: ['korea', 'seoul', 'busan', 'jeju'], greeting: '안녕, 여행자!', bonVoyage: '즐거운 여행' },
  { keywords: ['japan', 'tokyo', 'osaka', 'kyoto'], greeting: 'ようこそ、旅人!', bonVoyage: '良い旅を' },
  { keywords: ['france', 'paris', 'nice', 'lyon'], greeting: 'Bonjour, voyageur!', bonVoyage: 'Bon Voyage' },
  { keywords: ['spain', 'madrid', 'barcelona'], greeting: '¡Hola, viajero!', bonVoyage: 'Buen Viaje' },
  { keywords: ['germany', 'berlin', 'munich'], greeting: 'Hallo, Reisender!', bonVoyage: 'Gute Reise' },
  { keywords: ['china', 'beijing', 'shanghai'], greeting: '你好,旅行者!', bonVoyage: '一路顺风' },
  { keywords: ['taiwan', 'taipei'], greeting: '哈囉,旅人!', bonVoyage: '祝旅途愉快' },
  { keywords: ['thailand', 'bangkok', 'phuket'], greeting: 'สวัสดี นักเดินทาง!', bonVoyage: 'เดินทางปลอดภัย' },
  { keywords: ['vietnam', 'hanoi', 'saigon'], greeting: 'Xin chào, du khách!', bonVoyage: 'Chúc thượng lộ bình an' },
  { keywords: ['portugal', 'lisbon', 'porto'], greeting: 'Olá, viajante!', bonVoyage: 'Boa Viagem' },
  { keywords: ['netherlands', 'amsterdam'], greeting: 'Hallo, reiziger!', bonVoyage: 'Goede Reis' },
  { keywords: ['greece', 'athens', 'santorini'], greeting: 'Γεια σου, ταξιδιώτη!', bonVoyage: 'Καλό ταξίδι' },
];

function getGreetingScript(destination) {
  const value = (destination || '').toLowerCase();
  for (const entry of GREETINGS_BY_DESTINATION) {
    if (entry.keywords.some((keyword) => value.includes(keyword))) {
      return entry.greeting;
    }
  }
  return 'Hello, traveler!';
}

function getBonVoyagePhrase(destination) {
  const value = (destination || '').toLowerCase();
  for (const entry of GREETINGS_BY_DESTINATION) {
    if (entry.keywords.some((keyword) => value.includes(keyword))) {
      return entry.bonVoyage;
    }
  }
  return 'Bon Voyage';
}

function renderTopBar() {
  topBarTripName.textContent = state.tripName || 'My Trip';
  const destinations = state.multipleCities
    ? state.cities.map((city) => city.destination).filter(Boolean)
    : [state.tripDestination].filter(Boolean);
  const destinationLabel = destinations.join(' · ');
  topBarDestination.textContent = destinationLabel || (state.language === 'zh' ? '你的' : 'Your');
  topBarBonVoyage.textContent = getBonVoyagePhrase(destinations[0] || state.tripDestination);
  greetingScript.textContent = getGreetingScript(state.tripDestination);
}

// --- Google Maps: dynamic script loading, geocoding cache, and colored day markers ---
let map = null;
let geocoder = null;
let placesService = null;
let directionsService = null;
let markers = [];
let activityInfoWindow = null;
let activeActivityInfoMarker = null;
let mapsApiLoaded = false;
let mapsApiLoading = false;
let placeAutocomplete = null;
let activeMapProvider = '';
let koreaMapResizeObserver = null;

function loadTripMapProvider() {
  const provider = getTripMapProvider();
  if (provider === activeMapProvider && (mapsApiLoaded || mapsApiLoading)) return;
  mapMarkerRenderToken += 1;
  if (activeMapProvider === 'naver' && typeof map?.remove === 'function') map.remove();
  koreaMapResizeObserver?.disconnect();
  koreaMapResizeObserver = null;
  activeMapProvider = provider;
  mapsApiLoaded = false;
  mapsApiLoading = false;
  map = null;
  geocoder = null;
  placesService = null;
  directionsService = null;
  tripMapEl.replaceChildren();
  if (provider === 'naver') {
    loadKoreaMap();
  } else {
    loadGoogleMaps(GOOGLE_MAPS_API_KEY);
  }
}

function loadKoreaMap() {
  if (!window.L) {
    mapStatus.textContent = state.language === 'zh' ? '無法載入韓國地圖。' : 'The Korea map could not load.';
    mapStatus.style.display = 'block';
    return;
  }
  mapsApiLoaded = true;
  mapsApiLoading = false;
  map = L.map(tripMapEl, { zoomControl: true }).setView([36.5, 127.8], 7);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
  koreaMapResizeObserver = new ResizeObserver((entries) => {
    const bounds = entries[0]?.contentRect;
    if (!bounds || bounds.width < 1 || bounds.height < 1 || activeMapProvider !== 'naver') return;
    map.invalidateSize({ animate: false, pan: false });
  });
  koreaMapResizeObserver.observe(tripMapEl);
  setTimeout(() => {
    if (activeMapProvider === 'naver' && map) map.invalidateSize({ animate: false, pan: false });
  }, 250);
  loadKoreaRatingService();
  tripMapEl.style.display = 'block';
  mapStatus.style.display = 'none';
  updateMapMarkers();
  renderSpotRouteSelectors(getTripDays());
  renderDayStrip(getTripDays());
}

function loadKoreaRatingService() {
  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY' || GOOGLE_MAPS_API_KEY.length < 20) return;
  window.gm_authFailure = () => {
    restoreActivityLocationInput();
    placeLookupStatus.textContent = 'Google Places rejected this site. Add this website URL to the API key HTTP referrer restrictions.';
  };
  const initializePlaces = () => {
    if (!window.google?.maps?.places || activeMapProvider !== 'naver') return;
    placesService = new google.maps.places.PlacesService(document.createElement('div'));
    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    setupPlaceAutocomplete();
    if (mapViewMode === 'day') updateKoreaMapMarkers();
    else if (routeModeSelect.value === 'TRANSIT') requestSuggestedRoute();
  };
  if (window.google?.maps?.places) {
    initializePlaces();
    return;
  }
  const existingScript = document.getElementById('googleMapsApiScript');
  if (existingScript) {
    existingScript.addEventListener('load', initializePlaces, { once: true });
    return;
  }
  const script = document.createElement('script');
  script.id = 'googleMapsApiScript';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}&libraries=places,geometry&language=ko&region=KR`;
  script.async = true;
  script.addEventListener('load', initializePlaces, { once: true });
  document.head.appendChild(script);
}

const TRAVEL_MAP_PALETTES = {
  joy: {
    label: '#56635f', land: '#f3f0e8', poi: '#e3eedf', road: '#ffffff',
    roadStroke: '#dedbd2', highway: '#dceeb0', transit: '#d8e4e0', water: '#b9e3e8',
  },
  violet: {
    label: '#625e70', land: '#f2f0f8', poi: '#e8e5f4', road: '#ffffff',
    roadStroke: '#ddd8eb', highway: '#ded6fa', transit: '#e1def0', water: '#cdddea',
  },
  cobalt: {
    label: '#536c8d', land: '#eef4fa', poi: '#e2edf5', road: '#ffffff',
    roadStroke: '#ceddea', highway: '#d4e6f7', transit: '#dbe8f2', water: '#bcdcf0',
  },
  coffee: {
    label: '#666675', land: '#f5efe3', poi: '#e9e1ce', road: '#fffdf8',
    roadStroke: '#dfd2bd', highway: '#ead9af', transit: '#e3ddd2', water: '#c4dce3',
  },
};

function getTravelMapStyles(theme) {
  const palette = TRAVEL_MAP_PALETTES[theme] || TRAVEL_MAP_PALETTES.joy;
  return [
    { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: palette.label }] },
    { featureType: 'landscape', elementType: 'geometry.fill', stylers: [{ color: palette.land }] },
    { featureType: 'poi', elementType: 'geometry.fill', stylers: [{ color: palette.poi }] },
    { featureType: 'poi', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: palette.road }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: palette.roadStroke }] },
    { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: palette.highway }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: palette.transit }] },
    { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: palette.water }] },
  ];
}

function loadGoogleMaps(apiKey) {
  if (!apiKey || mapsApiLoaded || mapsApiLoading) return;
  if (apiKey === 'YOUR_GOOGLE_MAPS_API_KEY' || apiKey.length < 20) {
    mapStatus.textContent = 'Set GOOGLE_MAPS_API_KEY in js/app.js to enable the map and Places features.';
    mapStatus.style.display = 'block';
    return;
  }
  mapsApiLoading = true;
  mapStatus.textContent = 'Loading map…';

  window.gm_authFailure = () => {
    mapsApiLoaded = false;
    mapsApiLoading = false;
    restoreActivityLocationInput();
    mapStatus.textContent = 'Google Maps rejected this API key. Check billing, HTTP referrer restrictions, Maps JavaScript API, and Places API.';
    mapStatus.style.display = 'block';
    placeLookupStatus.textContent = 'Google Places is unavailable because the API key was rejected. You can still edit the location and address manually.';
  };

  window.__initTripMap = () => {
    if (activeMapProvider !== 'google') return;
    mapsApiLoaded = true;
    mapsApiLoading = false;
    map = new google.maps.Map(tripMapEl, {
      center: { lat: 20, lng: 0 },
      zoom: 2,
      disableDefaultUI: true,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      keyboardShortcuts: false,
      clickableIcons: false,
      styles: getTravelMapStyles(state.theme),
    });
    geocoder = new google.maps.Geocoder();
    placesService = new google.maps.places.PlacesService(map);
    directionsService = new google.maps.DirectionsService();
    activityInfoWindow = new google.maps.InfoWindow({ maxWidth: 260 });
    setupPlaceAutocomplete();
    tripMapEl.style.display = 'block';
    updateMapMarkers();
    renderSpotRouteSelectors(getTripDays());
    renderDayStrip(getTripDays());
    if (activityLocationInput.value.trim()) lookupPlaceDetails();
  };

  if (window.google?.maps) {
    window.__initTripMap();
    return;
  }

  const existingScript = document.getElementById('googleMapsApiScript');
  if (existingScript) {
    existingScript.addEventListener('load', window.__initTripMap, { once: true });
    return;
  }

  const script = document.createElement('script');
  script.id = 'googleMapsApiScript';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places,geometry&callback=__initTripMap`;
  script.async = true;
  script.onerror = () => {
    mapsApiLoading = false;
    mapStatus.textContent = 'Failed to load Google Maps. Check your API key.';
    mapStatus.style.display = 'block';
    placeLookupStatus.textContent = 'Google Maps could not load. Enable Maps JavaScript API and check the API key restrictions.';
  };
  document.head.appendChild(script);
}

function restoreActivityLocationInput() {
  const restore = () => {
    activityLocationInput.disabled = false;
    activityLocationInput.classList.remove('gm-err-autocomplete');
    activityLocationInput.placeholder = 'Search a place or address';
  };
  restore();
  setTimeout(restore, 0);
}

function setupPlaceAutocomplete() {
  if (placeAutocomplete || !window.google?.maps?.places?.Autocomplete) return;
  const autocompleteOptions = {
    fields: ['name', 'formatted_address', 'address_components', 'rating', 'user_ratings_total', 'editorial_summary', 'place_id', 'types', 'geometry', 'formatted_phone_number', 'international_phone_number', 'website'],
    types: ['establishment', 'geocode'],
  };
  if (getMapProviderForDate(document.getElementById('activityDate').value) === 'naver') {
    autocompleteOptions.componentRestrictions = { country: 'kr' };
  }
  placeAutocomplete = new google.maps.places.Autocomplete(activityLocationInput, autocompleteOptions);
  placeAutocomplete.addListener('place_changed', () => {
    const place = placeAutocomplete.getPlace();
    if (!place || !place.name) return;
    clearTimeout(placeLookupTimer);
    placeLookupRequestId += 1;
    activityLocationInput.value = place.name;
    currentPlaceAddress = getKoreanGoogleAddress(place) || place.formatted_address || '';
    currentPlaceId = place.place_id || '';
    currentPlaceCoordinates = place.geometry?.location
      ? { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
      : null;
    currentGoogleReviewCount = Number(place.user_ratings_total) || 0;
    currentPlaceWebsite = place.website || '';
    activityWebsiteInput.value = currentPlaceWebsite;
    activityRatingInput.value = place.rating || '';
    activityDescriptionInput.value = currentPlaceAddress;
    activityCategoryInput.value = inferActivityCategory(place.types, activityCategoryInput.value || 'other');
    toggleFlightDetails(activityCategoryInput.value);
    toggleShoppingDetails(activityCategoryInput.value);
    toggleBookingDetails(activityCategoryInput.value);
    document.getElementById('activityContactDetails').value = place.international_phone_number || place.formatted_phone_number || '';
    placeLookupStatus.textContent = '';
  });
}

function updatePlaceAutocompleteRestrictions(date) {
  if (!placeAutocomplete?.setComponentRestrictions) return;
  const country = getMapProviderForDate(date) === 'naver' ? 'kr' : [];
  placeAutocomplete.setComponentRestrictions({ country });
}

function getKoreanGoogleAddress(place) {
  const activityDate = document.getElementById('activityDate').value;
  if (getMapProviderForDate(activityDate) !== 'naver') return '';
  const components = Array.isArray(place?.address_components) ? place.address_components : [];
  const addressOrder = [
    'administrative_area_level_1', 'administrative_area_level_2', 'locality',
    'sublocality_level_1', 'sublocality_level_2', 'sublocality_level_3',
    'route', 'street_number', 'premise', 'subpremise', 'postal_code',
  ];
  const values = components
    .filter((component) => {
      const value = component.long_name || component.short_name || '';
      return /[가-힣]/.test(value) || component.types?.some((type) => type === 'street_number' || type === 'postal_code');
    })
    .map((component, index) => ({
      value: component.long_name || component.short_name || '',
      order: Math.min(...(component.types || []).map((type) => addressOrder.indexOf(type)).filter((position) => position >= 0), addressOrder.length + index),
    }))
    .sort((first, second) => first.order - second.order)
    .map((component) => component.value)
    .filter((value) => !/^(대한민국|한국)$/.test(value));
  return [...new Set(values)].join(' ');
}

// Looks up rating and a short description for the entered location via Google Places and fills the read-only fields.
let placeLookupTimer = null;
let placeLookupTimeout = null;
let placeLookupRequestId = 0;
function lookupPlaceDetails() {
  const location = activityLocationInput.value.trim();
  const requestId = ++placeLookupRequestId;
  clearTimeout(placeLookupTimeout);

  if (!location) {
    activityRatingInput.value = '';
    activityDescriptionInput.value = '';
    currentPlaceAddress = '';
    placeLookupStatus.textContent = 'Rating and description auto-fill from Google Places once you enter a location (requires a Maps API key with Places enabled).';
    return;
  }

  const activityDate = document.getElementById('activityDate').value;
  if (!mapsApiLoaded || !placesService) {
    placeLookupStatus.textContent = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY'
      ? 'Google Places is unavailable. Your manual location, rating, and address will still be saved.'
      : 'Google Places is not configured. Your manual location, rating, and address will still be saved.';
    return;
  }

  const queryCity = getCityForDate(activityDate);
  const query = queryCity ? `${location}, ${queryCity}` : location;
  const pendingMessage = 'Looking up place details…';
  placeLookupStatus.textContent = pendingMessage;
  placeLookupTimeout = setTimeout(() => {
    if (placeLookupStatus.textContent !== pendingMessage) return;
    placeLookupStatus.textContent = 'Google Places did not respond. Check the API key website restrictions and Places API access.';
  }, 8000);

  placesService.findPlaceFromQuery(
    { query, fields: ['place_id', 'name', 'formatted_address'] },
    (results, status) => {
      if (requestId !== placeLookupRequestId || activityLocationInput.value.trim() !== location) return;
      clearTimeout(placeLookupTimeout);
      if (status === 'REQUEST_DENIED') {
        placeLookupStatus.textContent = 'Google Places access was denied. Your manual location, rating, and address will still be saved.';
        return;
      }
      if (status === 'OVER_QUERY_LIMIT') {
        placeLookupStatus.textContent = 'Google Places quota was exceeded. Check billing and API quotas in Google Cloud.';
        return;
      }
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results || !results.length) {
        placeLookupStatus.textContent = 'No matching place found on Google Places.';
        return;
      }

      locationSuggestions.innerHTML = '';
      results.slice(0, 5).forEach((result) => {
        const option = document.createElement('option');
        option.value = result.name || '';
        option.label = result.formatted_address || '';
        locationSuggestions.appendChild(option);
      });

      placeLookupTimeout = setTimeout(() => {
        if (placeLookupStatus.textContent !== pendingMessage) return;
        placeLookupStatus.textContent = 'Google Place Details did not respond. Check Places API access for this key.';
      }, 8000);
      placesService.getDetails(
        { placeId: results[0].place_id, fields: ['name', 'rating', 'user_ratings_total', 'editorial_summary', 'types', 'geometry', 'formatted_address', 'address_components', 'formatted_phone_number', 'international_phone_number', 'website'] },
        (place, detailsStatus) => {
          if (requestId !== placeLookupRequestId || activityLocationInput.value.trim() !== location) return;
          clearTimeout(placeLookupTimeout);
          if (detailsStatus === 'REQUEST_DENIED') {
            placeLookupStatus.textContent = 'Google Places details were denied. Enable Places API and check this key\'s restrictions.';
            return;
          }
          if (detailsStatus !== google.maps.places.PlacesServiceStatus.OK || !place) {
            placeLookupStatus.textContent = 'Could not load place details.';
            return;
          }

          activityLocationInput.value = place.name || results[0].name || location;
          activityRatingInput.value = place.rating || '';
          currentPlaceAddress = getKoreanGoogleAddress(place) || place.formatted_address || results[0].formatted_address || '';
          currentPlaceId = results[0].place_id || '';
          currentNaverPlaceName = place.name || results[0].name || '';
          currentPlaceCoordinates = place.geometry?.location
            ? { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
            : null;
          currentGoogleReviewCount = Number(place.user_ratings_total) || 0;
          currentPlaceWebsite = place.website || '';
          activityWebsiteInput.value = currentPlaceWebsite;
          activityDescriptionInput.value = currentPlaceAddress;
          activityCategoryInput.value = inferActivityCategory(place.types, activityCategoryInput.value || 'other');
          toggleFlightDetails(activityCategoryInput.value);
          toggleShoppingDetails(activityCategoryInput.value);
          toggleBookingDetails(activityCategoryInput.value);
          document.getElementById('activityContactDetails').value = place.international_phone_number || place.formatted_phone_number || '';
          placeLookupStatus.textContent = '';
        }
      );
    }
  );
}

activityLocationInput.addEventListener('input', () => {
  clearTimeout(placeLookupTimer);
  clearTimeout(placeLookupTimeout);
  placeLookupRequestId += 1;
  placeLookupStatus.textContent = '';
  currentPlaceAddress = '';
  currentPlaceId = '';
  currentPlaceCoordinates = null;
  currentNaverPlaceName = '';
  currentGoogleReviewCount = 0;
  currentPlaceWebsite = '';
  activityWebsiteInput.value = '';
  placeLookupTimer = setTimeout(lookupPlaceDetails, 600);
});

document.getElementById('activityDate').addEventListener('change', (event) => {
  updateActivityExpenseHint(event.target.value);
  activityMapProviderInput.value = getMapProviderForDate(event.target.value);
  updatePlaceAutocompleteRestrictions(event.target.value);
});


function clearMarkers() {
  if (activeMapProvider === 'naver') {
    markers.forEach((marker) => marker.remove());
    markers = [];
    activeActivityInfoMarker = null;
    return;
  }
  if (activityInfoWindow) activityInfoWindow.close();
  activeActivityInfoMarker = null;
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
}

function createMapSpotDetails(activity, place = null) {
  const card = document.createElement('article');
  card.className = 'map-spot-details';
  const photo = place?.photos?.[0];
  if (photo) {
    const image = document.createElement('img');
    image.className = 'map-spot-photo';
    image.src = photo.getUrl({ maxWidth: 480, maxHeight: 240 });
    image.alt = place.name || activity.location || activity.title;
    card.appendChild(image);
  }
  const body = document.createElement('div');
  body.className = 'map-spot-body';
  const title = document.createElement('strong');
  title.textContent = place?.name || activity.location || activity.title;
  const activityTitle = document.createElement('span');
  activityTitle.textContent = activity.title;
  const address = document.createElement('small');
  address.textContent = place?.formatted_address || activity.address || activity.description || '';
  body.append(title, activityTitle);
  if (address.textContent) body.appendChild(address);
  if (photo) {
    const attribution = document.createElement('small');
    attribution.className = 'map-spot-attribution';
    attribution.textContent = 'Photo from Google Places';
    body.appendChild(attribution);
  }
  card.appendChild(body);
  return card;
}

function openMapSpotDetails(marker, activity) {
  if (!activityInfoWindow) return;
  activeActivityInfoMarker = marker;
  activityInfoWindow.setContent(createMapSpotDetails(activity));
  activityInfoWindow.open({ map, anchor: marker });
  if (!placesService) return;
  const city = getCityForDate(activity.date);
  const query = city ? `${activity.location}, ${city}` : activity.location;
  placesService.findPlaceFromQuery(
    { query, fields: ['place_id'] },
    (results, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results?.[0]?.place_id) return;
      placesService.getDetails(
        { placeId: results[0].place_id, fields: ['name', 'formatted_address', 'photos'] },
        (place, detailsStatus) => {
          if (detailsStatus !== google.maps.places.PlacesServiceStatus.OK || !place || activeActivityInfoMarker !== marker) return;
          activityInfoWindow.setContent(createMapSpotDetails(activity, place));
          activityInfoWindow.open({ map, anchor: marker });
        }
      );
    }
  );
}

function placeMarker(position, color, activity, dayIndex) {
  if (activeMapProvider === 'naver') {
    const marker = L.circleMarker([position.lat, position.lng], {
      radius: 9, fillColor: color, fillOpacity: 1, color: '#fff', weight: 2,
    }).addTo(map);
    marker.bindPopup(createMapSpotDetails(activity));
    marker.bindTooltip(`Day ${dayIndex + 1} · ${activity.title}`);
    markers.push(marker);
    return;
  }
  const marker = new google.maps.Marker({
    position,
    map,
    title: `Day ${dayIndex + 1} · ${activity.title}`,
    label: {
      text: String(dayIndex + 1),
      color: '#fff',
      fontSize: '11px',
      fontWeight: '600',
    },
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#fff',
      strokeWeight: 2,
      scale: 10,
    },
  });
  marker.addListener('click', () => openMapSpotDetails(marker, activity));
  markers.push(marker);
}

function updateMapMarkers() {
  if (activeMapProvider === 'naver') {
    updateKoreaMapMarkers();
    return;
  }
  if (!map || !geocoder) return;
  clearMarkers();
  const renderToken = ++mapMarkerRenderToken;

  const days = getTripDays();
  const validDates = new Set(days);
  const locatable = state.activities.filter((activity) => activity.location && validDates.has(activity.date));

  if (!locatable.length) {
    mapStatus.textContent = state.language === 'zh'
      ? '此行程尚未新增地點。'
      : 'Add locations to your trip to see their pins here.';
    mapStatus.style.display = 'block';
    return;
  }
  mapStatus.style.display = 'none';

  const bounds = new google.maps.LatLngBounds();
  let failedCount = 0;

  locatable.forEach((activity) => {
    const dayIndex = days.indexOf(activity.date);
    const color = getDayColor(dayIndex);
    const activityCity = getCityForDate(activity.date);
    const query = activityCity ? `${activity.location}, ${activityCity}` : activity.location;
    const cached = state.geocodeCache[query];

    if (cached) {
      placeMarker(cached, color, activity, dayIndex);
      bounds.extend(cached);
      if (mapViewMode === 'day') map.fitBounds(bounds);
      return;
    }

    geocoder.geocode({ address: query }, (results, status) => {
      if (renderToken !== mapMarkerRenderToken || activeMapProvider !== 'google') return;
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location;
        const coords = { lat: loc.lat(), lng: loc.lng() };
        state.geocodeCache[query] = coords;
        saveState();
        placeMarker(coords, color, activity, dayIndex);
        bounds.extend(coords);
        if (mapViewMode === 'day') map.fitBounds(bounds);
      } else {
        failedCount += 1;
        mapStatus.textContent = `Could not locate "${query}" (${status}). Make sure the Geocoding API is enabled for your Maps key.`;
        mapStatus.style.display = 'block';
      }
    });
  });
}

async function updateKoreaMapMarkers() {
  if (!map || !window.L) return;
  clearMarkers();
  const renderToken = ++mapRenderToken;
  const days = getTripDays();
  const selectedDate = days[selectedDayIndex];
  const locatable = state.activities.filter((activity) => activity.location && activity.date === selectedDate);
  if (!locatable.length) {
    mapStatus.textContent = state.language === 'zh' ? '這一天尚未新增地點。' : 'Add a location to this day to see its pin here.';
    mapStatus.style.display = 'block';
    return;
  }
  mapStatus.style.display = 'none';
  const bounds = L.latLngBounds([]);
  let searchKoreaPlaces = null;
  if (window.itinerarySync?.isConfigured()) {
    try {
      await window.itinerarySync.authenticate();
      searchKoreaPlaces = firebase.app().functions('asia-east2').httpsCallable('searchKoreaPlaces');
    } catch (error) {
      console.error('Korea map authentication failed', error);
    }
  }
  for (const activity of locatable) {
    if (mapViewMode !== 'day' || renderToken !== mapRenderToken) return;
    const dayIndex = days.indexOf(activity.date);
    const cacheKey = `korea:${activity.address || activity.location}`;
    const activityCoordinates = Number.isFinite(activity.latitude) && Number.isFinite(activity.longitude)
      ? { lat: activity.latitude, lng: activity.longitude }
      : null;
    let cached = activityCoordinates || state.geocodeCache[cacheKey];
    const needsGoogleVerification = placesService && activity.koreaCoordinateSource !== 'google-places';
    if (!cached || !activity.naverPlaceName || needsGoogleVerification) {
      try {
        const city = getCityForDate(activity.date);
        const googleQuery = [activity.location || activity.naverPlaceName, city].filter(Boolean).join(' ');
        const googlePlace = needsGoogleVerification ? await findGoogleKoreaPlace(googleQuery) : null;
        const googleLocation = googlePlace?.geometry?.location;
        let place = null;
        if (googleLocation) {
          place = {
            latitude: googleLocation.lat(),
            longitude: googleLocation.lng(),
            address: googlePlace.formatted_address || activity.address || '',
            name: googlePlace.name || activity.location,
            naverPlaceName: googlePlace.name || activity.naverPlaceName || activity.location,
          };
          activity.placeId = googlePlace.place_id || activity.placeId || '';
          activity.rating = Number(googlePlace.rating) || activity.rating || '';
          activity.googleReviewCount = Number(googlePlace.user_ratings_total) || activity.googleReviewCount || 0;
          activity.category = inferActivityCategory(googlePlace.types, activity.category || 'other');
          activity.koreaCoordinateSource = 'google-places';
        } else if (searchKoreaPlaces) {
          const query = [activity.address || activity.location, activity.title, city].filter(Boolean).join(' ');
          const result = await searchKoreaPlaces({ query });
          place = result.data?.places?.[0];
          if (place) activity.koreaCoordinateSource = 'nominatim';
        }
        if (Number.isFinite(place?.latitude) && Number.isFinite(place?.longitude)) {
          cached = { lat: place.latitude, lng: place.longitude };
          state.geocodeCache[cacheKey] = cached;
          activity.latitude = place.latitude;
          activity.longitude = place.longitude;
          if (place.address) {
            activity.address = place.address;
            activity.description = place.address;
            state.geocodeCache[`korea:${place.address}`] = cached;
          }
          if (place.naverPlaceName || place.name) activity.naverPlaceName = place.naverPlaceName || place.name;
          if (!activity.naverUrl && place.naverUrl) activity.naverUrl = place.naverUrl;
          saveState();
        }
      } catch (error) {
        console.error('Korea map geocoding failed', error);
      }
    }
    if (mapViewMode !== 'day' || renderToken !== mapRenderToken) return;
    if (cached) {
      placeMarker(cached, getDayColor(dayIndex), activity, dayIndex);
      bounds.extend([cached.lat, cached.lng]);
    }
  }
  if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] });
  else {
    mapStatus.textContent = state.language === 'zh' ? '無法從地點名稱定位。請加入城市或更完整的地點名稱。' : 'Could not locate these place names. Add the city or a more complete place name.';
    mapStatus.style.display = 'block';
  }
}

function findGoogleKoreaPlace(query) {
  if (!placesService || !window.google?.maps?.places) return Promise.resolve(null);
  return new Promise((resolve) => {
    placesService.textSearch({ query }, (results, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results?.length) {
        resolve(null);
        return;
      }
      const nonAdministrative = results.find((place) => !(place.types || []).every((type) => [
        'locality', 'political', 'administrative_area_level_1', 'administrative_area_level_2', 'country',
      ].includes(type)));
      resolve(nonAdministrative || results[0]);
    });
  });
}

let suggestedRouteRenderer = null;
let suggestedMarkers = [];
let suggestedPolyline = null;
let currentSuggestedRoute = null;
let mapViewMode = 'day';
let mapRenderToken = 0;
let mapMarkerRenderToken = 0;

function getRouteModeStyle(mode) {
  const themeStyles = getComputedStyle(document.documentElement);
  const themeAccent = themeStyles.getPropertyValue('--theme-accent').trim() || '#2f69c7';
  const themeAccentSoft = themeStyles.getPropertyValue('--theme-accent-soft').trim() || '#cce9ff';
  return {
    DRIVING: { color: themeAccent, casingColor: themeAccentSoft, opacity: 0.96, weight: 6 },
    WALKING: { color: '#23875a', casingColor: '#d8f3e5', opacity: 0.95, weight: 5, dashArray: '4 8' },
    BICYCLING: { color: '#d17818', casingColor: '#ffedcf', opacity: 0.95, weight: 5, dashArray: '12 7' },
    TRANSIT: { color: '#2867d8', casingColor: '#dce8ff', opacity: 0.95, weight: 6 },
  }[mode] || { color: themeAccent, casingColor: themeAccentSoft, opacity: 0.96, weight: 6 };
}

function addStyledRouteLine(layer, path, mode, color = '') {
  const style = getRouteModeStyle(mode);
  const lineColor = color || style.color;
  L.polyline(path, {
    color: style.casingColor,
    opacity: 0.9,
    weight: style.weight + 5,
    lineCap: 'round',
    lineJoin: 'round',
    dashArray: style.dashArray,
  }).addTo(layer);
  return L.polyline(path, {
    color: lineColor,
    opacity: style.opacity,
    weight: style.weight,
    lineCap: 'round',
    lineJoin: 'round',
    dashArray: style.dashArray,
  }).addTo(layer);
}

function addRouteSummaryLabel(layer, path, mode, distance, duration) {
  if (!layer || !Array.isArray(path) || path.length < 2) return;
  const modeLabels = state.language === 'zh'
    ? { DRIVING: '駕車', WALKING: '步行', BICYCLING: '自行車' }
    : { DRIVING: 'Car', WALKING: 'Walk', BICYCLING: 'Bicycle' };
  const content = document.createElement('div');
  content.className = 'route-map-summary';
  const heading = document.createElement('div');
  heading.className = 'route-map-summary-heading';
  const modeDot = document.createElement('span');
  modeDot.className = 'route-map-summary-dot';
  const modeLabel = document.createElement('strong');
  modeLabel.textContent = modeLabels[mode] || mode;
  heading.append(modeDot, modeLabel);
  const metrics = document.createElement('div');
  metrics.className = 'route-map-summary-metrics';
  [[state.language === 'zh' ? '距離' : 'Distance', distance], [state.language === 'zh' ? '時間' : 'ETA', duration]].forEach(([label, value]) => {
    const metric = document.createElement('span');
    const metricLabel = document.createElement('small');
    metricLabel.textContent = label;
    const metricValue = document.createElement('b');
    metricValue.textContent = value;
    metric.append(metricLabel, metricValue);
    metrics.appendChild(metric);
  });
  content.append(heading, metrics);
  L.tooltip({
    permanent: true,
    direction: 'top',
    offset: [0, -8],
    className: `route-map-summary-label is-${mode.toLowerCase()}`,
  })
    .setLatLng(path[Math.floor(path.length / 2)])
    .setContent(content)
    .addTo(layer);
}

function addRouteEndpointMarkers(layer, start, end) {
  if (!window.L || !layer || !start || !end) return;
  const createIcon = (label, className) => L.divIcon({
    className: `route-endpoint-marker ${className}`,
    html: `<span><b>${label}</b></span>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    tooltipAnchor: [0, -22],
  });
  L.marker([start.lat, start.lng], { icon: createIcon('A', 'is-start'), zIndexOffset: 1200 }).addTo(layer);
  L.marker([end.lat, end.lng], { icon: createIcon('B', 'is-end'), zIndexOffset: 1200 }).addTo(layer);
}

function clearSuggestedRouteDisplay() {
  if (suggestedRouteRenderer) suggestedRouteRenderer.setMap(null);
  clearSuggestedGeometry();
}

function renderSpotRouteSelectors(days) {
  const selectedDate = days[selectedDayIndex];
  const spots = state.activities
    .filter((activity) => activity.date === selectedDate && activity.location)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  const previousA = spotASelect.value;
  const previousB = spotBSelect.value;
  spotASelect.innerHTML = '';
  spotBSelect.innerHTML = '';
  spots.forEach((spot) => {
    const label = spot.location;
    spotASelect.add(new Option(label, spot.id));
    spotBSelect.add(new Option(label, spot.id));
  });
  if (spots.length < 2) {
    spotASelect.disabled = true;
    spotBSelect.disabled = true;
    spotRouteStatus.textContent = state.language === 'zh' ? '需要至少兩個地點' : 'Add two locations';
    spotRouteResult.textContent = '';
    spotFareGrid.innerHTML = '';
    currentSuggestedRoute = null;
    saveSuggestedRouteBtn.disabled = true;
    return;
  }
  spotASelect.disabled = false;
  spotBSelect.disabled = false;
  spotASelect.value = spots.some((spot) => spot.id === previousA) ? previousA : spots[0].id;
  spotBSelect.value = spots.some((spot) => spot.id === previousB && spot.id !== spotASelect.value)
    ? previousB
    : spots.find((spot) => spot.id !== spotASelect.value).id;
  spotRouteStatus.textContent = mapsApiLoaded
    ? (state.language === 'zh' ? '選擇地點與交通方式以查看路線' : 'Choose spots and a travel mode to view the route')
    : 'Map API loading…';
}

function requestSuggestedRoute() {
  if (!spotASelect.value || !spotBSelect.value || spotASelect.value === spotBSelect.value) return;
  const from = state.activities.find((activity) => activity.id === spotASelect.value);
  const to = state.activities.find((activity) => activity.id === spotBSelect.value);
  if (!from || !to) return;
  if (getMapProviderForDate(from.date) === 'naver') {
    requestKoreaSuggestedRoute(from, to);
    return;
  }
  if (!directionsService) return;
  const city = getCityForDate(from.date);
  const origin = city ? `${from.location}, ${city}` : from.location;
  const destination = city ? `${to.location}, ${city}` : to.location;
  const mode = routeModeSelect.value;
  mapViewMode = 'route';
  const routeToken = ++mapRenderToken;
  clearSuggestedRouteDisplay();
  spotRouteStatus.textContent = state.language === 'zh' ? '規劃中…' : 'Planning…';
  spotRouteResult.textContent = '';
  spotFareGrid.innerHTML = '';
  currentSuggestedRoute = null;
  saveSuggestedRouteBtn.disabled = true;
  const request = { origin, destination, travelMode: google.maps.TravelMode[mode] };
  if (mode === 'TRANSIT') request.transitOptions = { departureTime: new Date() };
  directionsService.route(request, (result, status) => {
    if (mapViewMode !== 'route' || routeToken !== mapRenderToken) return;
    if (status !== 'OK' || !result.routes.length) {
      spotRouteStatus.textContent = state.language === 'zh'
        ? `找不到路線（${status}）`
        : `Route unavailable (${status})`;
      geocodeSuggestedSpots(from, to, mode, routeToken);
      return;
    }
    if (!suggestedRouteRenderer) {
      suggestedRouteRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true, preserveViewport: true });
    }
    suggestedRouteRenderer.setMap(map);
    clearSuggestedGeometry();
    suggestedRouteRenderer.setDirections(result);
    focusGoogleRoute(result.routes[0].bounds);
    const leg = result.routes[0].legs[0];
    const transitDetails = getTransitRouteDetails(leg, result.routes[0]);
    spotRouteStatus.textContent = state.language === 'zh' ? '建議路線' : 'Suggested route';
    spotRouteResult.textContent = `${leg.distance.text} · ${leg.duration.text}`;
    renderFareEstimates(Number(leg.distance.value) || 0, leg.duration.text, false, transitDetails);
    currentSuggestedRoute = buildSuggestedRoute(from, to, mode, leg.distance.text, leg.duration.text, false, leg.start_location, leg.end_location, transitDetails);
    saveSuggestedRouteBtn.disabled = false;
  });
}

async function requestKoreaSuggestedRoute(from, to) {
  const travelMode = routeModeSelect.value || 'DRIVING';
  const modeLabels = state.language === 'zh'
    ? { DRIVING: '駕車', WALKING: '步行', BICYCLING: '自行車', TRANSIT: '大眾運輸' }
    : { DRIVING: 'driving', WALKING: 'walking', BICYCLING: 'cycling', TRANSIT: 'transit' };
  const modeLabel = modeLabels[travelMode] || modeLabels.DRIVING;
  mapViewMode = 'route';
  const routeToken = ++mapRenderToken;
  clearSuggestedRouteDisplay();
  spotRouteStatus.textContent = state.language === 'zh'
    ? `正在規劃${modeLabel}路線…`
    : `Planning a ${modeLabel} route…`;
  spotRouteResult.textContent = '';
  spotFareGrid.innerHTML = '';
  currentSuggestedRoute = null;
  saveSuggestedRouteBtn.disabled = true;
  const fallbackRoutePromise = requestKoreaRoutes(
    'legs', [from, to], [{ fromId: from.id, toId: to.id }], travelMode,
  );
  if (travelMode === 'TRANSIT' && directionsService) {
    const city = getCityForDate(from.date);
    const origin = from.address || (city ? `${from.location}, ${city}` : from.location);
    const destination = to.address || (city ? `${to.location}, ${city}` : to.location);
    const departureTime = new Date(`${from.date}T${from.time || '09:00'}:00`);
    const transitResult = await new Promise((resolve) => {
      let settled = false;
      const timeout = setTimeout(() => {
        settled = true;
        resolve(null);
      }, 6000);
      directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.TRANSIT,
        transitOptions: { departureTime: departureTime > new Date() ? departureTime : new Date() },
      }, (result, status) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        resolve(status === 'OK' && result?.routes?.length ? result : null);
      });
    });
    if (mapViewMode !== 'route' || routeToken !== mapRenderToken) return;
    if (transitResult) {
      const route = transitResult.routes[0];
      const routeLeg = route.legs[0];
      const transitDetails = getTransitRouteDetails(routeLeg, route);
      suggestedPolyline = L.featureGroup().addTo(map);
      const transitBounds = L.latLngBounds([]);
      const routeStart = { lat: routeLeg.start_location.lat(), lng: routeLeg.start_location.lng() };
      const routeEnd = { lat: routeLeg.end_location.lat(), lng: routeLeg.end_location.lng() };
      addRouteEndpointMarkers(suggestedPolyline, routeStart, routeEnd);
      routeLeg.steps.forEach((step) => {
        const path = (step.path || []).map((position) => [position.lat(), position.lng()]);
        if (path.length < 2) return;
        const transitColor = step.transit?.line?.color || getRouteModeStyle('TRANSIT').color;
        const segmentLine = addStyledRouteLine(
          suggestedPolyline,
          path,
          step.transit ? 'TRANSIT' : 'WALKING',
          step.transit ? transitColor : '',
        );
        const line = step.transit?.line || {};
        const service = step.transit
          ? (line.short_name || line.name || line.vehicle?.name || 'Transit')
          : (state.language === 'zh' ? '步行' : 'Walk');
        const segmentDetails = [service, step.distance?.text, step.duration?.text].filter(Boolean).join(' · ');
        segmentLine.bindTooltip(segmentDetails, {
          permanent: true,
          direction: 'center',
          className: step.transit ? 'transit-map-line-label' : 'walking-map-line-label',
        });
        path.forEach((position) => transitBounds.extend(position));
        if (!step.transit) return;
        const departure = step.transit.departure_stop?.location;
        const arrival = step.transit.arrival_stop?.location;
        if (departure) {
          L.circleMarker([departure.lat(), departure.lng()], {
            radius: 6, color: '#fff', weight: 2, fillColor: transitColor, fillOpacity: 1,
          }).bindTooltip(step.transit.departure_stop.name || 'Board').addTo(suggestedPolyline);
        }
        if (arrival) {
          L.circleMarker([arrival.lat(), arrival.lng()], {
            radius: 6, color: transitColor, weight: 3, fillColor: '#fff', fillOpacity: 1,
          }).bindTooltip(step.transit.arrival_stop.name || 'Exit').addTo(suggestedPolyline);
        }
      });
      if (transitBounds.isValid()) map.fitBounds(transitBounds, { padding: [40, 40] });
      spotRouteStatus.textContent = state.language === 'zh' ? '建議大眾運輸路線' : 'Suggested public transport route';
      spotRouteResult.textContent = `${routeLeg.distance.text} · ${routeLeg.duration.text}`;
      renderFareEstimates(Number(routeLeg.distance.value) || 0, routeLeg.duration.text, false, transitDetails);
      currentSuggestedRoute = buildSuggestedRoute(
        from, to, travelMode, routeLeg.distance.text, routeLeg.duration.text, false,
        routeLeg.start_location, routeLeg.end_location, transitDetails,
      );
      currentSuggestedRoute.routeProvider = 'google';
      saveSuggestedRouteBtn.disabled = false;
      return;
    }
    spotRouteStatus.textContent = state.language === 'zh'
      ? '找不到即時大眾運輸資料，改用估算時間。'
      : 'Live transit details unavailable; showing an estimate.';
  }
  const result = await Promise.race([
    fallbackRoutePromise,
    new Promise((resolve) => setTimeout(() => resolve(null), travelMode === 'TRANSIT' && directionsService ? 2000 : 6000)),
  ]);
  if (mapViewMode !== 'route' || routeToken !== mapRenderToken) return;
  const leg = result?.legs?.[0];
  if (!leg) {
    const unresolved = new Set(result?.unresolvedStopIds || []);
    if (unresolved.size) {
      const names = [from, to].filter((activity) => unresolved.has(activity.id)).map((activity) => activity.location).join(', ');
      spotRouteStatus.textContent = state.language === 'zh'
        ? `無法定位：${names}。請加入城市或更完整的地點名稱。`
        : `Could not locate: ${names}. Add the city or a more complete place name.`;
    } else {
      spotRouteStatus.textContent = state.language === 'zh'
        ? `兩個地點之間沒有可用的${modeLabel}路線。`
        : `No ${modeLabel} route is available between these places.`;
    }
    mapViewMode = 'day';
    updateKoreaMapMarkers();
    return;
  }
  const distance = `${(leg.distanceMeters / 1000).toFixed(1)} km`;
  const estimatedDurationMinutes = {
    WALKING: Math.max(1, Math.round(leg.distanceMeters / 80)),
    BICYCLING: Math.max(1, Math.round(leg.distanceMeters / 250)),
    TRANSIT: Math.max(1, Math.round(leg.distanceMeters / 420) + 8),
  }[travelMode];
  const duration = `${estimatedDurationMinutes || leg.durationMinutes} min`;
  const isEstimated = travelMode !== 'DRIVING';
  const stopById = new Map((result.stops || []).map((stop) => [stop.id, stop]));
  const fromStop = stopById.get(from.id);
  const toStop = stopById.get(to.id);
  const fallbackTransitDetails = travelMode === 'TRANSIT'
    ? {
        unavailable: true,
        externalUrl: fromStop && toStop
          ? `https://map.naver.com/p/directions/${fromStop.longitude},${fromStop.latitude},${encodeURIComponent(fromStop.address || from.address || from.location)}/${toStop.longitude},${toStop.latitude},${encodeURIComponent(toStop.address || to.address || to.location)}/-/publictransit`
          : `https://map.naver.com/p/search/${encodeURIComponent(to.address || to.location)}`,
      }
    : null;
  spotRouteStatus.textContent = isEstimated
    ? (travelMode === 'TRANSIT'
        ? (state.language === 'zh' ? '沒有可驗證的大眾運輸班次' : 'No verified public transport service')
        : (state.language === 'zh' ? `${modeLabel}路徑與時間為估算值` : `Estimated ${modeLabel} path and time`))
    : (state.language === 'zh' ? `建議${modeLabel}路線` : `Suggested ${modeLabel} route`);
  spotRouteResult.textContent = fallbackTransitDetails
    ? (state.language === 'zh' ? '請在 Naver Maps 查看即時班次' : 'Check live service in Naver Maps')
    : `${modeLabel} · ${distance} · ${duration}`;
  renderFareEstimates(leg.distanceMeters, duration, false, fallbackTransitDetails);
  currentSuggestedRoute = buildSuggestedRoute(from, to, travelMode, distance, duration, isEstimated, null, null, fallbackTransitDetails);
  currentSuggestedRoute.routeProvider = 'osrm';
  if (fromStop && toStop) {
    currentSuggestedRoute.fromCoordinates = { lat: fromStop.latitude, lng: fromStop.longitude };
    currentSuggestedRoute.toCoordinates = { lat: toStop.latitude, lng: toStop.longitude };
  }
  if (activeMapProvider === 'naver' && map && Array.isArray(leg.path) && leg.path.length > 1) {
    suggestedPolyline = L.featureGroup().addTo(map);
    if (fromStop && toStop) {
      addRouteEndpointMarkers(
        suggestedPolyline,
        { lat: fromStop.latitude, lng: fromStop.longitude },
        { lat: toStop.latitude, lng: toStop.longitude },
      );
    }
    if (travelMode !== 'TRANSIT') {
      const path = leg.path.map(([longitude, latitude]) => [latitude, longitude]);
      addStyledRouteLine(suggestedPolyline, path, travelMode);
      addRouteSummaryLabel(suggestedPolyline, path, travelMode, distance, duration);
      map.fitBounds(suggestedPolyline.getBounds(), { padding: [40, 40] });
    } else if (fromStop && toStop) {
      const bounds = L.latLngBounds([
        [fromStop.latitude, fromStop.longitude],
        [toStop.latitude, toStop.longitude],
      ]);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }
  saveSuggestedRouteBtn.disabled = Boolean(fallbackTransitDetails);
}

function buildSuggestedRoute(from, to, mode, distance, duration, estimated, fromPosition = null, toPosition = null, transitDetails = null) {
  const fromCity = getCityForDate(from.date);
  const toCity = getCityForDate(to.date);
  const currency = getCurrencyForDestination(fromCity || toCity);
  return {
    id: `route-${Date.now().toString(36)}`,
    date: from.date || '',
    fromTitle: from.location || from.title,
    toTitle: to.location || to.title,
    fromLocation: from.location,
    toLocation: to.location,
    fromAddress: from.address || from.description || '',
    toAddress: to.address || to.description || '',
    fromNaverPlaceName: from.naverPlaceName || '',
    toNaverPlaceName: to.naverPlaceName || '',
    fromCity,
    toCity,
    fromCoordinates: fromPosition ? { lat: fromPosition.lat(), lng: fromPosition.lng() } : null,
    toCoordinates: toPosition ? { lat: toPosition.lat(), lng: toPosition.lng() } : null,
    mode,
    distance,
    duration,
    taxiFare: estimateTaxiFare(distance, currency),
    taxiCurrency: currency,
    transitDetails,
    estimated,
    savedAt: new Date().toISOString(),
  };
}

function getTransitRouteDetails(leg, route) {
  const segments = (leg.steps || []).map((step) => {
    if (!step.transit) {
      return {
        type: step.travel_mode || 'WALKING',
        distance: step.distance?.text || '',
        duration: step.duration?.text || '',
      };
    }
      const transit = step.transit;
      const line = transit.line || {};
      const vehicle = line.vehicle?.name || line.vehicle?.type || 'Transit';
      const service = line.short_name || line.name || vehicle;
      return {
        type: 'TRANSIT',
        service: service === vehicle ? vehicle : `${vehicle} ${service}`,
        vehicle,
        color: line.color || '#24a148',
        headsign: transit.headsign || '',
        stops: transit.num_stops || 0,
        departureStop: transit.departure_stop?.name || '',
        arrivalStop: transit.arrival_stop?.name || '',
        departureTime: transit.departure_time?.text || '',
        arrivalTime: transit.arrival_time?.text || '',
        distance: step.distance?.text || '',
        duration: step.duration?.text || '',
      };
    });

  const legs = segments.filter((segment) => segment.type === 'TRANSIT');
  if (!legs.length) return null;
  return { legs, segments, fare: route.fare?.text || leg.fare?.text || '' };
}

function createTransitDetailsElement(transitDetails) {
  const details = document.createElement('section');
  details.className = 'transit-route-details';
  const heading = document.createElement('strong');
  heading.className = 'transit-route-heading';
  heading.textContent = state.language === 'zh' ? '大眾運輸路線' : 'Public transport route';
  if (transitDetails.unavailable) {
    const message = document.createElement('p');
    message.className = 'transit-route-unavailable';
    message.textContent = state.language === 'zh'
      ? '目前的地圖供應商沒有回傳可驗證的班次，請在 Naver Maps 查看即時公車或地鐵路線。'
      : 'The map provider did not return a verified service. Check live bus or subway directions in Naver Maps.';
    const link = document.createElement('a');
    link.className = 'transit-route-external';
    link.href = transitDetails.externalUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = state.language === 'zh' ? '在 Naver Maps 查看' : 'View in Naver Maps';
    details.append(heading, message, link);
    return details;
  }
  const list = document.createElement('ol');
  list.className = 'transit-route-list';
  (transitDetails.segments || transitDetails.legs).forEach((transitLeg) => {
    const item = document.createElement('li');
    item.className = transitLeg.type === 'TRANSIT' ? 'is-transit' : 'is-walking';
    item.style.setProperty('--transit-color', transitLeg.color || '#2867d8');
    const mode = document.createElement('span');
    mode.className = 'transit-route-mode';
    mode.textContent = transitLeg.type === 'TRANSIT'
      ? (transitLeg.vehicle || 'Transit')
      : (state.language === 'zh' ? '步行' : 'Walk');
    const service = document.createElement('strong');
    service.className = 'transit-route-service';
    service.textContent = transitLeg.type === 'TRANSIT'
      ? `${transitLeg.service}${transitLeg.headsign ? ` to ${transitLeg.headsign}` : ''}`
      : [transitLeg.distance, transitLeg.duration].filter(Boolean).join(' · ');
    const stops = document.createElement('span');
    stops.className = 'transit-route-stops';
    stops.textContent = transitLeg.type === 'TRANSIT' ? `${transitLeg.stops} stops` : '';
    const timing = document.createElement('span');
    timing.className = 'transit-route-timing';
    timing.textContent = [
      [transitLeg.departureStop, transitLeg.departureTime].filter(Boolean).join(' '),
      [transitLeg.arrivalStop, transitLeg.arrivalTime].filter(Boolean).join(' '),
    ].filter(Boolean).join(' to ');
    item.append(mode, service, stops);
    if (timing.textContent) item.appendChild(timing);
    list.appendChild(item);
  });
  details.append(heading, list);
  return details;
}

function estimateTaxiFare(distance, currency) {
  const distanceValue = Number.parseFloat(String(distance).replace(',', '.')) || 0;
  const fareRules = {
    KRW: { base: 4800, perKm: 700 },
    TWD: { base: 85, perKm: 25 },
    JPY: { base: 500, perKm: 100 },
    CNY: { base: 14, perKm: 2.4 },
  };
  const rule = fareRules[currency] || { base: 4, perKm: 2.2 };
  return `${currency} ${Math.round(rule.base + distanceValue * rule.perKm).toLocaleString()}`;
}

function renderFareEstimates(distanceMeters, durationText, isEstimate, transitDetails = null) {
  const km = distanceMeters / 1000;
  const metrics = transitDetails?.unavailable ? [] : [
      ['Distance', `${km.toFixed(1)} km`],
      ['ETA', durationText],
    ];
  if (transitDetails) {
    if (transitDetails.fare) metrics.push(['Fare', transitDetails.fare]);
  } else if (routeModeSelect.value === 'DRIVING') {
    const selectedDate = getTripDays()[selectedDayIndex] || '';
    const currency = getCurrencyForDestination(getCityForDate(selectedDate));
    metrics.push([
      state.language === 'zh' ? '計程車費（估算）' : 'Taxi fare (est.)',
      estimateTaxiFare(`${km.toFixed(1)} km`, currency),
    ]);
  }
  spotFareGrid.innerHTML = '';
  spotFareGrid.dataset.metricCount = String(metrics.length);
  metrics.forEach(([label, value]) => {
    const card = document.createElement('div');
    card.className = 'spot-fare-card';
    const metricLabel = document.createElement('span');
    metricLabel.textContent = label;
    const metricValue = document.createElement('strong');
    metricValue.textContent = value;
    card.append(metricLabel, metricValue);
    spotFareGrid.appendChild(card);
  });
  if (transitDetails) spotFareGrid.appendChild(createTransitDetailsElement(transitDetails));
}

function clearSuggestedGeometry() {
  suggestedMarkers.forEach((marker) => marker.setMap(null));
  suggestedMarkers = [];
  if (suggestedPolyline) {
    if (typeof suggestedPolyline.remove === 'function') suggestedPolyline.remove();
    else suggestedPolyline.setMap(null);
    suggestedPolyline = null;
  }
}

function focusGoogleRoute(bounds) {
  if (!map || activeMapProvider !== 'google' || mapViewMode !== 'route' || !bounds) return;
  map.fitBounds(bounds, { top: 56, right: 48, bottom: 72, left: 48 });
  google.maps.event.addListenerOnce(map, 'idle', () => {
    if (mapViewMode === 'route' && map.getZoom() > 17) map.setZoom(17);
  });
}

function geocodeSuggestedSpots(from, to, mode, routeToken) {
  if (!geocoder || !map) return;
  const city = getCityForDate(from.date);
  const positions = [];
  clearSuggestedGeometry();
  [from, to].forEach((spot, index) => {
    const query = city ? `${spot.location}, ${city}` : spot.location;
    geocoder.geocode({ address: query }, (results, status) => {
      if (mapViewMode !== 'route' || routeToken !== mapRenderToken) return;
      if (status !== 'OK' || !results[0]) return;
      const position = results[0].geometry.location;
      positions[index] = position;
      if (positions.filter(Boolean).length === 2) {
        requestCoordinateRoute(positions, from, to, mode, routeToken);
      }
    });
  });
}

function requestCoordinateRoute(positions, from, to, mode, routeToken) {
  const request = {
    origin: positions[0],
    destination: positions[1],
    travelMode: google.maps.TravelMode[mode],
  };
  if (mode === 'TRANSIT') request.transitOptions = { departureTime: new Date() };
  directionsService.route(request, (result, status) => {
    if (mapViewMode !== 'route' || routeToken !== mapRenderToken) return;
    if (status === 'OK' && result.routes.length) {
      if (!suggestedRouteRenderer) suggestedRouteRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true, preserveViewport: true });
      clearSuggestedGeometry();
      suggestedRouteRenderer.setMap(map);
      suggestedRouteRenderer.setDirections(result);
      focusGoogleRoute(result.routes[0].bounds);
      const leg = result.routes[0].legs[0];
      const transitDetails = getTransitRouteDetails(leg, result.routes[0]);
      spotRouteStatus.textContent = state.language === 'zh' ? '建議路線' : 'Suggested route';
      spotRouteResult.textContent = `${leg.distance.text} · ${leg.duration.text}`;
      renderFareEstimates(Number(leg.distance.value) || 0, leg.duration.text, false, transitDetails);
      currentSuggestedRoute = buildSuggestedRoute(from, to, mode, leg.distance.text, leg.duration.text, false, leg.start_location, leg.end_location, transitDetails);
      saveSuggestedRouteBtn.disabled = false;
      return;
    }
    const distance = google.maps.geometry?.spherical?.computeDistanceBetween
      ? google.maps.geometry.spherical.computeDistanceBetween(positions[0], positions[1]) * 1.25
      : 0;
    const speed = mode === 'WALKING' ? 5 : mode === 'TRANSIT' ? 28 : 35;
    const minutes = Math.max(1, Math.round((distance / 1000 / speed) * 60));
    const duration = minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes} min`;
    suggestedPolyline = new google.maps.Polyline({ path: positions, geodesic: true, strokeColor: '#d94b73', strokeOpacity: 0.85, strokeWeight: 5, map });
    const routeBounds = new google.maps.LatLngBounds();
    positions.forEach((position) => routeBounds.extend(position));
    focusGoogleRoute(routeBounds);
    spotRouteStatus.textContent = state.language === 'zh' ? '估算路線' : 'Estimated route';
    spotRouteResult.textContent = `${(distance / 1000).toFixed(1)} km · ${duration}`;
    renderFareEstimates(distance, duration, true);
    currentSuggestedRoute = buildSuggestedRoute(from, to, mode, `${(distance / 1000).toFixed(1)} km`, duration, true, positions[0], positions[1]);
    saveSuggestedRouteBtn.disabled = false;
  });
}

spotASelect.addEventListener('change', requestSuggestedRoute);
spotBSelect.addEventListener('change', requestSuggestedRoute);

saveSuggestedRouteBtn.addEventListener('click', () => {
  if (!currentSuggestedRoute) return;
  if (!Array.isArray(state.savedRoutes)) state.savedRoutes = [];
  state.savedRoutes = [currentSuggestedRoute, ...state.savedRoutes.filter((route) => route.fromLocation !== currentSuggestedRoute.fromLocation || route.toLocation !== currentSuggestedRoute.toLocation)];
  saveState();
  renderSavedRoutes();
  spotRouteStatus.textContent = state.language === 'zh' ? '已保存路線' : 'Route saved';
});

function renderMapLegend(days) {
  mapLegend.innerHTML = '';
  days.forEach((dateStr, index) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'legend-chip';
    chip.style.setProperty('--day-color', getDayColor(index));
    chip.classList.toggle('selected', index === selectedDayIndex);
    chip.setAttribute('aria-pressed', String(index === selectedDayIndex));
    chip.addEventListener('click', () => selectDay(index));

    const label = document.createElement('span');
    label.textContent = `Day ${index + 1}`;
    chip.appendChild(label);

    mapLegend.appendChild(chip);
  });
}

// Groups every located activity by date and pairs up consecutive stops (e.g. hotel → meal) into travel legs.
function getAllRouteLegs() {
  const byDate = {};
  for (const activity of state.activities) {
    if (!activity.location) continue;
    if (!byDate[activity.date]) byDate[activity.date] = [];
    byDate[activity.date].push(activity);
  }

  const legs = [];
  for (const date of Object.keys(byDate)) {
    const dayActivities = byDate[date].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    for (let i = 0; i < dayActivities.length - 1; i++) {
      const from = dayActivities[i];
      const to = dayActivities[i + 1];
      legs.push({ key: `${from.id}->${to.id}`, from, to });
    }
  }
  return legs;
}

// Keeps state.bills in sync with the transport fees entered per route leg, adding/removing/updating as needed.
function syncRouteBills() {
  const legs = getAllRouteLegs();
  const legKeys = new Set(legs.map((leg) => leg.key));

  Object.keys(state.routeFees).forEach((key) => {
    if (!legKeys.has(key)) delete state.routeFees[key];
  });

  state.bills = state.bills.filter((bill) => !bill.id.startsWith('route-') || legKeys.has(bill.id.slice('route-'.length)));

  for (const leg of legs) {
    const fee = state.routeFees[leg.key];
    const billId = `route-${leg.key}`;
    if (!fee) continue;

    const billData = {
      id: billId,
      title: `${leg.from.title} → ${leg.to.title}`,
      date: leg.to.date,
      time: leg.to.time,
      expense: fee,
    };
    const existing = state.bills.find((bill) => bill.id === billId);
    if (existing) {
      Object.assign(existing, billData);
    } else {
      state.bills.push(billData);
    }
  }

  saveState();
}

// Fetches distance/duration between two locations via Google Directions, caching results per origin/destination/mode.
const routeDistanceCache = {};
function fetchRouteDistance(from, to, mode, infoEl) {
  if (getMapProviderForDate(from.date) === 'naver') {
    fetchKoreaRouteDistance(from, to, infoEl);
    return;
  }
  const origin = state.tripDestination ? `${from.location}, ${state.tripDestination}` : from.location;
  const destination = state.tripDestination ? `${to.location}, ${state.tripDestination}` : to.location;
  const cacheKey = `${origin}|${destination}|${mode}`;

  if (routeDistanceCache[cacheKey]) {
    infoEl.textContent = routeDistanceCache[cacheKey];
    return;
  }

  directionsService.route(
    { origin, destination, travelMode: google.maps.TravelMode[mode] },
    (result, status) => {
      if (status !== 'OK' || !result.routes.length) {
        infoEl.textContent = 'Route not found.';
        return;
      }
      const leg = result.routes[0].legs[0];
      const text = `${leg.distance.text} · ${leg.duration.text}`;
      routeDistanceCache[cacheKey] = text;
      infoEl.textContent = text;
    }
  );
}

async function fetchKoreaRouteDistance(from, to, infoEl) {
  const cacheKey = `naver|${from.id}|${to.id}|DRIVING`;
  if (routeDistanceCache[cacheKey]) {
    infoEl.textContent = routeDistanceCache[cacheKey];
    return;
  }
  const result = await requestKoreaRoutes('legs', [from, to], [{ fromId: from.id, toId: to.id }]);
  const leg = result?.legs?.[0];
  if (!leg) {
    infoEl.textContent = state.language === 'zh' ? 'Naver 路線不可用' : 'Naver route unavailable';
    return;
  }
  const text = `${(leg.distanceMeters / 1000).toFixed(1)} km · ${leg.durationMinutes} min · Naver`;
  routeDistanceCache[cacheKey] = text;
  infoEl.textContent = text;
}

// Renders the travel legs between the selected day's located items with distance/time and an editable transport fee.
function renderRoutePanel(days) {
  if (!routeList || !routeStatus) return;
  routeList.innerHTML = '';

  const selectedDate = days[selectedDayIndex];
  const dayActivities = state.activities
    .filter((a) => a.date === selectedDate && a.location)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  if (dayActivities.length < 2) {
    routeStatus.textContent = 'Add at least two items with a location on this day to see travel routes.';
    routeStatus.style.display = 'block';
    return;
  }
  routeStatus.style.display = 'none';

  const mode = routeModeSelect.value;

  for (let i = 0; i < dayActivities.length - 1; i++) {
    const from = dayActivities[i];
    const to = dayActivities[i + 1];
    const key = `${from.id}->${to.id}`;

    const row = document.createElement('div');
    row.className = 'route-row';

    const path = document.createElement('div');
    path.className = 'route-path';
    path.textContent = `${from.title} → ${to.title}`;
    row.appendChild(path);

    const info = document.createElement('div');
    info.className = 'route-info';
    const routeProvider = getMapProviderForDate(from.date);
    info.textContent = routeProvider === 'naver'
      ? (state.language === 'zh' ? '正在使用 Naver 計算…' : 'Calculating with Naver…')
      : mapsApiLoaded ? 'Calculating…' : 'Set GOOGLE_MAPS_API_KEY in js/app.js to calculate distance & time.';
    row.appendChild(info);

    const feeLabel = document.createElement('label');
    feeLabel.className = 'route-fee-label';
    feeLabel.textContent = 'Transport fee';
    const feeInput = document.createElement('input');
    feeInput.type = 'text';
    feeInput.className = 'route-fee-input';
    feeInput.placeholder = 'e.g. $10 or NT$100';
    feeInput.value = state.routeFees[key] || '';
    feeInput.addEventListener('change', () => {
      const value = feeInput.value.trim();
      if (value) {
        state.routeFees[key] = value;
      } else {
        delete state.routeFees[key];
      }
      renderExpenseList();
    });
    feeLabel.appendChild(feeInput);
    row.appendChild(feeLabel);

    routeList.appendChild(row);

    if (routeProvider === 'naver' || (mapsApiLoaded && directionsService)) {
      fetchRouteDistance(from, to, mode, info);
    }
  }
}

routeModeSelect.addEventListener('change', () => {
  routeModeButtons.forEach((button) => {
    const selected = button.dataset.routeMode === routeModeSelect.value;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  renderRoutePanel(getTripDays());
  requestSuggestedRoute();
});

routeModeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (routeModeSelect.value === button.dataset.routeMode) {
      requestSuggestedRoute();
      return;
    }
    routeModeSelect.value = button.dataset.routeMode;
    routeModeSelect.dispatchEvent(new Event('change'));
  });
});

function renderGreetingAndDaySelector(days) {
  if (!days.length) {
    greetingTitle.textContent = state.language === 'zh' ? '旅程即將開始' : 'Your trip starts soon';
    greetingSub.textContent = state.language === 'zh' ? '設定日期以開始倒數' : 'Set your trip dates to begin the countdown';
    todayDate.textContent = 'D1 · —';
    todayLocation.textContent = state.language === 'zh' ? '尚未設定目的地' : 'No destination yet';
    loadTodayWeather('', '');
    return;
  }

  const selectedDate = days[selectedDayIndex];
  const destination = getCityForDate(selectedDate) || (state.language === 'zh' ? '你的目的地' : 'your destination');
  loadTodayWeather(selectedDate, destination);
  const members = (state.members || []).filter(Boolean);
  const memberLabel = members.length > 1
    ? `${members.slice(0, -1).join(', ')} ${state.language === 'zh' ? '和' : '&'} ${members[members.length - 1]}`
    : members[0] || '';
  greetingTitle.textContent = state.language === 'zh'
    ? (memberLabel ? `${destination}，${memberLabel} 一起出發！` : `${destination}，我們來了！`)
    : (memberLabel ? `${destination}, ${memberLabel} here we come!` : `${destination}, here we come!`);
  greetingSub.textContent = formatCityDaySummaries(days, destination);

  const dayActivities = state.activities
    .filter((a) => a.date === selectedDate)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  const dateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString(state.language === 'zh' ? 'zh-TW' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
  todayDate.textContent = `D${selectedDayIndex + 1} · ${dateLabel}`;
  todayLocation.textContent = dayActivities.length
    ? dayActivities[0].location || dayActivities[0].title
    : destination;
}

function render() {
  const days = getTripDays();
  applyTranslations();
  renderTopBar();
  renderDayStrip(days);
  renderGreetingAndDaySelector(days);
  renderProfile(days);
  renderSpotRouteSelectors(days);
  renderMapLegend(days);
  if (mapsApiLoaded && mapViewMode === 'day') updateMapMarkers();

  renderItineraryForSelectedDay(days);
  renderShoppingHaul();
  renderRoutePanel(days);
  renderExpenseList();
}

function renderShoppingHaul() {
  shoppingHaulList.innerHTML = '';
  const allShoppingActivities = state.activities
    .filter((activity) => activity.category === 'shopping')
    .sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.time || '').localeCompare(b.time || ''));
  shoppingHaulActivity.innerHTML = '';
  allShoppingActivities.forEach((activity) => {
    shoppingHaulActivity.add(new Option(`${activity.location || activity.title} · ${activity.date || 'No date'}`, activity.id));
  });
  openShoppingHaulFormBtn.disabled = !allShoppingActivities.length;
  const shoppingActivities = state.activities
    .filter((activity) => activity.category === 'shopping' && Array.isArray(activity.shoppingItems) && activity.shoppingItems.length)
    .sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.time || '').localeCompare(b.time || ''));
  const items = shoppingActivities.flatMap((activity) => activity.shoppingItems.map((item) => ({ item, activity })));
  const doneCount = items.filter(({ item }) => item.done).length;
  const progress = items.length ? Math.round((doneCount / items.length) * 100) : 0;
  shoppingHaulCount.textContent = `${doneCount}/${items.length}`;
  shoppingHaulProgress.style.width = `${progress}%`;
  shoppingHaulTotal.textContent = items.length;
  shoppingHaulDone.textContent = doneCount;
  shoppingHaulRemaining.textContent = items.length - doneCount;
  shoppingHaulPercent.textContent = `${progress}%`;

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'shopping-haul-empty';
    empty.textContent = state.language === 'zh'
      ? '在活動分類選擇「購物」，即可新增目標商品。'
      : 'Create a Shopping activity to add target items here.';
    shoppingHaulList.appendChild(empty);
    return;
  }

  shoppingActivities.forEach((activity) => {
    const group = document.createElement('section');
    group.className = 'shopping-haul-group';
    const heading = document.createElement('div');
    heading.className = 'shopping-haul-group-heading';
    const shopName = document.createElement('strong');
    shopName.textContent = activity.location || activity.title;
    const shopDate = document.createElement('span');
    shopDate.textContent = activity.date || '';
    heading.append(shopName, shopDate);
    group.appendChild(heading);

    activity.shoppingItems.forEach((item) => {
      const row = document.createElement('div');
      row.className = `shopping-haul-item${item.done ? ' done' : ''}`;
      const details = document.createElement('div');
      details.className = 'shopping-haul-item-details';
      if (item.image) {
        const image = document.createElement('img');
        image.src = item.image;
        image.alt = '';
        details.appendChild(image);
      } else {
        const imagePlaceholder = document.createElement('span');
        imagePlaceholder.className = 'shopping-haul-item-image-placeholder';
        imagePlaceholder.textContent = '◎';
        details.appendChild(imagePlaceholder);
      }
      const copy = item.url ? document.createElement('a') : document.createElement('span');
      copy.className = 'shopping-haul-item-copy';
      copy.textContent = item.name;
      if (item.url) {
        copy.href = item.url;
        copy.target = '_blank';
        copy.rel = 'noopener noreferrer';
      }
      details.appendChild(copy);

      const quantityWrap = document.createElement('div');
      quantityWrap.className = 'shopping-haul-quantity';
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const decrease = document.createElement('button');
      decrease.type = 'button';
      decrease.textContent = '−';
      decrease.setAttribute('aria-label', `Decrease ${item.name} quantity`);
      decrease.disabled = quantity <= 1;
      decrease.addEventListener('click', () => {
        item.quantity = Math.max(1, quantity - 1);
        saveState();
        render();
      });
      const quantityValue = document.createElement('strong');
      quantityValue.textContent = quantity;
      const increase = document.createElement('button');
      increase.type = 'button';
      increase.textContent = '+';
      increase.setAttribute('aria-label', `Increase ${item.name} quantity`);
      increase.addEventListener('click', () => {
        item.quantity = quantity + 1;
        saveState();
        render();
      });
      quantityWrap.append(decrease, quantityValue, increase);

      const status = document.createElement('input');
      status.type = 'checkbox';
      status.className = 'shopping-haul-status-checkbox';
      status.checked = Boolean(item.done);
      status.setAttribute('aria-label', `Mark ${item.name} as collected`);
      status.addEventListener('change', () => {
        item.done = status.checked;
        saveState();
        render();
      });
      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'edit-btn shopping-haul-edit';
      editButton.textContent = 'Edit';
      editButton.setAttribute('aria-label', `Edit ${item.name}`);
      editButton.addEventListener('click', () => {
        editingShoppingItem = item;
        editingShoppingActivity = activity;
        shoppingHaulActivity.value = activity.id;
        shoppingHaulActivity.disabled = true;
        shoppingHaulName.value = item.name || '';
        shoppingHaulImage.value = item.image || '';
        shoppingHaulUrl.value = item.url || '';
        updateShoppingImagePreview(shoppingHaulImage, shoppingHaulImagePreview, shoppingHaulImageStatus);
        shoppingHaulModalTitle.textContent = 'Edit target item';
        shoppingHaulSubmitBtn.textContent = 'Save item';
        removeShoppingHaulItemBtn.classList.remove('hidden');
        shoppingHaulModal.classList.remove('hidden');
        shoppingHaulName.focus();
      });
      row.append(details, quantityWrap, status, editButton);
      group.appendChild(row);
    });
    shoppingHaulList.appendChild(group);
  });
}

shoppingHaulForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const activity = state.activities.find((item) => item.id === shoppingHaulActivity.value);
  if (!shoppingHaulName.value.trim() && shoppingHaulUrl.value.trim()) {
    await autofillProductFromUrl({
      urlInput: shoppingHaulUrl,
      nameInput: shoppingHaulName,
      imageInput: shoppingHaulImage,
      previewElement: shoppingHaulImagePreview,
      statusElement: shoppingHaulImageStatus,
      lookupType: 'haul',
    });
  }
  const name = shoppingHaulName.value.trim();
  if ((!activity && !editingShoppingActivity) || !name) return;
  const targetActivity = editingShoppingActivity || activity;
  if (editingShoppingItem) {
    editingShoppingItem.name = name;
    editingShoppingItem.image = shoppingHaulImage.value.trim();
    editingShoppingItem.url = shoppingHaulUrl.value.trim();
  } else {
    if (!Array.isArray(targetActivity.shoppingItems)) targetActivity.shoppingItems = [];
    targetActivity.shoppingItems.push({ name, image: shoppingHaulImage.value.trim(), url: shoppingHaulUrl.value.trim(), quantity: 1, total: '', done: false });
  }
  saveState();
  shoppingHaulForm.reset();
  shoppingHaulImagePreview.src = '';
  shoppingHaulImagePreview.classList.add('hidden');
  shoppingHaulImageStatus.textContent = '';
  shoppingHaulActivity.disabled = false;
  editingShoppingItem = null;
  editingShoppingActivity = null;
  removeShoppingHaulItemBtn.classList.add('hidden');
  shoppingHaulModalTitle.textContent = 'Add target item';
  shoppingHaulSubmitBtn.textContent = '+ Add item';
  shoppingHaulModal.classList.add('hidden');
  render();
});

openShoppingHaulFormBtn.addEventListener('click', () => {
  editingShoppingItem = null;
  editingShoppingActivity = null;
  shoppingHaulActivity.disabled = false;
  shoppingHaulForm.reset();
  shoppingHaulImagePreview.src = '';
  shoppingHaulImagePreview.classList.add('hidden');
  shoppingHaulImageStatus.textContent = '';
  shoppingHaulModalTitle.textContent = 'Add target item';
  shoppingHaulSubmitBtn.textContent = '+ Add item';
  removeShoppingHaulItemBtn.classList.add('hidden');
  shoppingHaulModal.classList.remove('hidden');
  shoppingHaulActivity.focus();
});

removeShoppingHaulItemBtn.addEventListener('click', () => {
  if (!editingShoppingItem || !editingShoppingActivity?.shoppingItems) return;
  editingShoppingActivity.shoppingItems = editingShoppingActivity.shoppingItems.filter((item) => item !== editingShoppingItem);
  saveState();
  shoppingHaulForm.reset();
  shoppingHaulImagePreview.src = '';
  shoppingHaulImagePreview.classList.add('hidden');
  shoppingHaulImageStatus.textContent = '';
  shoppingHaulActivity.disabled = false;
  editingShoppingItem = null;
  editingShoppingActivity = null;
  removeShoppingHaulItemBtn.classList.add('hidden');
  shoppingHaulModalTitle.textContent = 'Add target item';
  shoppingHaulSubmitBtn.textContent = '+ Add item';
  shoppingHaulModal.classList.add('hidden');
  render();
});

closeShoppingHaulFormBtn.addEventListener('click', () => shoppingHaulModal.classList.add('hidden'));
shoppingHaulModal.addEventListener('click', (event) => {
  if (event.target === shoppingHaulModal) shoppingHaulModal.classList.add('hidden');
});

function renderProfile(days) {
  const tripName = state.tripName || (state.language === 'zh' ? '我的旅程' : 'My Trip');
  const destination = state.tripDestination || (state.language === 'zh' ? '尚未設定目的地' : 'No destination yet');
  profileTripName.textContent = tripName;
  profileDestination.textContent = destination;
  profileInitials.textContent = tripName.trim().slice(0, 1).toUpperCase() || 'T';
  profileDayCount.textContent = days.length;
  profileMemberCount.textContent = (state.members || []).length;
  profileItemCount.textContent = (state.activities || []).length;
  renderTripLibrary();
  renderSavedRoutes();
}

function renderSavedRoutes() {
  renderSavedRoutePanel();
}

function getSavedRouteDate(route) {
  if (route.date) return route.date;
  const fromActivity = state.activities.find((activity) => (
    activity.location === route.fromLocation && activity.date
  ));
  return fromActivity?.date || '';
}

function getSavedRouteUrl(route, provider) {
  const originName = route.fromCity ? `${route.fromLocation}, ${route.fromCity}` : route.fromLocation;
  const destinationName = route.toCity ? `${route.toLocation}, ${route.toCity}` : route.toLocation;
  const fromActivity = state.activities.find((activity) => activity.location === route.fromLocation);
  const toActivity = state.activities.find((activity) => activity.location === route.toLocation);
  const getActivityCoordinates = (activity, fallbackName) => {
    if (Number.isFinite(activity?.latitude) && Number.isFinite(activity?.longitude)) {
      return { lat: activity.latitude, lng: activity.longitude };
    }
    return state.geocodeCache?.[`korea:${activity?.address || activity?.location}`]
      || state.geocodeCache?.[fallbackName]
      || null;
  };
  const fromCoordinates = route.fromCoordinates || getActivityCoordinates(fromActivity, originName);
  const toCoordinates = route.toCoordinates || getActivityCoordinates(toActivity, destinationName);
  const origin = encodeURIComponent(originName);
  const destination = encodeURIComponent(destinationName);
  const mode = String(route.mode || 'DRIVING').toLowerCase();

  if (provider === 'naver') {
    const from = fromCoordinates;
    const to = toCoordinates;
    const naverMode = mode === 'transit' ? 'publictransit' : mode === 'walking' ? 'walk' : 'car';
    const fromLabel = route.fromAddress || fromActivity?.address || route.fromNaverPlaceName || fromActivity?.naverPlaceName || route.fromLocation;
    const toLabel = route.toAddress || toActivity?.address || route.toNaverPlaceName || toActivity?.naverPlaceName || route.toLocation;
    if (from && to) {
      return `https://map.naver.com/p/directions/${from.lng},${from.lat},${encodeURIComponent(fromLabel)}/${to.lng},${to.lat},${encodeURIComponent(toLabel)}/-/${naverMode}`;
    }
    return `https://map.naver.com/p/search/${encodeURIComponent(toLabel || destinationName)}`;
  }
  if (provider === 'kakao') {
    const from = fromCoordinates;
    const to = toCoordinates;
    if (from && to) {
      return `https://map.kakao.com/?sX=${from.lng}&sY=${from.lat}&sName=${encodeURIComponent(route.fromLocation)}&eX=${to.lng}&eY=${to.lat}&eName=${encodeURIComponent(route.toLocation)}`;
    }
    return `https://map.kakao.com/?sName=${origin}&eName=${destination}`;
  }
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode}`;
}

function renderTripLibrary() {
  profileTripLibrary.innerHTML = '';
  (state.tripLibrary || []).forEach((trip) => {
    const tripData = trip.data || {};
    const entry = document.createElement('div');
    entry.className = `profile-trip-entry${trip.id === state.activeTripId ? ' is-current' : ''}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'profile-trip-select';
    button.disabled = trip.id === state.activeTripId;
    const tripName = document.createElement('strong');
    tripName.textContent = tripData.tripName || (state.language === 'zh' ? '未命名行程' : 'Untitled trip');
    const destination = document.createElement('span');
    destination.textContent = tripData.tripDestination || (state.language === 'zh' ? '未設定目的地' : 'No destination');
    button.append(tripName, destination);
    entry.appendChild(button);
    if (trip.id === state.activeTripId) {
      const current = document.createElement('em');
      current.textContent = t('currentTrip');
      entry.appendChild(current);
    } else {
      button.addEventListener('click', () => loadTripFromLibrary(trip.id));
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'profile-trip-remove';
      removeButton.textContent = '×';
      removeButton.title = t('removeSavedTrip');
      removeButton.setAttribute('aria-label', t('removeSavedTrip'));
      removeButton.addEventListener('click', () => removeTripFromLibrary(trip.id));
      entry.appendChild(removeButton);
    }
    profileTripLibrary.appendChild(entry);
  });
  renderSavedRoutePanel();
}

function renderSavedRoutePanel() {
  savedRoutePanel.innerHTML = '';
  if (!(state.savedRoutes || []).length) {
    const empty = document.createElement('span');
    empty.className = 'saved-route-empty';
    empty.textContent = state.language === 'zh' ? '尚未儲存路線。' : 'No saved routes yet.';
    savedRoutePanel.appendChild(empty);
    return;
  }
  const routesByDate = new Map();
  state.savedRoutes.forEach((route) => {
    const date = getSavedRouteDate(route);
    if (!routesByDate.has(date)) routesByDate.set(date, []);
    routesByDate.get(date).push(route);
  });
  [...routesByDate.entries()]
    .sort(([firstDate], [secondDate]) => secondDate.localeCompare(firstDate))
    .forEach(([date, routes]) => {
      const group = document.createElement('section');
      group.className = 'saved-route-day-group';
      const heading = document.createElement('h3');
      heading.className = 'saved-route-day-heading';
      heading.textContent = date
        ? new Date(`${date}T00:00:00`).toLocaleDateString(state.language === 'zh' ? 'zh-TW' : 'en-US', { month: 'short', day: 'numeric', weekday: 'short' })
        : (state.language === 'zh' ? '未指定日期' : 'Unscheduled');
      group.appendChild(heading);
      routes.forEach((route) => {
    const row = document.createElement('div');
    row.className = 'saved-route-row';
    const entry = document.createElement('a');
    entry.className = 'route-map-link-button';
    entry.href = getSavedRouteUrl(route, savedRoutePlatform.value);
    entry.target = '_blank';
    entry.rel = 'noopener';
    const taxiFare = route.taxiFare || estimateTaxiFare(route.distance, route.taxiCurrency || getCurrencyForDestination(route.fromCity));
    const routeTitle = document.createElement('strong');
    routeTitle.className = 'saved-route-title';
    routeTitle.textContent = `${route.fromLocation || route.fromTitle} → ${route.toLocation || route.toTitle}`;
    const routeMetrics = document.createElement('div');
    routeMetrics.className = 'saved-route-metrics';
    const metrics = [
      ['Distance', route.distance],
      ['ETA', route.duration],
    ];
    if (route.mode === 'TRANSIT' && route.transitDetails) {
      if (route.transitDetails.fare) metrics.push(['Fare', route.transitDetails.fare]);
    } else {
      metrics.push([state.language === 'zh' ? '計程車費（估算）' : 'Taxi fare (est.)', taxiFare]);
    }
    routeMetrics.dataset.metricCount = String(metrics.length);
    metrics.forEach(([label, value]) => {
      const metric = document.createElement('span');
      metric.className = 'saved-route-metric';
      const metricLabel = document.createElement('small');
      metricLabel.textContent = label;
      const metricValue = document.createElement('strong');
      metricValue.textContent = value;
      metric.append(metricLabel, metricValue);
      routeMetrics.appendChild(metric);
    });
    entry.append(routeTitle, routeMetrics);
    if (route.mode === 'TRANSIT' && route.transitDetails) entry.appendChild(createTransitDetailsElement(route.transitDetails));
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'saved-route-remove';
    removeButton.textContent = '×';
    removeButton.setAttribute('aria-label', state.language === 'zh' ? '刪除已儲存路線' : 'Remove saved route');
    removeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      state.savedRoutes = state.savedRoutes.filter((savedRoute) => savedRoute.id !== route.id);
      saveState();
      renderSavedRoutePanel();
    });
    row.append(entry, removeButton);
    group.appendChild(row);
      });
      savedRoutePanel.appendChild(group);
    });
}

savedRoutePlatform.addEventListener('change', renderSavedRoutePanel);

function loadTripFromLibrary(tripId) {
  const selected = (state.tripLibrary || []).find((trip) => trip.id === tripId);
  if (!selected) return;
  saveState();
  const tripLibrary = state.tripLibrary;
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, selected.data, { tripLibrary, activeTripId: tripId });
  saveState();
  init();
}

function removeTripFromLibrary(tripId) {
  if (!confirm(t('removeSavedTripConfirm'))) return;
  state.tripLibrary = (state.tripLibrary || []).filter((trip) => trip.id !== tripId);
  saveState();
  renderTripLibrary();
}

function getBillEntries() {
  return state.activities
    .filter((activity) => activity.expense)
    .concat(state.bills)
    .sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.time || '').localeCompare(b.time || ''));
}

function renderBillTabs() {
  const members = (state.members || []).filter(Boolean);
  const tabs = [{ key: 'all', label: state.language === 'zh' ? '全部' : 'All bills' }, ...members.map((member) => ({ key: member, label: member }))];
  if (!tabs.some((tab) => tab.key === selectedBillMember)) selectedBillMember = 'all';
  billTabs.innerHTML = '';
  tabs.forEach((tab) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `bill-tab${selectedBillMember === tab.key ? ' active' : ''}`;
    button.textContent = tab.label;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(selectedBillMember === tab.key));
    button.addEventListener('click', () => {
      selectedBillMember = tab.key;
      highlightedOwedMember = '';
      isDebtSetoffActive = false;
      renderExpenseList();
    });
    billTabs.appendChild(button);
  });
}

function populateBillMemberOptions() {
  populateMemberOptions(billMemberInput, billMemberInput.value);
  populatePayerOptions(billPaidByInput, billPaidByInput.value);
}

function populatePayerOptions(select, currentValue = '') {
  select.innerHTML = '';
  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = state.language === 'zh' ? '未選擇付款者' : 'Select payer';
  select.appendChild(emptyOption);
  (state.members || []).filter(Boolean).forEach((member) => {
    const option = document.createElement('option');
    option.value = member;
    option.textContent = member;
    select.appendChild(option);
  });
  select.value = [...select.options].some((option) => option.value === currentValue) ? currentValue : '';
}

function populateMemberOptions(select, currentValue = '') {
  select.innerHTML = '';
  const sharedOption = document.createElement('option');
  sharedOption.value = '';
  sharedOption.textContent = state.language === 'zh' ? '共同 / 所有人' : 'Shared / All members';
  select.appendChild(sharedOption);
  (state.members || []).filter(Boolean).forEach((member) => {
    const option = document.createElement('option');
    option.value = member;
    option.textContent = member;
    select.appendChild(option);
  });
  select.value = [...select.options].some((option) => option.value === currentValue) ? currentValue : '';
}

function getBillShareMembers(expense) {
  const members = (state.members || []).filter(Boolean);
  if (expense.billMember) return [expense.billMember];
  if (Array.isArray(expense.splitMembers) && expense.splitMembers.length) return expense.splitMembers;
  return members;
}

function getBillMemberAmount(expense, member) {
  const total = Number.parseFloat(String(expense.expense || '').replace(/[^0-9.]/g, ''));
  const shareMembers = getBillShareMembers(expense);
  const specificAmount = Number(expense.splitAmounts?.[member]);
  if (Number.isFinite(specificAmount) && specificAmount >= 0) return specificAmount;
  return isFinite(total) && shareMembers.length ? total / shareMembers.length : 0;
}

function getBillDebtors(expense) {
  return getBillShareMembers(expense).filter((member) => member && member !== expense.paidBy);
}

function isMemberSettlement(expense, member) {
  return Boolean(expense.settled || expense.fullySettled || (member && Array.isArray(expense.settledMembers) && expense.settledMembers.includes(member)));
}

function createSettlementLog(expense, member, kind, paidAt = new Date().toISOString()) {
  const shareMembers = getBillShareMembers(expense);
  const amount = getBillMemberAmount(expense, member);
  if (!isFinite(amount) || !shareMembers.includes(member) || !expense.paidBy || expense.paidBy === member) return null;
  const currency = getExpenseCurrency(expense.expense) || getCurrencyForDestination(getCityForDate(expense.date));
  return {
    id: `settlement-${Date.now().toString(36)}-${member}`,
    entryId: expense.id,
    from: member,
    to: expense.paidBy,
    amount: `${currency} ${amount.toFixed(2)}`,
    kind,
    paidAt,
  };
}

function setMemberSettlement(expense, member, isSettled) {
  if (!member) return;
  const settledMembers = new Set(expense.settledMembers || []);
  if (isSettled) settledMembers.add(member);
  else settledMembers.delete(member);
  expense.settledMembers = [...settledMembers];
  const debtors = getBillDebtors(expense);
  expense.fullySettled = debtors.length > 0 && debtors.every((debtor) => settledMembers.has(debtor));

  if (!Array.isArray(state.settlementLogs)) state.settlementLogs = [];
  const existingLog = state.settlementLogs.find((log) => log.entryId === expense.id && log.from === member);
  state.settlementLogs = state.settlementLogs.filter((log) => !(log.entryId === expense.id && log.from === member));
  if (!isSettled) return;
  const log = createSettlementLog(expense, member, 'member', existingLog?.paidAt);
  if (log) state.settlementLogs.unshift({ ...log, id: existingLog?.id || log.id });
}

function setAllSettlement(expense, isSettled) {
  expense.settled = isSettled;
  if (!Array.isArray(state.settlementLogs)) state.settlementLogs = [];
  state.settlementLogs = state.settlementLogs.filter((log) => !(log.entryId === expense.id && log.kind === 'all'));
  if (!isSettled) {
    const settledMembers = new Set(expense.settledMembers || []);
    const debtors = getBillDebtors(expense);
    expense.fullySettled = debtors.length > 0 && debtors.every((debtor) => settledMembers.has(debtor));
    return;
  }
  expense.fullySettled = false;
  getBillDebtors(expense).forEach((member) => {
    const log = createSettlementLog(expense, member, 'all');
    if (log) state.settlementLogs.push(log);
  });
}

function syncSettlementLogs(expenses) {
  if (!Array.isArray(state.settlementLogs)) state.settlementLogs = [];
  const entriesById = new Map(expenses.map((expense) => [expense.id, expense]));
  const previousLength = state.settlementLogs.length;
  state.settlementLogs = state.settlementLogs.filter((log) => {
    const expense = entriesById.get(log.entryId);
    if (!expense || log.to !== expense.paidBy || !getBillDebtors(expense).includes(log.from)) return false;
    return log.kind === 'all' ? Boolean(expense.settled) : Boolean(expense.settledMembers?.includes(log.from));
  });
  if (state.settlementLogs.length !== previousLength) saveState();
}

function calculateMemberOwesByCurrency(expenses) {
  const totals = new Map((state.members || []).filter(Boolean).map((member) => [member, new Map()]));
  expenses.forEach((expense) => {
    const parsed = parseFloat(String(expense.expense || '').replace(/[^0-9.]/g, ''));
    if (!isFinite(parsed)) return;
    const shareMembers = getBillShareMembers(expense).filter(Boolean);
    if (!shareMembers.length) return;
    const groupKey = getExpenseRateGroupKey(expense);
    shareMembers.forEach((member) => {
      if (isMemberSettlement(expense, member)) return;
      if (!totals.has(member)) totals.set(member, new Map());
      const memberTotals = totals.get(member);
      memberTotals.set(groupKey, (memberTotals.get(groupKey) || 0) + getBillMemberAmount(expense, member));
    });
  });
  return totals;
}

function calculateSelectedMemberOwesByCurrency(expenses, debtor) {
  const members = (state.members || []).filter((member) => member && member !== debtor);
  const totals = new Map(members.map((member) => [member, new Map()]));
  expenses.forEach((expense) => {
    if (!expense.paidBy || expense.paidBy === debtor) return;
    const parsed = parseFloat(String(expense.expense || '').replace(/[^0-9.]/g, ''));
    if (!isFinite(parsed)) return;
    const shareMembers = getBillShareMembers(expense).filter(Boolean);
    if (!shareMembers.includes(debtor) || isMemberSettlement(expense, debtor)) return;
    const groupKey = getExpenseRateGroupKey(expense);
    if (!totals.has(expense.paidBy)) totals.set(expense.paidBy, new Map());
    const payerTotals = totals.get(expense.paidBy);
    payerTotals.set(groupKey, (payerTotals.get(groupKey) || 0) + getBillMemberAmount(expense, debtor));
  });
  return totals;
}

async function convertMemberCurrencyTotals(totals) {
  const targetCurrency = currencyToInput.value;
  const convertedTotals = new Map();
  await Promise.all([...totals].map(async ([member, groupTotals]) => {
    const converted = await Promise.all([...groupTotals].map(async ([groupKey, amount]) => (
      amount * await getGroupConversionRate(groupKey, targetCurrency)
    )));
    convertedTotals.set(member, converted.reduce((sum, value) => sum + value, 0));
  }));
  return convertedTotals;
}

async function calculateMemberOwesConverted(expenses) {
  return convertMemberCurrencyTotals(calculateMemberOwesByCurrency(expenses));
}

async function calculateSelectedMemberOwesConverted(expenses, debtor) {
  return convertMemberCurrencyTotals(calculateSelectedMemberOwesByCurrency(expenses, debtor));
}

async function calculateSelectedMemberSetoff(expenses, member) {
  const members = (state.members || []).filter((otherMember) => otherMember && otherMember !== member);
  const [amountsOwed, reciprocalAmounts] = await Promise.all([
    calculateSelectedMemberOwesConverted(expenses, member),
    Promise.all(members.map(async (otherMember) => {
      const totals = await calculateSelectedMemberOwesConverted(expenses, otherMember);
      return [otherMember, totals.get(member) || 0];
    })),
  ]);
  const owedToMember = new Map(reciprocalAmounts);
  return new Map(members.map((otherMember) => [
    otherMember,
    Math.max(0, (amountsOwed.get(otherMember) || 0) - (owedToMember.get(otherMember) || 0)),
  ]));
}

function isSelectedMemberOwedPayment(expense, paidBy) {
  if (selectedBillMember === 'all') return false;
  if (!paidBy || expense.paidBy !== paidBy || expense.paidBy === selectedBillMember) return false;
  if (isMemberSettlement(expense, selectedBillMember)) return false;
  return getBillShareMembers(expense).includes(selectedBillMember);
}

function createMemberOwesRow(member, amountText, labelText = member) {
  const row = document.createElement('div');
  row.className = `member-owes-row${highlightedOwedMember === member ? ' is-active' : ''}`;
  row.setAttribute('role', 'button');
  row.tabIndex = 0;
  row.title = state.language === 'zh' ? '高亮相關付款項目' : 'Highlight related payment items';
  const name = document.createElement('span');
  name.textContent = labelText;
  const amount = document.createElement('strong');
  amount.textContent = amountText;
  row.append(name, amount);
  const toggleHighlight = () => {
    highlightedOwedMember = highlightedOwedMember === member ? '' : member;
    renderExpenseList();
  };
  row.addEventListener('click', toggleHighlight);
  row.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggleHighlight();
  });
  return row;
}

function renderMemberOwesSummary(expenses) {
  const members = (state.members || []).filter(Boolean);
  const isMemberTab = selectedBillMember !== 'all';
  if (!isMemberTab) {
    memberOwesSummary.innerHTML = '';
    memberOwesSummary.classList.add('hidden');
    return;
  }
  const summaryMembers = isMemberTab
    ? members.filter((member) => member !== selectedBillMember)
    : members;
  memberOwesSummary.innerHTML = '';
  if (!summaryMembers.length || !expenses.length) {
    memberOwesSummary.classList.add('hidden');
    return;
  }
  memberOwesSummary.classList.remove('hidden');

  const title = document.createElement('div');
  title.className = 'member-owes-title';
  title.textContent = isMemberTab
    ? (state.language === 'zh' ? `${selectedBillMember} 欠款` : `${selectedBillMember} owes`)
    : (state.language === 'zh' ? '每位成員總欠款' : 'Total owed by member');
  const heading = document.createElement('div');
  heading.className = 'member-owes-heading';
  heading.appendChild(title);

  const setoffButton = document.createElement('button');
  setoffButton.type = 'button';
  setoffButton.className = `member-owes-setoff-btn${isDebtSetoffActive ? ' active' : ''}`;
  setoffButton.textContent = state.language === 'zh' ? '債務抵銷' : 'Set off';
  setoffButton.title = state.language === 'zh' ? '計算雙方互欠後的餘額' : 'Calculate the remainder after mutual debts cancel out';
  setoffButton.setAttribute('aria-pressed', String(isDebtSetoffActive));
  setoffButton.addEventListener('click', () => {
    isDebtSetoffActive = true;
    renderExpenseList();
  });
  heading.appendChild(setoffButton);
  memberOwesSummary.appendChild(heading);

  const list = document.createElement('div');
  list.className = 'member-owes-list';
  summaryMembers.forEach((member) => {
    list.appendChild(createMemberOwesRow(member, state.language === 'zh' ? '換算中…' : 'Calculating…'));
  });
  memberOwesSummary.appendChild(list);

  const totalsPromise = isMemberTab
    ? (isDebtSetoffActive
      ? calculateSelectedMemberSetoff(expenses, selectedBillMember)
      : calculateSelectedMemberOwesConverted(expenses, selectedBillMember))
    : calculateMemberOwesConverted(expenses);
  totalsPromise.then((totals) => {
    list.innerHTML = '';
    summaryMembers.forEach((member) => {
      const amount = totals.get(member) || 0;
      list.appendChild(createMemberOwesRow(member, `${currencyToInput.value} ${amount.toFixed(2)}`));
    });
  }).catch(() => {
    list.querySelectorAll('strong').forEach((element) => {
      element.textContent = state.language === 'zh' ? '無法換算' : 'Unavailable';
    });
  });
}

function renderSettlementLog() {
  settlementLog.innerHTML = '';
  const logs = (state.settlementLogs || []).filter((log) => (
    selectedBillMember === 'all' || log.from === selectedBillMember || log.to === selectedBillMember
  ));
  settlementLog.classList.toggle('hidden', !logs.length);
  if (!logs.length) return;
  const heading = document.createElement('h4');
  heading.textContent = state.language === 'zh' ? '付款紀錄' : 'Payment activity';
  settlementLog.appendChild(heading);
  logs.forEach((log) => {
    const entry = document.createElement('div');
    entry.className = 'settlement-log-entry';
    const people = document.createElement('div');
    people.className = 'settlement-log-people';
    const from = document.createElement('strong');
    from.textContent = log.from;
    const direction = document.createElement('span');
    direction.textContent = state.language === 'zh' ? '已付款給' : 'paid';
    const to = document.createElement('strong');
    to.textContent = log.to;
    people.append(from, direction, to);
    const amount = document.createElement('strong');
    amount.className = 'settlement-log-amount';
    amount.textContent = log.amount;
    const time = document.createElement('time');
    time.dateTime = log.paidAt;
    time.textContent = new Date(log.paidAt).toLocaleDateString(state.language === 'zh' ? 'zh-TW' : 'en-US', { month: 'short', day: 'numeric' });
    entry.append(people, amount, time);
    settlementLog.appendChild(entry);
  });
}

function openSplitBillModal(id) {
  const bill = getBillEntries().find((entry) => entry.id === id);
  const members = (state.members || []).filter(Boolean);
  if (!bill || !members.length) {
    if (!members.length) alert(state.language === 'zh' ? '請先新增同行成員。' : 'Add trip members before splitting a bill.');
    return;
  }
  splittingBillId = id;
  const selectedMembers = Array.isArray(bill.splitMembers) && bill.splitMembers.length
    ? new Set(bill.splitMembers)
    : new Set(members);
  const splitModeInputs = document.querySelectorAll('input[name="splitMode"]');
  const hasSpecificAmounts = Object.keys(bill.splitAmounts || {}).length > 0;
  const serviceChargeField = document.getElementById('splitServiceChargeField');
  const serviceChargePercent = document.getElementById('splitServiceChargePercent');
  const serviceChargeTotal = document.getElementById('splitServiceChargeTotal');
  serviceChargePercent.value = bill.splitServiceChargePercent || 0;
  const updateServiceChargePreview = () => {
    const selectedAmounts = [...splitBillMemberOptions.querySelectorAll('input[type="checkbox"]:checked')]
      .map((checkbox) => [...splitBillMemberOptions.querySelectorAll('[data-split-amount]')]
        .find((input) => input.dataset.splitAmount === checkbox.value)?.value)
      .map(Number)
      .filter((amount) => isFinite(amount) && amount >= 0);
    const baseTotal = selectedAmounts.reduce((sum, amount) => sum + amount, 0);
    const percentage = Number(serviceChargePercent.value) || 0;
    const currency = getExpenseCurrency(bill.expense) || getCurrencyForDestination(getCityForDate(bill.date));
    serviceChargeTotal.textContent = `+ ${currency} ${(baseTotal * percentage / 100).toFixed(2)}`;
  };
  splitModeInputs.forEach((input) => {
    input.checked = input.value === (hasSpecificAmounts ? 'specific' : 'even');
    input.onchange = () => {
      const isSpecific = input.value === 'specific' && input.checked;
      splitBillMemberOptions.classList.toggle('is-specific', isSpecific);
      serviceChargeField.classList.toggle('is-visible', isSpecific);
      updateServiceChargePreview();
    };
  });
  splitBillMemberOptions.classList.toggle('is-specific', hasSpecificAmounts);
  serviceChargeField.classList.toggle('is-visible', hasSpecificAmounts);
  splitBillMemberOptions.innerHTML = '';
  members.forEach((member) => {
    const label = document.createElement('label');
    label.className = 'split-bill-member-option';
    const avatar = document.createElement('span');
    avatar.className = 'split-bill-member-avatar';
    avatar.textContent = member
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    avatar.setAttribute('aria-hidden', 'true');
    label.appendChild(avatar);
    const name = document.createElement('span');
    name.className = 'split-bill-member-name';
    name.textContent = member;
    label.appendChild(name);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = member;
    checkbox.checked = selectedMembers.has(member);
    label.appendChild(checkbox);
    const amount = document.createElement('input');
    amount.type = 'text';
    amount.className = 'split-bill-amount';
    amount.dataset.splitAmount = member;
    amount.min = '0';
    amount.step = '0.01';
    amount.inputMode = 'decimal';
    amount.placeholder = 'Amount';
    amount.value = bill.splitBaseAmounts?.[member] ?? bill.splitAmounts?.[member] ?? '';
    amount.disabled = !checkbox.checked;
    checkbox.addEventListener('change', () => {
      amount.disabled = !checkbox.checked;
      updateServiceChargePreview();
    });
    amount.addEventListener('input', updateServiceChargePreview);
    label.appendChild(amount);
    splitBillMemberOptions.appendChild(label);
  });
  serviceChargePercent.addEventListener('input', updateServiceChargePreview);
  updateServiceChargePreview();
  splitBillModalOverlay.classList.remove('hidden');
}

function closeSplitBillModal() {
  splitBillModalOverlay.classList.add('hidden');
  splittingBillId = null;
}

function applyBillSplit() {
  if (!splittingBillId) return;
  const bill = getBillEntries().find((entry) => entry.id === splittingBillId);
  if (!bill) return;
  const selectedMembers = [...splitBillMemberOptions.querySelectorAll('input[type="checkbox"]:checked')]
    .map((checkbox) => checkbox.value);
  const splitMode = document.querySelector('input[name="splitMode"]:checked')?.value || 'even';
  if (!selectedMembers.length) return;
  const splitAmounts = {};
  const splitBaseAmounts = {};
  let splitServiceChargePercent = 0;
  if (splitMode === 'specific') {
    selectedMembers.forEach((member) => {
      const amountInput = [...splitBillMemberOptions.querySelectorAll('[data-split-amount]')]
        .find((input) => input.dataset.splitAmount === member);
      splitBaseAmounts[member] = Number(amountInput?.value);
    });
    splitServiceChargePercent = Number(document.getElementById('splitServiceChargePercent').value) || 0;
    const baseTotal = Object.values(splitBaseAmounts).reduce((sum, amount) => sum + amount, 0);
    const serviceCharge = baseTotal * splitServiceChargePercent / 100;
    if (Object.values(splitBaseAmounts).some((amount) => !isFinite(amount) || amount < 0) || !isFinite(splitServiceChargePercent) || splitServiceChargePercent < 0) {
      alert(state.language === 'zh' ? '請輸入有效的指定金額與服務費百分比。' : 'Enter valid specific amounts and a service charge percentage.');
      return;
    }
    const evenServiceCharge = serviceCharge / selectedMembers.length;
    selectedMembers.forEach((member) => {
      splitAmounts[member] = splitBaseAmounts[member] + evenServiceCharge;
    });
    const currency = getExpenseCurrency(bill.expense) || getCurrencyForDestination(getCityForDate(bill.date));
    bill.expense = `${currency} ${(baseTotal + serviceCharge).toFixed(2)}`;
  }
  bill.splitMembers = selectedMembers;
  bill.splitAmounts = splitMode === 'specific' ? splitAmounts : {};
  bill.splitBaseAmounts = splitMode === 'specific' ? splitBaseAmounts : {};
  bill.splitServiceChargePercent = splitMode === 'specific' ? splitServiceChargePercent : 0;
  bill.settled = false;
  bill.fullySettled = false;
  bill.settledMembers = [];
  state.settlementLogs = (state.settlementLogs || []).filter((log) => log.entryId !== bill.id);
  saveState();
  closeSplitBillModal();
  renderExpenseList();
}

// Aggregates every activity's Expense field plus manually added bills into a list + total shown in the Wallet card.
function renderExpenseList() {
  syncRouteBills();
  renderWalletCard();
  expenseList.innerHTML = '';
  renderBillTabs();

  const allExpenses = getBillEntries();
  syncSettlementLogs(allExpenses);
  renderMemberOwesSummary(allExpenses);
  renderSettlementLog();
  const expenses = allExpenses.filter((expense) => (
    selectedBillMember === 'all'
    || (expense.billMember && expense.billMember === selectedBillMember)
    || (!expense.billMember
    && (!Array.isArray(expense.splitMembers)
    || !expense.splitMembers.length
    || expense.splitMembers.includes(selectedBillMember)))
  ));
  if (expenses.length === 0) {
    expenseList.classList.add('hidden');
    return;
  }
  expenseList.classList.remove('hidden');

  let total = 0;
  const totalCurrencies = new Set();
  for (const activity of expenses) {
    const row = document.createElement('div');
    row.className = 'expense-row';
    row.classList.toggle('is-settled', isMemberSettlement(activity, selectedBillMember === 'all' ? '' : selectedBillMember));
    row.classList.toggle('is-owed-highlight', isSelectedMemberOwedPayment(activity, highlightedOwedMember));

    const top = document.createElement('div');
    top.className = 'expense-row-top';

    const main = document.createElement('div');
    main.className = 'expense-row-main';

    const label = document.createElement('button');
    label.className = 'expense-row-label';
    label.type = 'button';
    const isUpfrontPayment = state.activities.some((item) => item.id === activity.id);
    label.textContent = isUpfrontPayment
      ? `${activity.upfrontPaymentTitle || activity.location || activity.title} · ${state.language === 'zh' ? '預付款' : 'Upfront'}`
      : activity.title;
    label.title = state.language === 'zh' ? '編輯支出' : 'Edit expense';
    label.addEventListener('click', () => {
      if (state.activities.some((item) => item.id === activity.id)) {
        openActivityModal(activity);
      } else {
        openExpenseModal(activity);
      }
    });
    main.appendChild(label);

    const meta = document.createElement('span');
    meta.className = 'expense-row-meta';
    const paidByText = activity.paidBy
      ? `${state.language === 'zh' ? '付款' : 'Paid by'} ${activity.paidBy}`
      : '';
    const settledText = isMemberSettlement(activity, selectedBillMember === 'all' ? '' : selectedBillMember)
      ? (state.language === 'zh' ? '已結清' : 'Settled')
      : '';
    meta.textContent = [activity.date, formatTime(activity.time), paidByText, settledText].filter(Boolean).join(' · ');
    main.appendChild(meta);

    top.appendChild(main);

    const amounts = document.createElement('div');
    amounts.className = 'expense-row-amounts';
    const actions = document.createElement('div');
    actions.className = 'expense-row-actions';

    const amount = document.createElement('span');
    amount.className = 'expense-row-amount';
    const parsed = parseFloat(String(activity.expense || '').replace(/[^0-9.]/g, ''));
    const originalCurrency = getExpenseCurrency(activity.expense) || getCurrencyForDestination(getCityForDate(activity.date));
    const isSplit = Array.isArray(activity.splitMembers) && activity.splitMembers.length > 0;
    const shareMembers = getBillShareMembers(activity);
    const isMemberShare = selectedBillMember !== 'all' && shareMembers.includes(selectedBillMember) && shareMembers.length > 1;
    const displayedAmount = selectedBillMember !== 'all' && shareMembers.includes(selectedBillMember)
      ? getBillMemberAmount(activity, selectedBillMember)
      : parsed;
    amount.textContent = (isSplit || isMemberShare) && isFinite(displayedAmount)
      ? `${originalCurrency} ${displayedAmount.toFixed(2)}`
      : activity.expense;
    amounts.appendChild(amount);

    if (isFinite(parsed)) {
      total += isFinite(displayedAmount) ? displayedAmount : 0;
      totalCurrencies.add(originalCurrency);
    }

    if (isFinite(parsed) && originalCurrency !== currencyToInput.value) {
      const converted = document.createElement('span');
      converted.className = 'expense-row-converted';
      converted.textContent = state.language === 'zh' ? '換算中…' : 'Converting…';
      amounts.appendChild(converted);
      const rateDetails = document.createElement('div');
      rateDetails.className = 'expense-row-rate-details';
      const rateNote = document.createElement('span');
      rateNote.className = 'expense-row-rate-note';
      rateDetails.appendChild(rateNote);
      actions.appendChild(rateDetails);
      getGroupConversionRate(getExpenseRateGroupKey(activity), currencyToInput.value).then((rate) => {
        converted.textContent = `≈ ${(displayedAmount * rate).toFixed(2)} ${currencyToInput.value}`;
        const cardLabel = getCardNetworkLabel(activity.cardNetwork);
        rateNote.textContent = activity.paymentMethod === 'card'
          ? `1 ${originalCurrency} ≈ ${rate.toFixed(4)} ${currencyToInput.value} · ${cardLabel} +${Number(activity.cardMarkup) || 0}% over ECB rate`
          : `1 ${originalCurrency} ≈ ${rate.toFixed(4)} ${currencyToInput.value}`;
      }).catch(() => {
        converted.textContent = state.language === 'zh' ? '無法換算' : 'Conversion unavailable';
      });
    }

    const canSplit = selectedBillMember === 'all' && !activity.billMember;
    if (canSplit) {
      const splitActions = document.createElement('div');
      splitActions.className = 'expense-row-split-actions';
      const splitButton = document.createElement('button');
      splitButton.type = 'button';
      splitButton.className = `bill-split-btn${isSplit ? ' split' : ''}`;
      splitButton.textContent = isSplit
        ? `${state.language === 'zh' ? '分攤' : 'Split'} ${activity.splitMembers.length}`
        : (state.language === 'zh' ? '分攤' : 'Split bill');
      splitButton.title = isSplit
        ? (state.language === 'zh' ? '選擇分攤成員' : 'Choose split members')
        : (state.language === 'zh' ? '選擇分攤成員' : 'Choose members to split');
      splitButton.addEventListener('click', () => openSplitBillModal(activity.id));
      splitActions.appendChild(splitButton);
      actions.appendChild(splitActions);
    }

    top.appendChild(amounts);
    row.insertBefore(top, row.firstChild);
    if (actions.childElementCount) row.appendChild(actions);
    expenseList.appendChild(row);
  }

  const totalRow = document.createElement('div');
  totalRow.className = 'expense-row expense-row-total';
  const totalLabel = document.createElement('span');
  totalLabel.textContent = totalCurrencies.size > 1 ? 'Total (mixed currencies)' : 'Total';
  totalRow.appendChild(totalLabel);

  const totalAmounts = document.createElement('div');
  totalAmounts.className = 'expense-row-amounts';
  const totalAmount = document.createElement('span');
  totalAmount.textContent = totalCurrencies.size === 1
    ? `${[...totalCurrencies][0]} ${total.toFixed(2)}`
    : '—';
  totalAmounts.appendChild(totalAmount);
  const allConvertedTotal = document.createElement('span');
  allConvertedTotal.className = 'expense-row-converted';
  allConvertedTotal.textContent = state.language === 'zh' ? '正在換算總額…' : 'Converting total…';
  totalAmounts.appendChild(allConvertedTotal);
  totalRow.appendChild(totalAmounts);
  expenseList.appendChild(totalRow);

  calculateAllBillsConvertedTotal(expenses, selectedBillMember).then((convertedTotalValue) => {
    allConvertedTotal.textContent = isFinite(convertedTotalValue)
      ? `All expenses ≈ ${convertedTotalValue.toFixed(2)} ${currencyToInput.value}`
      : (state.language === 'zh' ? '無法換算總額' : 'Total conversion unavailable');
  });
}

async function renderWalletCard() {
  const currency = currencyToInput.value || 'USD';
  const budget = Math.max(0, Number(state.walletBudget) || 0);
  budgetCurrencyLabel.textContent = currency;
  walletBudgetInput.value = budget;
  walletTotalSpent.textContent = state.language === 'zh' ? '換算中…' : 'Calculating…';
  walletBudgetLeft.textContent = `${currency} ${budget.toFixed(2)}`;

  try {
    const totalSpent = await calculateAllBillsConvertedTotal(getBillEntries(), 'all');
    if (!isFinite(totalSpent)) throw new Error('Total unavailable');
    walletTotalSpent.textContent = `${currency} ${totalSpent.toFixed(2)}`;
    walletBudgetLeft.textContent = `${currency} ${(budget - totalSpent).toFixed(2)}`;
    walletBudgetLeft.classList.toggle('is-over-budget', totalSpent > budget);
  } catch (error) {
    walletTotalSpent.textContent = state.language === 'zh' ? '無法換算' : 'Unavailable';
    walletBudgetLeft.classList.remove('is-over-budget');
  }
}

async function getExpenseConversionRate(fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return 1;
  if (fromCurrency === currencyFromInput.value && toCurrency === currencyToInput.value && isFinite(currentExchangeRate)) {
    return currentExchangeRate;
  }
  const key = `${fromCurrency}_${toCurrency}`;
  if (isFinite(expenseConversionRates[key])) return expenseConversionRates[key];
  const response = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(fromCurrency)}`);
  if (!response.ok) throw new Error('Rate lookup failed');
  const data = await response.json();
  const rate = data.rates && data.rates[toCurrency];
  if (!rate) throw new Error('Currency not found');
  expenseConversionRates[key] = rate;
  return rate;
}

// Visa/Mastercard apply their own network rate (mid-market rate plus a small markup) rather than the plain
// interbank rate, so credit card expenses store that markup and get it applied on top of the base rate here.
function getExpenseRateGroupKey(expense) {
  const currency = getExpenseCurrency(expense.expense) || getCurrencyForDestination(getCityForDate(expense.date));
  const isCard = expense.paymentMethod === 'card';
  const markup = isCard ? (Number(expense.cardMarkup) || 0) : 0;
  return `${currency}::${isCard ? 'card' : 'cash'}::${markup}`;
}

// Card networks publish rates as the ECB reference rate plus their own markup, so credit card conversions
// use the ECB rate (via the free, key-less Frankfurter API) as the base instead of the blended mid-market rate.
const ECB_CURRENCIES = new Set(['AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'EUR', 'GBP', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KRW', 'MXN', 'MYR', 'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'SEK', 'SGD', 'THB', 'TRY', 'USD', 'ZAR']);

async function getEcbBaseRate(fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return 1;
  if (!ECB_CURRENCIES.has(fromCurrency) || !ECB_CURRENCIES.has(toCurrency)) return null;
  const key = `ecb_${fromCurrency}_${toCurrency}`;
  if (isFinite(expenseConversionRates[key])) return expenseConversionRates[key];
  const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=${encodeURIComponent(fromCurrency)}&symbols=${encodeURIComponent(toCurrency)}`);
  if (!response.ok) return null;
  const data = await response.json();
  const rate = data.rates && data.rates[toCurrency];
  if (!rate) return null;
  expenseConversionRates[key] = rate;
  return rate;
}

async function getGroupConversionRate(groupKey, toCurrency) {
  const [currency, methodTag, markupStr] = groupKey.split('::');
  const markup = Number(markupStr) || 0;
  const isCard = methodTag === 'card';
  const baseRate = (isCard ? await getEcbBaseRate(currency, toCurrency) : null) ?? await getExpenseConversionRate(currency, toCurrency);
  return baseRate * (1 + markup / 100);
}

async function calculateAllBillsConvertedTotal(expenses, member) {
  const targetCurrency = currencyToInput.value;
  const totals = new Map();
  expenses.forEach((expense) => {
    const parsed = parseFloat(String(expense.expense || '').replace(/[^0-9.]/g, ''));
    if (!isFinite(parsed)) return;
    const shareMembers = getBillShareMembers(expense);
    const amount = member !== 'all' && shareMembers.includes(member)
      ? getBillMemberAmount(expense, member)
      : parsed;
    const groupKey = getExpenseRateGroupKey(expense);
    totals.set(groupKey, (totals.get(groupKey) || 0) + amount);
  });

  const converted = await Promise.all([...totals].map(async ([groupKey, amount]) => (
    amount * await getGroupConversionRate(groupKey, targetCurrency)
  )));
  return converted.reduce((sum, value) => sum + value, 0);
}

// Renders only the activities for the currently selected day, matching the day strip/slider above.
function renderItineraryForSelectedDay(days) {
  itineraryDays.innerHTML = '';

  const selectedDate = days[selectedDayIndex];

  if (!selectedDate) {
    emptyState.textContent = 'Set your trip dates to start adding activities.';
    emptyState.style.display = 'block';
    return;
  }

  const activities = state.activities
    .filter((a) => a.date === selectedDate)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  if (activities.length === 0) {
    emptyState.textContent = 'No items yet. Click "+ Add Item" to get started!';
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  const dayColor = getDayColor(selectedDayIndex);

  const dayGroup = document.createElement('div');
  dayGroup.className = 'day-group';
  dayGroup.style.setProperty('--day-color', dayColor);

  for (const activity of activities) {
    const item = document.createElement('div');
    item.className = 'activity-item';

    const timeEl = document.createElement('div');
    timeEl.className = 'activity-time';
    timeEl.textContent = formatTime(activity.time);
    item.appendChild(timeEl);

    const marker = document.createElement('div');
    marker.className = 'timeline-marker';
    const dot = document.createElement('span');
    dot.className = 'timeline-dot';
    marker.appendChild(dot);
    item.appendChild(marker);

    const itemCard = document.createElement('div');
    itemCard.className = 'item-card';

    const categoryMeta = getCategoryMeta(activity.category);
    const tagsRow = document.createElement('div');
    tagsRow.className = 'item-tags';
    const categoryTag = document.createElement('span');
    categoryTag.className = `category-tag ${categoryMeta.className}`;
    categoryTag.textContent = categoryMeta.label;
    tagsRow.appendChild(categoryTag);
    itemCard.appendChild(tagsRow);

    const titleEl = document.createElement('button');
    titleEl.type = 'button';
    titleEl.className = 'item-title item-title-button';
    titleEl.textContent = activity.title;
    titleEl.title = state.language === 'zh' ? '編輯項目' : 'Edit item';
    titleEl.addEventListener('click', () => openActivityModal(activity));
    itemCard.appendChild(titleEl);

    if (activity.location) {
      const locationEl = document.createElement('p');
      locationEl.className = 'item-location';
      locationEl.textContent = activity.location;
      itemCard.appendChild(locationEl);
    }

    if (activity.category === 'flight') {
      const flightEl = document.createElement('div');
      flightEl.className = 'flight-card-details';

      if (activity.flightNumber) {
        const airline = getAirlineFromFlightNumber(activity.flightNumber);
        flightEl.style.setProperty('--airline-brand-color', airline.brandColor);
        flightEl.style.setProperty('--airline-brand-text', airline.brandTextColor);
        flightEl.style.setProperty('--airline-brand-accent', airline.brandAccent);
        const flightHeader = document.createElement('div');
        flightHeader.className = 'flight-header';
        const numberEl = document.createElement('span');
        numberEl.className = 'flight-number';
        numberEl.textContent = activity.flightNumber;
        const airlineName = document.createElement('span');
        airlineName.className = 'flight-airline-label';
        airlineName.textContent = airline.name;
        airlineName.title = `${airline.name} (${airline.code})`;
        flightHeader.append(numberEl, airlineName);
        flightEl.appendChild(flightHeader);
      }

      const routeEl = document.createElement('div');
      routeEl.className = 'flight-route';
      const departureCode = document.createElement('span');
      departureCode.className = 'flight-route-code';
      departureCode.textContent = activity.flightDeparture || activity.location || '—';
      const routeLineStart = document.createElement('span');
      routeLineStart.className = 'flight-route-line';
      const routeIcon = document.createElement('span');
      routeIcon.className = 'flight-route-icon';
      routeIcon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2.5 1.8V22l3.5-1 3.5 1v-1.2L13 19v-5.5z"/></svg>';
      const routeLineEnd = document.createElement('span');
      routeLineEnd.className = 'flight-route-line';
      const arrivalCode = document.createElement('span');
      arrivalCode.className = 'flight-route-code flight-route-code-arrival';
      arrivalCode.textContent = activity.flightArrival || '—';
      routeEl.append(departureCode, routeLineStart, routeIcon, routeLineEnd, arrivalCode);
      flightEl.appendChild(routeEl);

      const routeTimes = document.createElement('div');
      routeTimes.className = 'flight-route-times';
      const departureClock = document.createElement('span');
      departureClock.textContent = formatTime(activity.time) || '--:--';
      const arrivalClock = document.createElement('span');
      arrivalClock.textContent = formatTime(activity.flightArrivalTime) || '--:--';
      routeTimes.append(departureClock, arrivalClock);
      flightEl.appendChild(routeTimes);

      const divider = document.createElement('div');
      divider.className = 'flight-divider';
      flightEl.appendChild(divider);

      const flightTimes = document.createElement('div');
      flightTimes.className = 'flight-times';
      const departureInfo = document.createElement('div');
      departureInfo.className = 'flight-times-col';
      const departureDate = document.createElement('strong');
      departureDate.textContent = activity.date || '—';
      const departureMeta = document.createElement('span');
      departureMeta.textContent = formatFlightMeta(activity.departureTerminal, activity.departureGate, 'Departure');
      departureInfo.append(departureDate, departureMeta);
      const arrivalInfo = document.createElement('div');
      arrivalInfo.className = 'flight-times-col flight-times-arrival';
      const arrivalDate = document.createElement('strong');
      arrivalDate.textContent = activity.flightArrivalDate || activity.date || '—';
      const arrivalMeta = document.createElement('span');
      arrivalMeta.textContent = formatFlightMeta(activity.arrivalTerminal, activity.arrivalGate, 'Arrival');
      arrivalInfo.append(arrivalDate, arrivalMeta);
      flightTimes.append(departureInfo, arrivalInfo);
      flightEl.appendChild(flightTimes);
      itemCard.appendChild(flightEl);
    }

    if (activity.category === 'shopping') {
      const shoppingCard = document.createElement('div');
      shoppingCard.className = 'shopping-card-details';
      const shoppingHeading = document.createElement('div');
      shoppingHeading.className = 'shopping-card-heading';
      shoppingHeading.textContent = `🛒 ${activity.shoppingItems?.filter((entry) => entry.done).length || 0}/${activity.shoppingItems?.length || 0} items`;
      shoppingCard.appendChild(shoppingHeading);
      (activity.shoppingItems || []).forEach((entry) => {
        const itemRow = document.createElement('div');
        itemRow.className = `shopping-card-item${entry.done ? ' done' : ''}`;
        if (entry.image) {
          const image = document.createElement('img');
          image.src = entry.image;
          image.alt = entry.name;
          itemRow.appendChild(image);
        }
        const itemName = entry.url ? document.createElement('a') : document.createElement('span');
        if (entry.url) {
          itemName.href = entry.url;
          itemName.target = '_blank';
          itemName.rel = 'noopener noreferrer';
        }
        itemName.textContent = entry.name;
        itemRow.appendChild(itemName);
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = Boolean(entry.done);
        checkbox.setAttribute('aria-label', `Mark ${entry.name} as purchased`);
        checkbox.addEventListener('click', (event) => event.stopPropagation());
        checkbox.addEventListener('change', () => {
          entry.done = checkbox.checked;
          saveState();
          render();
        });
        itemRow.appendChild(checkbox);
        shoppingCard.appendChild(itemRow);
      });
      itemCard.appendChild(shoppingCard);
    }

    if (activity.rating) {
      const ratingEl = document.createElement('p');
      ratingEl.className = 'item-rating';
      ratingEl.textContent = `${getStarString(activity.rating)} ${activity.rating}`;
      itemCard.appendChild(ratingEl);
    }

    if (activity.address) {
      const addressEl = document.createElement('p');
      addressEl.className = 'item-address';
      addressEl.textContent = activity.address;
      itemCard.appendChild(addressEl);
    }

    if (activity.bookingDetails) {
      const bookingInfo = document.createElement('div');
      bookingInfo.className = 'item-booking-reference';
      const bookingLabel = document.createElement('span');
      bookingLabel.textContent = state.language === 'zh' ? '確認碼' : 'Confirmation';
      const bookingCode = document.createElement('code');
      bookingCode.textContent = activity.bookingDetails;
      bookingInfo.append(bookingLabel, bookingCode);
      itemCard.appendChild(bookingInfo);
    }

    if (activity.remarks) {
      const remarksEl = document.createElement('div');
      remarksEl.className = 'item-remarks';
      remarksEl.textContent = activity.remarks;
      itemCard.appendChild(remarksEl);
    }

    if (activity.aiRouteNote) {
      const routeNoteEl = document.createElement('div');
      routeNoteEl.className = 'item-ai-route-note';
      routeNoteEl.textContent = activity.aiRouteNote;
      itemCard.appendChild(routeNoteEl);
    }

    if (activity.aiRecommendationNote) {
      const placeReasonEl = document.createElement('div');
      placeReasonEl.className = 'item-ai-route-note';
      placeReasonEl.textContent = activity.aiRecommendationNote;
      itemCard.appendChild(placeReasonEl);
    }

    if (activity.location || activity.contactDetails || activity.expense) {
      const footerRow = document.createElement('div');
      footerRow.className = 'item-footer-row';

      if (activity.location) {
        const activityCity = getCityForDate(selectedDate);
        const mapQuery = activity.address || (activityCity ? `${activity.location}, ${activityCity}` : activity.location);
        const activityCoordinates = Number.isFinite(activity.latitude) && Number.isFinite(activity.longitude)
          ? { lat: activity.latitude, lng: activity.longitude }
          : state.geocodeCache?.[`korea:${activity.address || activity.location}`]
            || state.geocodeCache?.[activityCity ? `${activity.location}, ${activityCity}` : activity.location];
        const mapLink = document.createElement('a');
        const isKoreaAIActivity = getMapProviderForDate(activity.date) === 'naver' && String(activity.id || '').includes('ai');
        const preferredMapProvider = isKoreaAIActivity ? 'naver' : (activity.mapProvider || getMapProviderForDate(activity.date));
        const getLinkProvider = () => isKoreaAIActivity ? 'naver' : (activity.mapProvider || preferredMapProvider);
        let mapProvider = getLinkProvider();
        mapLink.className = `item-map-link map-${mapProvider}`;
        mapLink.href = getMapUrl(mapProvider, mapQuery, activityCity, activity.location, activityCoordinates, activity.naverUrl, activity.placeId, activity.naverPlaceName);
        mapLink.target = '_blank';
        mapLink.rel = 'noopener noreferrer';
        const mapLabels = { google: 'Google Maps', naver: 'Naver Maps', kakao: 'Kakao Map' };
        const getMapLabel = (provider) => provider === 'naver' && !getNaverPlaceUrl(activity.naverUrl)
          ? 'Find on Naver'
          : mapLabels[provider];
        mapLink.textContent = getMapLabel(mapProvider);
        mapLink.addEventListener('click', () => {
          const latestCoordinates = Number.isFinite(activity.latitude) && Number.isFinite(activity.longitude)
            ? { lat: activity.latitude, lng: activity.longitude }
            : state.geocodeCache?.[`korea:${activity.address || activity.location}`]
              || state.geocodeCache?.[activityCity ? `${activity.location}, ${activityCity}` : activity.location];
          const latestQuery = activity.address || (activityCity ? `${activity.location}, ${activityCity}` : activity.location);
          mapProvider = getLinkProvider();
          mapLink.className = `item-map-link map-${mapProvider}`;
          mapLink.textContent = getMapLabel(mapProvider);
          mapLink.href = getMapUrl(mapProvider, latestQuery, activityCity, activity.location, latestCoordinates, activity.naverUrl, activity.placeId, activity.naverPlaceName);
        });
        if (mapProvider === 'naver') {
          const hasExactNaverPlace = Boolean(getNaverPlaceUrl(activity.naverUrl));
          mapLink.title = hasExactNaverPlace
            ? (state.language === 'zh' ? '在 Naver Maps 開啟地點詳情' : 'Open place details in Naver Maps')
            : (state.language === 'zh' ? '在 Naver Maps 選擇相符地點' : 'Choose the matching place in Naver Maps');
        }
        footerRow.appendChild(mapLink);
      }

      if (activity.contactDetails) {
        const contactLink = document.createElement('a');
        contactLink.className = 'item-contact-pill';
        contactLink.href = `tel:${activity.contactDetails.replace(/[^+\d]/g, '')}`;
        contactLink.textContent = activity.contactDetails;
        footerRow.appendChild(contactLink);
      }

      if (/^https?:\/\//i.test(activity.website || '')) {
        const websiteLink = document.createElement('a');
        websiteLink.className = 'item-contact-pill item-website-pill';
        websiteLink.href = activity.website;
        websiteLink.target = '_blank';
        websiteLink.rel = 'noopener noreferrer';
        websiteLink.textContent = 'Website';
        footerRow.appendChild(websiteLink);
      }

      if (activity.expense) {
        const expenseEl = document.createElement('span');
        expenseEl.className = 'expense-badge';
        expenseEl.textContent = `${state.language === 'zh' ? '預付款' : 'Upfront'} · ${formatActivityExpense(activity.expense, selectedDate)}`;
        footerRow.appendChild(expenseEl);
      }

      itemCard.appendChild(footerRow);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.title = 'Delete item';
    deleteBtn.addEventListener('click', () => deleteActivity(activity.id));
    itemCard.appendChild(deleteBtn);

    item.appendChild(itemCard);
    dayGroup.appendChild(item);
  }

  itineraryDays.appendChild(dayGroup);
}

// Maps a stored category value to a display label and tag color class.
const CATEGORY_META = {
  flight: { label: 'Flight', className: 'cat-flight' },
  sight: { label: 'Sightseeing', className: 'cat-sight' },
  meal: { label: 'Meal', className: 'cat-meal' },
  transport: { label: 'Transport', className: 'cat-transport' },
  hotel: { label: 'Hotel', className: 'cat-hotel' },
  shopping: { label: 'Shopping', className: 'cat-shopping' },
  other: { label: 'Other', className: 'cat-other' },
};

const AIRLINES_BY_IATA_CODE = {
  UO: 'HK Express',
  BR: 'EVA Air',
  CI: 'China Airlines',
  CX: 'Cathay Pacific',
  KA: 'Cathay Dragon',
  KE: 'Korean Air',
  OZ: 'Asiana Airlines',
  '7C': 'Jeju Air',
  LJ: 'Jin Air',
  TW: 'Tway Air',
  ZE: 'Eastar Jet',
  RS: 'Air Seoul',
  JL: 'Japan Airlines',
  NH: 'ANA',
  MM: 'Peach Aviation',
  GK: 'Jetstar Japan',
  BC: 'Skymark Airlines',
  UA: 'United Airlines',
  AA: 'American Airlines',
  DL: 'Delta Air Lines',
  BA: 'British Airways',
  AF: 'Air France',
  LH: 'Lufthansa',
  SQ: 'Singapore Airlines',
  TG: 'Thai Airways',
  QF: 'Qantas',
  EK: 'Emirates',
  QR: 'Qatar Airways',
  TK: 'Turkish Airlines',
  AC: 'Air Canada',
  NZ: 'Air New Zealand',
};

const AIRLINE_BRAND_COLORS = {
  UO: ['#702283', '#ffffff', '#00a9d6'],
  BR: ['#006747', '#ffffff'],
  CI: ['#005bac', '#ffffff'],
  CX: ['#006564', '#ffffff'],
  KA: ['#006564', '#ffffff'],
  KE: ['#00205b', '#ffffff'],
  OZ: ['#c8102e', '#ffffff'],
  '7C': ['#e87511', '#ffffff'],
  LJ: ['#e60012', '#ffffff'],
  TW: ['#e60012', '#ffffff'],
  ZE: ['#f15a29', '#ffffff'],
  RS: ['#e60012', '#ffffff'],
  JL: ['#d71920', '#ffffff'],
  NH: ['#005bac', '#ffffff'],
  MM: ['#d8438a', '#ffffff'],
  GK: ['#ed1c24', '#ffffff'],
  BC: ['#174694', '#ffffff'],
  UA: ['#002244', '#ffffff'],
  AA: ['#0078d2', '#ffffff'],
  DL: ['#c8102e', '#ffffff'],
  BA: ['#1b3d79', '#ffffff'],
  AF: ['#163b70', '#ffffff'],
  LH: ['#05164d', '#ffffff'],
  SQ: ['#f9b233', '#163d88'],
  TG: ['#5e2a84', '#ffffff'],
  QF: ['#d71920', '#ffffff'],
  EK: ['#d71920', '#ffffff'],
  QR: ['#5c0632', '#ffffff'],
  TK: ['#c8102e', '#ffffff'],
  AC: ['#d8292f', '#ffffff'],
  NZ: ['#111111', '#ffffff'],
};

function getAirlineFromFlightNumber(flightNumber) {
  const value = String(flightNumber || '').trim().toUpperCase();
  const code = value.match(/^[A-Z0-9]{2}/)?.[0] || '';
  const [brandColor, brandTextColor, brandAccent] = AIRLINE_BRAND_COLORS[code] || ['var(--theme-accent)', 'var(--theme-surface)', 'var(--theme-accent)'];
  return {
    code: code || '✈',
    name: AIRLINES_BY_IATA_CODE[code] || (code ? `${code} airline` : 'Airline'),
    brandColor,
    brandTextColor,
    brandAccent,
  };
}

function formatFlightDateTime(date, time) {
  if (!date && !time) return '—';
  return [date, formatTime(time)].filter(Boolean).join(' · ');
}

function formatFlightMeta(terminal, gate, label) {
  const details = [terminal && `Terminal ${terminal}`, gate && `Gate ${gate}`].filter(Boolean).join(' · ');
  return details || label;
}

function getLegacyNaverSearchName(naverUrl) {
  if (!naverUrl) return '';
  try {
    const url = new URL(naverUrl);
    const match = url.pathname.match(/\/search\/([^/]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  } catch (error) {
    return '';
  }
}

function getNaverPlaceUrl(naverUrl) {
  if (!naverUrl) return '';
  try {
    const url = new URL(naverUrl);
    const isNaverHost = url.hostname === 'naver.com' || url.hostname.endsWith('.naver.com');
    return isNaverHost && /\/(?:entry\/)?place\/\d+/.test(url.pathname) ? url.href : '';
  } catch (error) {
    return '';
  }
}

function getNaverSearchQuery(location, address, naverPlaceName = '') {
  const officialName = [naverPlaceName, location].find((value) => /[가-힣]/.test(value || '')) || '';
  const addressParts = String(address || '')
    .split(',')
    .map((part) => part.trim())
    .filter((part) => /[가-힣]/.test(part) || /^\d+(?:-\d+)?$/.test(part))
    .filter((part) => !/^(대한민국|한국|남한|남조선|특별자치도)$/.test(part));
  const compactAddress = [...new Set(addressParts)].join(' ');
  return [officialName, compactAddress]
    .filter((value, index, values) => value && values.indexOf(value) === index)
    .join(' ')
    || location
    || address;
}

function getMapUrl(provider, query, city = '', location = '', coordinates = null, naverUrl = '', placeId = '', naverPlaceName = '') {
  const encodedQuery = encodeURIComponent(query);
  if (provider === 'naver') {
    const exactPlaceUrl = getNaverPlaceUrl(naverUrl);
    if (exactPlaceUrl) return exactPlaceUrl;
    const legacySearchName = getLegacyNaverSearchName(naverUrl);
    const legacyPlaceName = legacySearchName && !legacySearchName.includes(',') ? legacySearchName : '';
    const officialPlaceName = naverPlaceName || (/[가-힣]/.test(location) ? location : '') || legacyPlaceName;
    const naverQuery = officialPlaceName || getNaverSearchQuery(location, query, officialPlaceName)
      || (location && city ? `${location}, ${city}` : location);
    const encodedNaverQuery = encodeURIComponent(naverQuery);
    const center = Number.isFinite(coordinates?.lat) && Number.isFinite(coordinates?.lng)
      ? `?c=${coordinates.lng},${coordinates.lat},17,0,0,0,dh`
      : '';
    return `https://map.naver.com/p/search/${encodedNaverQuery}${center}`;
  }
  if (provider === 'kakao') return `https://map.kakao.com/?q=${encodedQuery}`;
  const placeIdQuery = placeId ? `&query_place_id=${encodeURIComponent(placeId)}` : '';
  return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}${placeIdQuery}`;
}

function getCategoryMeta(category) {
  return CATEGORY_META[category] || CATEGORY_META.other;
}

// Renders a 5-star string (filled/half/empty) for a numeric rating like 4.5.
function getStarString(rating) {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));
  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

// Fetches the live From -> To rate from a free, key-less exchange rate API and refreshes the conversion.
async function fetchLiveExchangeRate() {
  const fromCurrency = currencyFromInput.value;
  const toCurrency = currencyToInput.value;

  if (fromCurrency === toCurrency) {
    currentExchangeRate = 1;
    currencyRateStatus.textContent = `1 ${fromCurrency} = 1 ${toCurrency}`;
    updateCurrencyResult();
    return;
  }

  currencyRateStatus.textContent = 'Fetching live rate…';
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(fromCurrency)}`);
    if (!res.ok) throw new Error('Rate lookup failed');
    const data = await res.json();
    if (data.result !== 'success') throw new Error('Rate lookup failed');
    const rate = data.rates && data.rates[toCurrency];
    if (!rate) throw new Error('Currency not found');
    currentExchangeRate = rate;
    const rateDate = new Date(data.time_last_update_utc);
    const formattedDate = `${rateDate.getFullYear()}/${rateDate.getMonth() + 1}/${rateDate.getDate()}`;
    currencyRateStatus.textContent = `1 ${fromCurrency} ≈ ${rate} ${toCurrency} · Updated ${formattedDate}`;
  } catch (e) {
    currentExchangeRate = null;
    currencyRateStatus.textContent = 'Could not fetch live rate. Please try again later.';
  }
  updateCurrencyResult();
}

function updateCurrencyResult() {
  const amount = parseFloat(currencyAmountInput.value);
  if (!isFinite(currentExchangeRate) || !isFinite(amount)) {
    currencyResult.textContent = '0';
  } else {
    currencyResult.textContent = (currentExchangeRate * amount).toFixed(2);
  }
  renderExpenseList();
}

walletBudgetInput.addEventListener('input', () => {
  state.walletBudget = Math.max(0, Number(walletBudgetInput.value) || 0);
  saveState();
  renderWalletCard();
});

const DESTINATION_CURRENCIES = [
  { currency: 'KRW', keywords: ['korea', 'seoul', 'busan', 'jeju'] },
  { currency: 'JPY', keywords: ['japan', 'tokyo', 'osaka', 'kyoto'] },
  { currency: 'CNY', keywords: ['china', 'beijing', 'shanghai'] },
  { currency: 'TWD', keywords: ['taiwan', 'taipei'] },
  { currency: 'THB', keywords: ['thailand', 'bangkok', 'phuket'] },
  { currency: 'VND', keywords: ['vietnam', 'hanoi', 'saigon', 'ho chi minh'] },
  { currency: 'SGD', keywords: ['singapore'] },
  { currency: 'MYR', keywords: ['malaysia', 'kuala lumpur', 'penang'] },
  { currency: 'PHP', keywords: ['philippines', 'manila', 'cebu'] },
  { currency: 'IDR', keywords: ['indonesia', 'bali', 'jakarta'] },
  { currency: 'INR', keywords: ['india', 'delhi', 'mumbai'] },
  { currency: 'GBP', keywords: ['united kingdom', 'uk', 'england', 'london'] },
  { currency: 'EUR', keywords: ['italy', 'rome', 'france', 'paris', 'germany', 'berlin', 'spain', 'madrid'] },
  { currency: 'AUD', keywords: ['australia', 'sydney', 'melbourne'] },
  { currency: 'CAD', keywords: ['canada', 'toronto', 'vancouver'] },
  { currency: 'USD', keywords: ['united states', 'usa', 'america', 'new york', 'los angeles'] },
];

function getCurrencyForDestination(destination) {
  const value = (destination || '').toLowerCase();
  const match = DESTINATION_CURRENCIES.find((entry) => entry.keywords.some((keyword) => value.includes(keyword)));
  return match?.currency || 'USD';
}

function getExpenseCurrency(expense) {
  const match = String(expense || '').toUpperCase().match(/\b[A-Z]{3}\b/);
  return match ? match[0] : '';
}

function getExpenseNumber(expense) {
  const match = String(expense || '').replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  return match ? match[0] : '';
}

function normalizeExpenseValue(expense, currency) {
  const number = getExpenseNumber(expense);
  return number ? `${currency} ${number}` : String(expense || '').trim();
}

function populateExpenseCurrencyOptions(select, selectedCurrency) {
  select.innerHTML = currencyFromInput.innerHTML;
  select.value = [...select.options].some((option) => option.value === selectedCurrency)
    ? selectedCurrency
    : 'USD';
}

function formatActivityExpense(expense, date) {
  const value = String(expense || '').trim();
  if (!value || !/^[0-9]+(?:[.,][0-9]+)?$/.test(value)) return value;
  return `${getCurrencyForDestination(getCityForDate(date))} ${value.replace(',', '.')}`;
}

function setDefaultWalletCurrencies(destination) {
  if (!currencyFromInput.options.length) return;
  currencyFromInput.value = getCurrencyForDestination(destination);
  currencyToInput.value = state.walletTargetCurrency || 'HKD';
  // Drop cached rates so a destination change always re-fetches the latest ECB/mid-market rate.
  Object.keys(expenseConversionRates).forEach((key) => delete expenseConversionRates[key]);
  fetchLiveExchangeRate();
}

function populateCurrencyOptions() {
  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' },
    { code: 'CNY', symbol: '¥' },
    { code: 'HKD', symbol: '$' },
    { code: 'TWD', symbol: '$' },
    { code: 'KRW', symbol: '₩' },
    { code: 'THB', symbol: '฿' },
    { code: 'SGD', symbol: '$' },
    { code: 'AUD', symbol: '$' },
    { code: 'CAD', symbol: '$' },
    { code: 'CHF', symbol: 'Fr' },
    { code: 'NZD', symbol: '$' },
    { code: 'VND', symbol: '₫' },
    { code: 'IDR', symbol: 'Rp' },
    { code: 'MYR', symbol: 'RM' },
    { code: 'PHP', symbol: '₱' },
    { code: 'INR', symbol: '₹' },
    { code: 'MOP', symbol: '$' },
  ];
  const optionsHtml = currencies
    .map(({ code, symbol }) => `<option value="${code}">${code} ${symbol}</option>`)
    .join('');
  currencyFromInput.innerHTML = optionsHtml;
  currencyToInput.innerHTML = optionsHtml;
  targetCurrencySelect.innerHTML = optionsHtml;
  targetCurrencySelect.value = state.walletTargetCurrency || 'HKD';
  setDefaultWalletCurrencies(state.tripDestination);
}

populateCurrencyOptions();
fetchLiveExchangeRate();

currencyFromInput.addEventListener('change', fetchLiveExchangeRate);
currencyToInput.addEventListener('change', () => {
  state.walletTargetCurrency = currencyToInput.value;
  targetCurrencySelect.value = currencyToInput.value;
  saveState();
  fetchLiveExchangeRate();
});
currencyAmountInput.addEventListener('input', updateCurrencyResult);

targetCurrencySelect.addEventListener('change', () => {
  state.walletTargetCurrency = targetCurrencySelect.value;
  currencyToInput.value = targetCurrencySelect.value;
  saveState();
  fetchLiveExchangeRate();
});

currencySwapBtn.addEventListener('click', () => {
  const fromValue = currencyFromInput.value;
  currencyFromInput.value = currencyToInput.value;
  currencyToInput.value = fromValue;
  state.walletTargetCurrency = currencyToInput.value;
  targetCurrencySelect.value = currencyToInput.value;
  saveState();
  fetchLiveExchangeRate();
});

addExpenseBtn.addEventListener('click', () => {
  openExpenseModal();
});

closeExpenseModalBtn.addEventListener('click', () => {
  closeExpenseModal();
});

closeSplitBillModalBtn.addEventListener('click', closeSplitBillModal);
cancelSplitBillBtn.addEventListener('click', closeSplitBillModal);
applySplitBillBtn.addEventListener('click', applyBillSplit);

splitBillModalOverlay.addEventListener('click', (event) => {
  if (event.target === splitBillModalOverlay) closeSplitBillModal();
});

expenseModalOverlay.addEventListener('click', (e) => {
  if (e.target === expenseModalOverlay) e.stopPropagation();
});

function openExpenseModal() {
  const bill = arguments[0] || null;
  editingBillId = bill?.id || null;
  expenseForm.reset();
  populateBillMemberOptions();
  populatePayerOptions(billPaidByInput, bill?.paidBy || '');
  populateExpenseCurrencyOptions(billExpenseCurrencyInput, getExpenseCurrency(bill?.expense) || getCurrencyForDestination(getCityForDate(bill?.date || getTripDays()[selectedDayIndex])));
  document.getElementById('expenseModalTitle').textContent = editingBillId ? (state.language === 'zh' ? '編輯支出' : 'Edit Expense') : 'Add Expense';
  document.getElementById('expenseSubmitBtn').textContent = editingBillId ? (state.language === 'zh' ? '儲存變更' : 'Save Changes') : 'Add Expense';
  removeExpenseBtn.classList.toggle('hidden', !editingBillId);
  const days = getTripDays();
  const selectedDate = days[selectedDayIndex];
  if (bill) {
    document.getElementById('billTitle').value = bill.title || '';
    document.getElementById('billDate').value = bill.date || '';
    document.getElementById('billTime').value = bill.time || '';
    document.getElementById('billAmount').value = getExpenseNumber(bill.expense);
    billPaidByInput.value = bill.paidBy || '';
    billSettledInput.checked = isMemberSettlement(bill, selectedBillMember === 'all' ? '' : selectedBillMember);
    populateMemberOptions(billMemberInput, bill.billMember || '');
    billPaymentMethodInput.value = bill.paymentMethod || 'cash';
    billCardNetworkInput.value = bill.cardNetwork || 'visa';
    billCardMarkupInput.value = bill.cardMarkup !== '' && isFinite(bill.cardMarkup)
      ? bill.cardMarkup
      : getCardMarkupForNetwork(billCardNetworkInput.value);
  } else if (selectedDate) {
    billSettledInput.checked = false;
    document.getElementById('billDate').value = selectedDate;
  }
  toggleCardFields(billPaymentMethodInput, billCardNetworkField, billCardMarkupField, billCardRateHint);
  expenseModalOverlay.classList.remove('hidden');
}

function closeExpenseModal() {
  expenseModalOverlay.classList.add('hidden');
  removeExpenseBtn.classList.add('hidden');
}

removeExpenseBtn.addEventListener('click', () => {
  if (!editingBillId) return;
  const message = state.language === 'zh' ? '確定要移除此支出嗎？' : 'Remove this expense?';
  if (!confirm(message)) return;
  state.bills = state.bills.filter((bill) => bill.id !== editingBillId);
  state.settlementLogs = (state.settlementLogs || []).filter((log) => log.entryId !== editingBillId);
  saveState();
  editingBillId = null;
  closeExpenseModal();
  renderExpenseList();
});

expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('billTitle').value.trim();
  const date = document.getElementById('billDate').value;
  const time = document.getElementById('billTime').value;
  const amount = normalizeExpenseValue(document.getElementById('billAmount').value.trim(), billExpenseCurrencyInput.value);

  if (!title || !amount) return;
  const existingBill = editingBillId ? state.bills.find((item) => item.id === editingBillId) : null;

  const billData = {
    title,
    date,
    time,
    expense: amount,
    paidBy: billPaidByInput.value,
    billMember: billMemberInput.value,
    settled: selectedBillMember === 'all' ? billSettledInput.checked : Boolean(existingBill?.settled),
    settledMembers: [],
    paymentMethod: billPaymentMethodInput.value,
    cardNetwork: billPaymentMethodInput.value === 'card' ? billCardNetworkInput.value : '',
    cardMarkup: billPaymentMethodInput.value === 'card' ? Number(billCardMarkupInput.value) || 0 : 0,
  };
  let savedBill;
  if (editingBillId) {
    const bill = existingBill;
    if (bill) {
      billData.settledMembers = bill.settledMembers || [];
      Object.assign(bill, billData);
      savedBill = bill;
    }
  } else {
    savedBill = { id: Date.now().toString(36) + Math.random().toString(36).slice(2), ...billData };
    state.bills.push(savedBill);
  }
  if (savedBill && selectedBillMember !== 'all') {
    setMemberSettlement(savedBill, selectedBillMember, billSettledInput.checked);
  }
  if (savedBill && selectedBillMember === 'all') {
    setAllSettlement(savedBill, billSettledInput.checked);
  }

  saveState();
  renderExpenseList();
  expenseForm.reset();
  editingBillId = null;
  closeExpenseModal();
});

if (destinationClockTimer) clearInterval(destinationClockTimer);
destinationClockTimer = setInterval(refreshDestinationClock, 60 * 1000);
init();
initializeCollaboration();
