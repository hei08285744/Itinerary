(function () {
  const clientId = `client-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
  let firestore = null;
  let currentTripId = '';
  let currentDocument = null;
  let unsubscribe = null;
  let remoteStateHandler = null;
  let statusHandler = null;

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
    if (!isConfigured()) throw new Error('Firebase is not configured');
    if (!window.firebase) throw new Error('Firebase SDK did not load');
    if (!firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
    const credential = await firebase.auth().signInAnonymously();
    firestore = firebase.firestore();
    return credential.user?.uid || firebase.auth().currentUser?.uid || '';
  }

  function getUid() {
    return window.firebase?.auth().currentUser?.uid || '';
  }

  async function connect({ tripId, initialState, onRemoteState, onStatus }) {
    remoteStateHandler = onRemoteState;
    statusHandler = onStatus;
    if (!isConfigured()) {
      updateStatus('not-configured', 'Firebase setup required');
      return false;
    }

    try {
      await initializeFirebase();
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
        updateStatus('error', 'Sync unavailable');
      });
      return true;
    } catch (error) {
      console.error('Firebase connection failed', error);
      updateStatus('error', 'Sync unavailable');
      return false;
    }
  }

  async function save(tripId, nextState) {
    if (!isConfigured() || !currentDocument || currentTripId !== tripId) return false;
    try {
      updateStatus('saving', 'Saving…');
      await currentDocument.set({
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

  window.itinerarySync = { authenticate: initializeFirebase, connect, getUid, isConfigured, save };
}());