(function () {
  const googleRedirectKey = 'mytinerary-google-redirect';
  const clientId = `client-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
  let firestore = null;
  let currentTripId = '';
  let currentDocument = null;
  let unsubscribe = null;
  let remoteStateHandler = null;
  let statusHandler = null;
  let initializationPromise = null;

  function updateStatus(status, message) {
    if (statusHandler) statusHandler(status, message);
  }

  function isConfigured() {
    const config = window.FIREBASE_CONFIG || {};
    return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
  }

  function cleanState(value) {
    return JSON.parse(JSON.stringify(value));
  }

  async function initializeFirebase() {
    if (firestore) return firebase.auth().currentUser?.uid || '';
    if (initializationPromise) return initializationPromise;
    if (!isConfigured()) throw new Error('Firebase is not configured');
    if (!window.firebase) throw new Error('Firebase SDK did not load');
    if (!firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
    initializationPromise = (async () => {
      const auth = firebase.auth();
      await Promise.race([
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);
      const restoredUser = auth.currentUser || await Promise.race([
        new Promise((resolve, reject) => {
          let unsubscribeAuth = () => {};
          unsubscribeAuth = auth.onAuthStateChanged((user) => {
            unsubscribeAuth();
            resolve(user);
          }, reject);
        }),
        new Promise((resolve) => setTimeout(() => resolve(auth.currentUser), 2500)),
      ]);
      const user = restoredUser || (await auth.signInAnonymously()).user;
      firestore = firebase.firestore();
      return user?.uid || '';
    })().catch((error) => {
      initializationPromise = null;
      throw error;
    });
    return initializationPromise;
  }

  function getUid() {
    return window.firebase?.auth().currentUser?.uid || '';
  }

  function getCurrentUser() {
    const user = window.firebase?.auth().currentUser;
    if (!user) return null;
    return {
      uid: user.uid,
      anonymous: user.isAnonymous,
    };
  }

  function initializeFirebaseApp() {
    if (!isConfigured()) throw new Error('Firebase is not configured');
    if (!window.firebase) throw new Error('Firebase SDK did not load');
    if (!firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
    return firebase.auth();
  }

  function requiresGoogleRedirect() {
    const userAgent = navigator.userAgent || '';
    return /Safari/i.test(userAgent) && !/(Chrome|CriOS|FxiOS|EdgiOS|OPiOS|Android)/i.test(userAgent);
  }

  async function completeGoogleRedirect() {
    if (sessionStorage.getItem(googleRedirectKey) !== 'pending') return null;
    sessionStorage.removeItem(googleRedirectKey);
    const auth = initializeFirebaseApp();
    const result = await auth.getRedirectResult();
    if (!result?.user) return getCurrentUser();
    firestore = firebase.firestore();
    initializationPromise = Promise.resolve(result.user.uid);
    return getCurrentUser();
  }

  async function signInWithGoogle() {
    const auth = initializeFirebaseApp();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    if (requiresGoogleRedirect()) {
      sessionStorage.setItem(googleRedirectKey, 'pending');
      await auth.signInWithRedirect(provider);
      return null;
    }
    await auth.signInWithPopup(provider);
    firestore = firebase.firestore();
    initializationPromise = Promise.resolve(auth.currentUser?.uid || '');
    return getCurrentUser();
  }

  async function signOut() {
    disconnect();
    await firebase.auth().signOut();
    firestore = null;
    initializationPromise = null;
  }

  function getCallable(name) {
    return firebase.app().functions('asia-east2').httpsCallable(name);
  }

  async function prepareTrip(tripId, initialState, memberName) {
    await initializeFirebase();
    const response = await getCallable('prepareTrip')({ tripId, initialState: cleanState(initialState), memberName });
    return response.data;
  }

  async function setTripPin(tripId, pin, enabled = true) {
    await initializeFirebase();
    const response = await getCallable('setTripPin')({ tripId, pin, enabled });
    return response.data;
  }

  async function joinTrip(tripId, pin, memberName, avatarId) {
    await initializeFirebase();
    const response = await getCallable('joinTrip')({ tripId, pin, memberName, avatarId });
    return response.data;
  }

  async function removeTripMember(tripId, memberUid) {
    await initializeFirebase();
    const response = await getCallable('removeTripMember')({ tripId, memberUid });
    return response.data;
  }

  async function leaveTrip(tripId) {
    await initializeFirebase();
    const response = await getCallable('leaveTrip')({ tripId });
    return response.data;
  }

  async function getOwnedTrips(tripIds) {
    await initializeFirebase();
    const response = await getCallable('getOwnedTrips')({ tripIds });
    return { ...response.data, uid: getUid() };
  }

  async function getAccessibleTrips() {
    await initializeFirebase();
    const response = await getCallable('getAccessibleTrips')();
    return { ...response.data, uid: getUid() };
  }

  async function deleteTrip(tripId) {
    await initializeFirebase();
    const response = await getCallable('deleteTrip')({ tripId });
    return response.data;
  }

  function disconnect() {
    if (unsubscribe) unsubscribe();
    unsubscribe = null;
    currentTripId = '';
    currentDocument = null;
    remoteStateHandler = null;
    statusHandler = null;
  }

  async function connect({ tripId, initialState, memberName, onRemoteState, onStatus, onAccessRequired, onAccessResolved, onAccessRevoked, onConnectionError }) {
    remoteStateHandler = onRemoteState;
    statusHandler = onStatus;
    if (!isConfigured()) {
      updateStatus('not-configured', 'Firebase setup required');
      return false;
    }

    try {
      await initializeFirebase();
      const access = await prepareTrip(tripId, initialState, memberName);
      if (onAccessResolved) onAccessResolved({ ...access, uid: getUid() });
      if (!access.access) {
        updateStatus('locked', 'PIN required');
        if (onAccessRequired) onAccessRequired(access);
        return false;
      }
      if (currentTripId === tripId && unsubscribe) {
        updateStatus('online', 'Synced');
        return true;
      }
      updateStatus('connecting', 'Connecting…');
      if (unsubscribe) unsubscribe();
      currentTripId = tripId;
      currentDocument = firestore.collection('trips').doc(tripId);
      unsubscribe = currentDocument.onSnapshot(async (snapshot) => {
        if (!snapshot.exists) {
          await currentDocument.set({
            state: cleanState(initialState),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: clientId,
          });
          updateStatus('online', 'Synced');
          return;
        }

        updateStatus('online', 'Synced');
        const remoteDocument = snapshot.data();
        if (snapshot.metadata.hasPendingWrites || remoteDocument.updatedBy === clientId) return;
        if (remoteDocument.state && remoteStateHandler) remoteStateHandler(cleanState(remoteDocument.state));
      }, (error) => {
        console.error('Firebase sync listener failed', error);
        if (error?.code === 'permission-denied') {
          updateStatus('locked', 'Access removed');
          if (onAccessRevoked) onAccessRevoked();
        } else {
          updateStatus('error', 'Sync unavailable');
        }
      });
      return true;
    } catch (error) {
      console.error('Firebase connection failed', error);
      updateStatus('error', 'Sync unavailable');
      if (onConnectionError) onConnectionError(error);
      return false;
    }
  }

  async function save(tripId, nextState) {
    if (!isConfigured() || !currentDocument || currentTripId !== tripId) return false;
    try {
      updateStatus('saving', 'Saving…');
      await currentDocument.update({
        state: cleanState(nextState),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: clientId,
      });
      updateStatus('online', 'Synced');
      return true;
    } catch (error) {
      console.error('Firebase save failed', error);
      updateStatus('error', 'Not synced');
      return false;
    }
  }

  window.itinerarySync = {
    authenticate: initializeFirebase,
    completeGoogleRedirect,
    connect,
    deleteTrip,
    disconnect,
    getAccessibleTrips,
    getCurrentUser,
    getOwnedTrips,
    getUid,
    isConfigured,
    joinTrip,
    leaveTrip,
    removeTripMember,
    save,
    signInWithGoogle,
    signOut,
    setTripPin,
  };
}());