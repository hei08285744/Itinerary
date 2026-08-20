const STORAGE_KEY = 'itinerary-app-data';

// Fixed Google Maps API key (restrict it to your domain via HTTP referrer restrictions in Google Cloud Console).
const GOOGLE_MAPS_API_KEY = 'AIzaSyDpcKhIMm0_2uX79oKv1WkvZOSyXhCWX74';

const state = loadState();
let selectedDayIndex = 0;
const weatherCache = {};
let weatherRequestId = 0;
let destinationClockTimer = null;
let destinationClockRequestId = 0;
let currentDestinationCity = '';
let currentDestinationCoordinates = null;

const tripNameInput = document.getElementById('tripName');
const tripDestinationInput = document.getElementById('tripDestination');
const tripStartDateInput = document.getElementById('tripStartDate');
const tripEndDateInput = document.getElementById('tripEndDate');
const themeButtons = document.querySelectorAll('[data-theme-option]');
const departureFlightInput = document.getElementById('departureFlight');
const returnFlightInput = document.getElementById('returnFlight');
const mapStatus = document.getElementById('mapStatus');
const mapLegend = document.getElementById('mapLegend');
const tripMapEl = document.getElementById('tripMap');
const activityForm = document.getElementById('activityForm');
const itineraryDays = document.getElementById('itineraryDays');
const emptyState = document.getElementById('emptyState');
const clearDayBtn = document.getElementById('clearDayBtn');
const addActivityBtn = document.getElementById('addActivityBtn');
const activityModalOverlay = document.getElementById('activityModalOverlay');
const closeActivityModalBtn = document.getElementById('closeActivityModalBtn');
const activityLocationInput = document.getElementById('activityLocation');
const activityRatingInput = document.getElementById('activityRating');
const activityDescriptionInput = document.getElementById('activityDescription');
const activityMapProviderInput = document.getElementById('activityMapProvider');
const activityNaverUrlInput = document.getElementById('activityNaverUrl');
const activityExpenseInput = document.getElementById('activityExpense');
const activityExpenseCurrencyInput = document.getElementById('activityExpenseCurrency');
const activityBillMemberInput = document.getElementById('activityBillMember');
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
const billTabs = document.getElementById('billTabs');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const expenseModalOverlay = document.getElementById('expenseModalOverlay');
const closeExpenseModalBtn = document.getElementById('closeExpenseModalBtn');
const expenseForm = document.getElementById('expenseForm');
const billMemberInput = document.getElementById('billMember');
const billExpenseCurrencyInput = document.getElementById('billExpenseCurrency');
const removeExpenseBtn = document.getElementById('removeExpenseBtn');
const splitBillModalOverlay = document.getElementById('splitBillModalOverlay');
const closeSplitBillModalBtn = document.getElementById('closeSplitBillModalBtn');
const cancelSplitBillBtn = document.getElementById('cancelSplitBillBtn');
const applySplitBillBtn = document.getElementById('applySplitBillBtn');
const splitBillMemberOptions = document.getElementById('splitBillMemberOptions');
let currentExchangeRate = null;
const expenseConversionRates = {};
let editingActivityId = null;
let editingBillId = null;
let selectedBillMember = 'all';
let splittingBillId = null;
let currentPlaceAddress = '';

const routeList = document.getElementById('routeList');
const routeStatus = document.getElementById('routeStatus');
const routeModeSelect = document.getElementById('routeMode');
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
const cityPeriods = document.getElementById('cityPeriods');
const addCityBtn = document.getElementById('addCityBtn');
const profileImportItineraryInput = document.getElementById('profileImportItineraryInput');
const profileExportItineraryBtn = document.getElementById('profileExportItineraryBtn');
const newTripBtn = document.getElementById('newTripBtn');
const profileTripLibrary = document.getElementById('profileTripLibrary');
const shoppingHaulList = document.getElementById('shoppingHaulList');
const shoppingHaulCount = document.getElementById('shoppingHaulCount');
const shoppingHaulProgress = document.getElementById('shoppingHaulProgress');
const shoppingHaulForm = document.getElementById('shoppingHaulForm');
const shoppingHaulActivity = document.getElementById('shoppingHaulActivity');
const shoppingHaulName = document.getElementById('shoppingHaulName');
const shoppingHaulImage = document.getElementById('shoppingHaulImage');
const shoppingHaulUrl = document.getElementById('shoppingHaulUrl');
const shoppingHaulModal = document.getElementById('shoppingHaulModal');
const openShoppingHaulFormBtn = document.getElementById('openShoppingHaulFormBtn');
const closeShoppingHaulFormBtn = document.getElementById('closeShoppingHaulFormBtn');
const shoppingHaulModalTitle = document.getElementById('shoppingHaulModalTitle');
const shoppingHaulTotal = document.getElementById('shoppingHaulTotal');
const shoppingHaulDone = document.getElementById('shoppingHaulDone');
const shoppingHaulRemaining = document.getElementById('shoppingHaulRemaining');
const shoppingHaulPercent = document.getElementById('shoppingHaulPercent');
let editingShoppingItem = null;
let editingShoppingActivity = null;
const memberNameInput = document.getElementById('memberNameInput');
const addMemberBtn = document.getElementById('addMemberBtn');
const memberList = document.getElementById('memberList');

const TRANSLATIONS = {
  en: {
    tripDetails: 'Trip Details', tripName: 'Trip Name', destination: 'Destination', theme: 'Theme', settings: 'Settings', language: 'Language',
    startDate: 'Start Date', endDate: 'End Date', saveClose: 'Save & Close', today: 'TODAY',
    addItem: '+ Add Item', clearDay: 'Clear Day', tripMap: 'Trip Map', route: 'Route', suggestedRoute: 'Suggested route · Google Maps', bestTravelMode: 'Best travel mode', spotA: 'Spot A', spotB: 'Spot B', saveRoute: 'Save route', savedRoutes: 'Saved routes',
    travelMode: 'Travel Mode', driving: 'Driving', automobile: 'Automobile', walking: 'Walking', transit: 'Transit', mapPlatform: 'Map platform',
    itinerary: 'Itinerary', profile: 'Profile', tripProfile: 'Trip profile', editTrip: 'Edit trip', tripFiles: 'Trip Files', tripFilesHint: 'Load another saved itinerary to replace this trip.', loadAnotherTrip: 'Load another trip', trips: 'Trips', currentTrip: 'Current trip', removeSavedTrip: 'Remove saved trip', removeSavedTripConfirm: 'Remove this saved trip?', days: 'Days', items: 'Items', wallet: 'Wallet', tripBudget: 'Trip budget', totalSpent: 'Total spent', budgetLeft: 'Budget left', currencyExchange: 'Currency Exchange', bills: 'Bills', addExpense: '+ Add Expense',
    multipleCities: 'Multiple cities', addCity: '+ Add city', city: 'City', remove: 'Remove', editItem: 'Edit Item',
    members: 'Trip members', addMember: '+ Add', memberPlaceholder: 'e.g. Alex', shoppingHaul: 'Shopping Haul', shoppingHaulKicker: 'Shopping haul', shoppingHaulHint: 'Keep every shopping target in one place.', targetItems: 'Target items',
    exportItinerary: 'Download trip', importItinerary: 'Load itinerary', newTrip: '+ New trip',
  },
  zh: {
    tripDetails: '行程詳情', tripName: '行程名稱', destination: '目的地', theme: '主題', settings: '設定', language: '語言',
    startDate: '開始日期', endDate: '結束日期', saveClose: '儲存並關閉', today: '今天',
    addItem: '+ 新增項目', clearDay: '清除當天', tripMap: '行程地圖', route: '路線', suggestedRoute: '建議路線 · Google 地圖', bestTravelMode: '最佳交通方式', spotA: '地點 A', spotB: '地點 B', saveRoute: '儲存路線', savedRoutes: '已儲存路線',
    travelMode: '交通方式', driving: '開車', automobile: '汽車', walking: '步行', transit: '大眾運輸', mapPlatform: '地圖平台',
    itinerary: '行程', profile: '個人檔案', tripProfile: '行程檔案', editTrip: '編輯行程', tripFiles: '行程檔案', tripFilesHint: '載入另一個已儲存的行程以取代目前行程。', loadAnotherTrip: '載入其他行程', trips: '行程', currentTrip: '目前行程', removeSavedTrip: '移除已儲存行程', removeSavedTripConfirm: '要移除這個已儲存行程嗎？', days: '天', items: '項目', wallet: '錢包', tripBudget: '旅程預算', totalSpent: '已支出', budgetLeft: '剩餘預算', currencyExchange: '貨幣兌換', bills: '帳單', addExpense: '+ 新增支出',
    multipleCities: '多城市行程', addCity: '+ 新增城市', city: '城市', remove: '移除', editItem: '編輯項目',
    members: '同行成員', addMember: '+ 新增', memberPlaceholder: '例如：小明', shoppingHaul: '購物清單', shoppingHaulKicker: '購物整理', shoppingHaulHint: '把所有想買的商品集中在這裡。', targetItems: '目標商品',
    exportItinerary: '下載行程', importItinerary: '載入行程', newTrip: '+ 新行程',
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
  settingsBtn.setAttribute('aria-label', language === 'zh' ? '行程設定' : 'Trip settings');
  renderCityPeriods();
  renderMembers();
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
    walletBudget: 0,
    theme: 'joy',
    savedRoutes: [],
  };
}

function saveState() {
  syncCurrentTripToLibrary();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

function init() {
  if (!TRANSLATIONS[state.language]) state.language = 'en';
  tripNameInput.value = state.tripName || '';
  tripDestinationInput.value = state.tripDestination || '';
  tripStartDateInput.value = state.tripStartDate || '';
  tripEndDateInput.value = state.tripEndDate || '';
  if (!['joy', 'violet', 'cobalt', 'coffee'].includes(state.theme)) state.theme = 'joy';
  applyTheme();
  departureFlightInput.value = state.departureFlight || '';
  returnFlightInput.value = state.returnFlight || '';
  if (!state.geocodeCache) state.geocodeCache = {};
  if (!state.bills) state.bills = [];
  if (!state.routeFees) state.routeFees = {};
  if (!isFinite(Number(state.walletBudget))) state.walletBudget = 0;
  if (!Array.isArray(state.savedRoutes)) state.savedRoutes = [];
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
  loadGoogleMaps(GOOGLE_MAPS_API_KEY);
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
    updateMapMarkers();
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
  render();
});

cityPeriods.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove-city]');
  if (!button) return;
  state.cities.splice(Number(button.dataset.removeCity), 1);
  if (state.cities.length <= 1) state.multipleCities = false;
  saveState();
  render();
});

departureFlightInput.addEventListener('input', () => {
  state.departureFlight = departureFlightInput.value;
  saveState();
});

returnFlightInput.addEventListener('input', () => {
  state.returnFlight = returnFlightInput.value;
  saveState();
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
    billMember: activityBillMemberInput.value,
    address: activityDescriptionInput.value.trim() || currentPlaceAddress,
    mapProvider: activityMapProviderInput.value || 'google',
    naverUrl: activityNaverUrlInput.value.trim(),
    shoppingItems: category === 'shopping' ? shoppingItemsDraft : [],
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
  if (editingActivityId) {
    const activity = state.activities.find((item) => item.id === editingActivityId);
    if (activity) Object.assign(activity, activityData);
  } else {
    state.activities.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      ...activityData,
    });
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

closeActivityModalBtn.addEventListener('click', () => {
  closeActivityModal();
});

activityModalOverlay.addEventListener('click', (e) => {
  if (e.target === activityModalOverlay) e.stopPropagation();
});

function openActivityModal(activity = null) {
  editingActivityId = activity?.id || null;
  currentPlaceAddress = activity?.address || '';
  shoppingItemsDraft = activity?.shoppingItems ? activity.shoppingItems.map((item) => ({ ...item })) : [];
  activityForm.reset();
  populateExpenseCurrencyOptions(activityExpenseCurrencyInput, getExpenseCurrency(activity?.expense) || getCurrencyForDestination(getCityForDate(activity?.date || getTripDays()[selectedDayIndex])));
  populateMemberOptions(activityBillMemberInput, activity?.billMember || '');
  updateActivityExpenseHint(activity?.date || getTripDays()[selectedDayIndex]);
  document.getElementById('activityModalTitle').textContent = editingActivityId ? t('editItem') : t('addItem').replace(/^\+ /, '');
  document.getElementById('activitySubmitBtn').textContent = editingActivityId ? t('editItem') : t('addItem');
  toggleFlightDetails(activity?.category || 'flight');
  toggleShoppingDetails(activity?.category || 'flight');
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
    activityMapProviderInput.value = activity.mapProvider || 'google';
    activityNaverUrlInput.value = activity.naverUrl || '';
    document.getElementById('activityExpense').value = activity.expense || '';
    activityExpenseCurrencyInput.value = getExpenseCurrency(activity.expense) || activityExpenseCurrencyInput.value;
    activityBillMemberInput.value = activity.billMember || '';
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
  }
  activityModalOverlay.classList.remove('hidden');
}

function toggleFlightDetails(category) {
  flightDetails.classList.toggle('hidden', category !== 'flight');
}

function toggleShoppingDetails(category) {
  shoppingDetails.classList.toggle('hidden', category !== 'shopping');
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

function addShoppingItem() {
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

shoppingImageInput.addEventListener('input', () => {
  const image = shoppingImageInput.value.trim();
  shoppingImagePreview.classList.add('hidden');
  shoppingImageStatus.textContent = '';
  if (!image) return;
  shoppingImagePreview.onload = () => {
    shoppingImagePreview.classList.remove('hidden');
    shoppingImageStatus.textContent = 'Image ready';
  };
  shoppingImagePreview.onerror = () => {
    shoppingImageStatus.textContent = 'Image URL could not be loaded';
  };
  shoppingImagePreview.src = image;
});

activityCategoryInput.addEventListener('change', () => {
  toggleFlightDetails(activityCategoryInput.value);
  toggleShoppingDetails(activityCategoryInput.value);
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

function toISODate(date) {
  return date.toISOString().slice(0, 10);
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
let mapsApiLoaded = false;
let mapsApiLoading = false;
let placeAutocomplete = null;

const TRAVEL_MAP_STYLES = [
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#56635f' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [{ color: '#f3f0e8' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry.fill',
    stylers: [{ color: '#e3eedf' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#dedbd2' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#f7d7a8' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#d8e4e0' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b9e3e8' }],
  },
];

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
    mapStatus.textContent = 'Google Maps rejected this API key. Check billing, HTTP referrer restrictions, Maps JavaScript API, and Places API.';
    mapStatus.style.display = 'block';
    placeLookupStatus.textContent = 'Google Places is unavailable because the API key was rejected.';
  };

  window.__initTripMap = () => {
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
      styles: TRAVEL_MAP_STYLES,
    });
    geocoder = new google.maps.Geocoder();
    placesService = new google.maps.places.PlacesService(map);
    directionsService = new google.maps.DirectionsService();
    setupPlaceAutocomplete();
    tripMapEl.style.display = 'block';
    updateMapMarkers();
    renderSpotRouteSelectors(getTripDays());
    renderDayStrip(getTripDays());
    if (activityLocationInput.value.trim()) lookupPlaceDetails();
  };

  const script = document.createElement('script');
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

function setupPlaceAutocomplete() {
  if (placeAutocomplete || !window.google?.maps?.places?.Autocomplete) return;
  placeAutocomplete = new google.maps.places.Autocomplete(activityLocationInput, {
    fields: ['name', 'formatted_address', 'rating', 'editorial_summary', 'place_id'],
    types: ['establishment', 'geocode'],
  });
  placeAutocomplete.addListener('place_changed', () => {
    const place = placeAutocomplete.getPlace();
    if (!place || !place.name) return;
    activityLocationInput.value = place.name;
    currentPlaceAddress = place.formatted_address || '';
    activityRatingInput.value = place.rating || '';
    activityDescriptionInput.value = place.formatted_address || '';
    placeLookupStatus.textContent = '';
  });
}

// Looks up rating and a short description for the entered location via Google Places and fills the read-only fields.
let placeLookupTimer = null;
function lookupPlaceDetails() {
  const location = activityLocationInput.value.trim();
  activityRatingInput.value = '';
  activityDescriptionInput.value = '';
  currentPlaceAddress = '';

  if (!location) {
    placeLookupStatus.textContent = 'Rating and description auto-fill from Google Places once you enter a location (requires a Maps API key with Places enabled).';
    return;
  }

  if (!mapsApiLoaded || !placesService) {
    placeLookupStatus.textContent = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY'
      ? 'Google Places is still loading. Check that Maps JavaScript API and Places API are enabled for this key.'
      : 'Set GOOGLE_MAPS_API_KEY in js/app.js to auto-fill rating and description from Google Places.';
    return;
  }

  const queryCity = getCityForDate(document.getElementById('activityDate').value);
  const query = queryCity ? `${location}, ${queryCity}` : location;
  placeLookupStatus.textContent = 'Looking up place details…';

  placesService.findPlaceFromQuery(
    { query, fields: ['place_id', 'name', 'formatted_address'] },
    (results, status) => {
      if (status === 'REQUEST_DENIED') {
        placeLookupStatus.textContent = 'Google Places access was denied. Enable Places API (legacy) or Places API (New), enable billing, and allow this site in the key HTTP referrers.';
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

      placesService.getDetails(
        { placeId: results[0].place_id, fields: ['name', 'rating', 'editorial_summary', 'types', 'formatted_address'] },
        (place, detailsStatus) => {
          if (detailsStatus === 'REQUEST_DENIED') {
            placeLookupStatus.textContent = 'Google Places details were denied. Enable Places API and check this key\'s restrictions.';
            return;
          }
          if (detailsStatus !== google.maps.places.PlacesServiceStatus.OK || !place) {
            placeLookupStatus.textContent = 'Could not load place details.';
            return;
          }

          activityRatingInput.value = place.rating || '';
          currentPlaceAddress = place.formatted_address || results[0].formatted_address || '';
          activityDescriptionInput.value = place.formatted_address || results[0].formatted_address || '';
          placeLookupStatus.textContent = '';
        }
      );
    }
  );
}

activityLocationInput.addEventListener('input', () => {
  clearTimeout(placeLookupTimer);
  placeLookupTimer = setTimeout(lookupPlaceDetails, 600);
});

document.getElementById('activityDate').addEventListener('change', (event) => {
  updateActivityExpenseHint(event.target.value);
});


function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
}

function placeMarker(position, color, activity, dayIndex) {
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
  markers.push(marker);
}

function updateMapMarkers() {
  if (!map || !geocoder) return;
  clearMarkers();

  const days = getTripDays();
  const selectedDate = days[selectedDayIndex];
  const locatable = state.activities.filter((a) => a.location && a.date === selectedDate);

  if (!locatable.length) {
    mapStatus.textContent = state.language === 'zh'
      ? '這一天尚未新增地點。'
      : 'Add a location to this day to see its pin here.';
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
      map.fitBounds(bounds);
      return;
    }

    geocoder.geocode({ address: query }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const loc = results[0].geometry.location;
        const coords = { lat: loc.lat(), lng: loc.lng() };
        state.geocodeCache[query] = coords;
        saveState();
        placeMarker(coords, color, activity, dayIndex);
        bounds.extend(coords);
        map.fitBounds(bounds);
      } else {
        failedCount += 1;
        mapStatus.textContent = `Could not locate "${query}" (${status}). Make sure the Geocoding API is enabled for your Maps key.`;
        mapStatus.style.display = 'block';
      }
    });
  });
}

let suggestedRouteRenderer = null;
let suggestedMarkers = [];
let suggestedPolyline = null;
let currentSuggestedRoute = null;

function renderSpotRouteSelectors(days) {
  if (suggestedRouteRenderer) suggestedRouteRenderer.setMap(null);
  clearSuggestedGeometry();
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
  spotRouteStatus.textContent = mapsApiLoaded ? '' : 'Map API loading…';
  requestSuggestedRoute();
}

function requestSuggestedRoute() {
  if (!directionsService || !spotASelect.value || !spotBSelect.value || spotASelect.value === spotBSelect.value) return;
  const from = state.activities.find((activity) => activity.id === spotASelect.value);
  const to = state.activities.find((activity) => activity.id === spotBSelect.value);
  if (!from || !to) return;
  const city = getCityForDate(from.date);
  const origin = city ? `${from.location}, ${city}` : from.location;
  const destination = city ? `${to.location}, ${city}` : to.location;
  const mode = routeModeSelect.value;
  spotRouteStatus.textContent = state.language === 'zh' ? '規劃中…' : 'Planning…';
  spotRouteResult.textContent = '';
  spotFareGrid.innerHTML = '';
  currentSuggestedRoute = null;
  saveSuggestedRouteBtn.disabled = true;
  directionsService.route({ origin, destination, travelMode: google.maps.TravelMode[mode] }, (result, status) => {
    if (status !== 'OK' || !result.routes.length) {
      spotRouteStatus.textContent = state.language === 'zh'
        ? `找不到路線（${status}）`
        : `Route unavailable (${status})`;
      geocodeSuggestedSpots(from, to, mode);
      return;
    }
    if (!suggestedRouteRenderer) {
      suggestedRouteRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false, preserveViewport: false });
    }
    suggestedRouteRenderer.setMap(map);
    clearSuggestedGeometry();
    suggestedRouteRenderer.setDirections(result);
    map.fitBounds(result.routes[0].bounds);
    const leg = result.routes[0].legs[0];
    spotRouteStatus.textContent = state.language === 'zh' ? '建議路線' : 'Suggested route';
    spotRouteResult.textContent = `${leg.distance.text} · ${leg.duration.text}`;
    renderFareEstimates(Number(leg.distance.value) || 0, leg.duration.text, false);
    currentSuggestedRoute = buildSuggestedRoute(from, to, mode, leg.distance.text, leg.duration.text, false, leg.start_location, leg.end_location);
    saveSuggestedRouteBtn.disabled = false;
  });
}

function buildSuggestedRoute(from, to, mode, distance, duration, estimated, fromPosition = null, toPosition = null) {
  const fromCity = getCityForDate(from.date);
  const toCity = getCityForDate(to.date);
  const currency = getCurrencyForDestination(fromCity || toCity);
  return {
    id: `route-${Date.now().toString(36)}`,
    fromTitle: from.title || from.location,
    toTitle: to.title || to.location,
    fromLocation: from.location,
    toLocation: to.location,
    fromCity,
    toCity,
    fromCoordinates: fromPosition ? { lat: fromPosition.lat(), lng: fromPosition.lng() } : null,
    toCoordinates: toPosition ? { lat: toPosition.lat(), lng: toPosition.lng() } : null,
    mode,
    distance,
    duration,
    taxiFare: estimateTaxiFare(distance, currency),
    taxiCurrency: currency,
    estimated,
    savedAt: new Date().toISOString(),
  };
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

function renderFareEstimates(distanceMeters, durationText, isEstimate) {
  const km = distanceMeters / 1000;
  spotFareGrid.innerHTML = `
    <div class="spot-fare-card"><span>Distance</span><strong>${km.toFixed(1)} km</strong></div>
    <div class="spot-fare-card"><span>ETA</span><strong>${durationText}</strong></div>`;
}

function clearSuggestedGeometry() {
  suggestedMarkers.forEach((marker) => marker.setMap(null));
  suggestedMarkers = [];
  if (suggestedPolyline) {
    suggestedPolyline.setMap(null);
    suggestedPolyline = null;
  }
}

function geocodeSuggestedSpots(from, to, mode) {
  if (!geocoder || !map) return;
  const city = getCityForDate(from.date);
  const bounds = new google.maps.LatLngBounds();
  const positions = [];
  clearSuggestedGeometry();
  [from, to].forEach((spot, index) => {
    const query = city ? `${spot.location}, ${city}` : spot.location;
    geocoder.geocode({ address: query }, (results, status) => {
      if (status !== 'OK' || !results[0]) return;
      const position = results[0].geometry.location;
      const marker = new google.maps.Marker({
        position,
        map,
        title: `${index === 0 ? 'Spot A' : 'Spot B'} · ${spot.title}`,
        label: {
          text: index === 0 ? 'A' : 'B',
          color: '#fff',
          fontWeight: '700',
        },
      });
      suggestedMarkers.push(marker);
      positions[index] = position;
      bounds.extend(position);
      map.fitBounds(bounds);
      if (positions.filter(Boolean).length === 2) {
        requestCoordinateRoute(positions, from, to, mode);
      }
    });
  });
}

function requestCoordinateRoute(positions, from, to, mode) {
  directionsService.route({
    origin: positions[0],
    destination: positions[1],
    travelMode: google.maps.TravelMode[mode],
  }, (result, status) => {
    if (status === 'OK' && result.routes.length) {
      if (!suggestedRouteRenderer) suggestedRouteRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: false, preserveViewport: false });
      clearSuggestedGeometry();
      suggestedRouteRenderer.setMap(map);
      suggestedRouteRenderer.setDirections(result);
      map.fitBounds(result.routes[0].bounds);
      const leg = result.routes[0].legs[0];
      spotRouteStatus.textContent = state.language === 'zh' ? '建議路線' : 'Suggested route';
      spotRouteResult.textContent = `${leg.distance.text} · ${leg.duration.text}`;
      renderFareEstimates(Number(leg.distance.value) || 0, leg.duration.text, false);
      currentSuggestedRoute = buildSuggestedRoute(from, to, mode, leg.distance.text, leg.duration.text, false, leg.start_location, leg.end_location);
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
    chip.classList.toggle('selected', index === selectedDayIndex);
    chip.setAttribute('aria-pressed', String(index === selectedDayIndex));
    chip.addEventListener('click', () => selectDay(index));

    const dot = document.createElement('span');
    dot.className = 'legend-dot';
    dot.style.background = getDayColor(index);
    chip.appendChild(dot);

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
    info.textContent = mapsApiLoaded ? 'Calculating…' : 'Set GOOGLE_MAPS_API_KEY in js/app.js to calculate distance & time.';
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

    if (mapsApiLoaded && directionsService) {
      fetchRouteDistance(from, to, mode, info);
    }
  }
}

routeModeSelect.addEventListener('change', () => {
  renderRoutePanel(getTripDays());
  requestSuggestedRoute();
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
  greetingSub.textContent = state.language === 'zh'
    ? `${destination}共 ${days.length} 天`
    : `${days.length} day${days.length > 1 ? 's' : ''} in ${destination}`;

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
  if (mapsApiLoaded) updateMapMarkers();

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
    shoppingHaulActivity.add(new Option(`${activity.title} · ${activity.date || 'No date'}`, activity.id));
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
    heading.innerHTML = `<strong>${activity.title}</strong><span>${activity.date || ''}</span>`;
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
        shoppingHaulModalTitle.textContent = 'Edit target item';
        shoppingHaulModal.classList.remove('hidden');
        shoppingHaulName.focus();
      });
      row.append(details, quantityWrap, status, editButton);
      group.appendChild(row);
    });
    shoppingHaulList.appendChild(group);
  });
}

shoppingHaulForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const activity = state.activities.find((item) => item.id === shoppingHaulActivity.value);
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
  shoppingHaulActivity.disabled = false;
  editingShoppingItem = null;
  editingShoppingActivity = null;
  shoppingHaulModalTitle.textContent = 'Add target item';
  shoppingHaulModal.classList.add('hidden');
  render();
});

openShoppingHaulFormBtn.addEventListener('click', () => {
  editingShoppingItem = null;
  editingShoppingActivity = null;
  shoppingHaulActivity.disabled = false;
  shoppingHaulForm.reset();
  shoppingHaulModalTitle.textContent = 'Add target item';
  shoppingHaulModal.classList.remove('hidden');
  shoppingHaulActivity.focus();
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

function getSavedRouteUrl(route, provider) {
  const originName = route.fromCity ? `${route.fromLocation}, ${route.fromCity}` : route.fromLocation;
  const destinationName = route.toCity ? `${route.toLocation}, ${route.toCity}` : route.toLocation;
  const fromCoordinates = route.fromCoordinates || state.geocodeCache?.[originName];
  const toCoordinates = route.toCoordinates || state.geocodeCache?.[destinationName];
  const origin = encodeURIComponent(originName);
  const destination = encodeURIComponent(destinationName);
  const mode = String(route.mode || 'DRIVING').toLowerCase();

  if (provider === 'naver') {
    const from = fromCoordinates;
    const to = toCoordinates;
    const naverMode = mode === 'transit' ? 'publictransit' : mode === 'walking' ? 'walk' : 'car';
    if (from && to) {
      return `https://map.naver.com/p/directions/${from.lng},${from.lat},${encodeURIComponent(route.fromLocation)}/${to.lng},${to.lat},${encodeURIComponent(route.toLocation)}/-/${naverMode}`;
    }
    return `https://map.naver.com/p/search/${origin}`;
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
  state.savedRoutes.forEach((route) => {
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
    routeTitle.textContent = `${route.fromTitle} → ${route.toTitle}`;
    const routeMetrics = document.createElement('div');
    routeMetrics.className = 'saved-route-metrics';
    [
      ['Distance', route.distance],
      ['ETA', route.duration],
      ['Taxi', taxiFare],
    ].forEach(([label, value]) => {
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
    savedRoutePanel.appendChild(row);
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
      renderExpenseList();
    });
    billTabs.appendChild(button);
  });
}

function populateBillMemberOptions() {
  populateMemberOptions(billMemberInput, billMemberInput.value);
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
    splitBillMemberOptions.appendChild(label);
  });
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
  bill.splitMembers = selectedMembers;
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
  const hasRate = isFinite(currentExchangeRate);
  for (const activity of expenses) {
    const row = document.createElement('div');
    row.className = 'expense-row';

    const main = document.createElement('div');
    main.className = 'expense-row-main';

    const label = document.createElement('button');
    label.className = 'expense-row-label';
    label.type = 'button';
    const isUpfrontPayment = state.activities.some((item) => item.id === activity.id);
    label.textContent = isUpfrontPayment
      ? `${activity.title} · ${state.language === 'zh' ? '預付款' : 'Upfront'}`
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
    meta.textContent = [activity.date, formatTime(activity.time)].filter(Boolean).join(' · ');
    main.appendChild(meta);

    row.appendChild(main);

    const amounts = document.createElement('div');
    amounts.className = 'expense-row-amounts';

    const amount = document.createElement('span');
    amount.className = 'expense-row-amount';
    const parsed = parseFloat(activity.expense.replace(/[^0-9.]/g, ''));
    const originalCurrency = getExpenseCurrency(activity.expense) || getCurrencyForDestination(getCityForDate(activity.date));
    const isSplit = Array.isArray(activity.splitMembers) && activity.splitMembers.length > 0;
    const displayedAmount = isSplit && selectedBillMember !== 'all'
      ? parsed / activity.splitMembers.length
      : parsed;
    amount.textContent = isSplit && isFinite(displayedAmount)
      ? `${originalCurrency} ${displayedAmount.toFixed(2)}`
      : activity.expense;
    amounts.appendChild(amount);

    if (isFinite(parsed)) {
      total += isFinite(displayedAmount) ? displayedAmount : 0;
      totalCurrencies.add(originalCurrency);
      if (!isUpfrontPayment && hasRate) {
        const converted = document.createElement('span');
        converted.className = 'expense-row-converted';
        converted.textContent = `≈ ${(displayedAmount * currentExchangeRate).toFixed(2)} ${currencyToInput.value}`;
        amounts.appendChild(converted);
      }
    }

    const canSplit = selectedBillMember === 'all' && !activity.billMember;
    if (canSplit) {
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
      amounts.appendChild(splitButton);
    }

    row.appendChild(amounts);
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

async function calculateAllBillsConvertedTotal(expenses, member) {
  const targetCurrency = currencyToInput.value;
  const totals = new Map();
  expenses.forEach((expense) => {
    const parsed = parseFloat(expense.expense.replace(/[^0-9.]/g, ''));
    if (!isFinite(parsed)) return;
    const splitCount = Array.isArray(expense.splitMembers) && expense.splitMembers.length;
    const amount = splitCount && member !== 'all' ? parsed / splitCount : parsed;
    const currency = getExpenseCurrency(expense.expense) || getCurrencyForDestination(getCityForDate(expense.date));
    totals.set(currency, (totals.get(currency) || 0) + amount);
  });

  const converted = await Promise.all([...totals].map(async ([currency, amount]) => (
    amount * await getExpenseConversionRate(currency, targetCurrency)
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

    const titleEl = document.createElement('h4');
    titleEl.className = 'item-title';
    titleEl.textContent = activity.location ? `${activity.title} · ${activity.location}` : activity.title;
    itemCard.appendChild(titleEl);

    if (activity.category === 'flight') {
      const flightEl = document.createElement('div');
      flightEl.className = 'flight-card-details';

      const routeEl = document.createElement('div');
      routeEl.className = 'flight-route';
      routeEl.textContent = `${activity.flightDeparture || activity.location || '—'} → ${activity.flightArrival || '—'}`;
      flightEl.appendChild(routeEl);

      if (activity.flightNumber) {
        const numberEl = document.createElement('div');
        numberEl.className = 'flight-number';
        numberEl.textContent = activity.flightNumber;
        flightEl.insertBefore(numberEl, routeEl);
      }

      const flightTimes = document.createElement('div');
      flightTimes.className = 'flight-times';
      const departureInfo = document.createElement('div');
      const departureTime = document.createElement('strong');
      departureTime.textContent = formatFlightDateTime(activity.date, activity.time);
      const departureMeta = document.createElement('span');
      departureMeta.textContent = formatFlightMeta(activity.departureTerminal, activity.departureGate, 'Departure');
      departureInfo.append(departureTime, departureMeta);
      const arrivalInfo = document.createElement('div');
      const arrivalTime = document.createElement('strong');
      arrivalTime.textContent = formatFlightDateTime(activity.flightArrivalDate, activity.flightArrivalTime);
      const arrivalMeta = document.createElement('span');
      arrivalMeta.textContent = formatFlightMeta(activity.arrivalTerminal, activity.arrivalGate, 'Arrival');
      arrivalInfo.append(arrivalTime, arrivalMeta);
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

    if (activity.remarks) {
      const remarksEl = document.createElement('div');
      remarksEl.className = 'item-remarks';
      remarksEl.textContent = activity.remarks;
      itemCard.appendChild(remarksEl);
    }

    if (activity.location || activity.expense) {
      const footerRow = document.createElement('div');
      footerRow.className = 'item-footer-row';

      if (activity.location) {
        const activityCity = getCityForDate(selectedDate);
        const mapQuery = activityCity ? `${activity.location}, ${activityCity}` : activity.location;
        const mapLink = document.createElement('a');
        const mapProvider = activity.mapProvider || 'google';
        mapLink.className = `item-map-link map-${mapProvider}`;
        mapLink.href = getMapUrl(mapProvider, mapQuery, activityCity, activity.location, state.geocodeCache?.[activityCity ? `${activity.location}, ${activityCity}` : activity.location], activity.naverUrl);
        mapLink.target = '_blank';
        mapLink.rel = 'noopener noreferrer';
        const mapLabels = { google: 'Google Maps', naver: 'Naver Maps', kakao: 'Kakao Map' };
        mapLink.textContent = mapLabels[mapProvider];
        footerRow.appendChild(mapLink);
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

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.title = 'Edit item';
    editBtn.addEventListener('click', () => openActivityModal(activity));
    itemCard.appendChild(editBtn);

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

function formatFlightDateTime(date, time) {
  if (!date && !time) return '—';
  return [date, formatTime(time)].filter(Boolean).join(' · ');
}

function formatFlightMeta(terminal, gate, label) {
  const details = [terminal && `Terminal ${terminal}`, gate && `Gate ${gate}`].filter(Boolean).join(' · ');
  return details || label;
}

function getMapUrl(provider, query, city = '', location = '', coordinates = null, naverUrl = '') {
  const encodedQuery = encodeURIComponent(query);
  if (provider === 'naver') {
    if (naverUrl) return naverUrl;
    const naverQuery = location && city ? `${location}, ${city}` : location || query;
    const encodedNaverQuery = encodeURIComponent(naverQuery);
    const center = coordinates ? `?c=${coordinates.lng},${coordinates.lat},16,0,0,0,dh` : '';
    return `https://map.naver.com/p/search/${encodedNaverQuery}${center}`;
  }
  if (provider === 'kakao') return `https://map.kakao.com/?q=${encodedQuery}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
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
  currencyToInput.value = 'HKD';
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
  setDefaultWalletCurrencies(state.tripDestination);
}

populateCurrencyOptions();
fetchLiveExchangeRate();

currencyFromInput.addEventListener('change', fetchLiveExchangeRate);
currencyToInput.addEventListener('change', fetchLiveExchangeRate);
currencyAmountInput.addEventListener('input', updateCurrencyResult);

currencySwapBtn.addEventListener('click', () => {
  const fromValue = currencyFromInput.value;
  currencyFromInput.value = currencyToInput.value;
  currencyToInput.value = fromValue;
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
  populateBillMemberOptions();
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
    populateMemberOptions(billMemberInput, bill.billMember || '');
  } else if (selectedDate) {
    document.getElementById('billDate').value = selectedDate;
  }
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

  const billData = {
    title,
    date,
    time,
    expense: amount,
    billMember: billMemberInput.value,
  };
  if (editingBillId) {
    const bill = state.bills.find((item) => item.id === editingBillId);
    if (bill) Object.assign(bill, billData);
  } else {
    state.bills.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2), ...billData });
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
