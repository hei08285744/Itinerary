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
  let presenceUnsubscribe = null;
  let presenceInterval = null;

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
      // Try to set LOCAL persistence, but fall back gracefully for browsers
      // that disable storage (e.g., Safari Private mode) or restrict cookies.
      try {
        await Promise.race([
          auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL),
          new Promise((resolve) => setTimeout(resolve, 2500)),
        ]);
      } catch (e) {
        console.warn('auth.setPersistence LOCAL failed, attempting fallbacks', e);
        try {
          await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
          console.info('auth.setPersistence: SESSION fallback applied');
        } catch (e2) {
          console.warn('auth.setPersistence SESSION failed, attempting NONE', e2);
          try {
            await auth.setPersistence(firebase.auth.Auth.Persistence.NONE);
            console.info('auth.setPersistence: NONE fallback applied');
          } catch (e3) {
            console.warn('auth.setPersistence NONE failed; auth may not persist across reloads', e3);
          }
        }
      }
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
      let user = restoredUser;
      // Do not auto-start anonymous fallback if a Google Redirect flow is actively pending, 
      // or if we already have an active Google user session somewhere in the workspace context.
      const hasActiveRedirect = localStorage.getItem(googleRedirectKey);
      if (!user && !hasActiveRedirect) {
        try {
          const auth = firebase.auth();
          // Verify if there's any valid standard user token before firing anonymous signin fallback
          const restoredGoogleUser = auth.currentUser || await new Promise((resolve) => {
            const unsub = auth.onAuthStateChanged((u) => {
              unsub();
              resolve(u);
            });
            setTimeout(() => { unsub(); resolve(null); }, 1500);
          });
          if (restoredGoogleUser) {
            user = restoredGoogleUser;
          } else {
            const anonResult = await auth.signInAnonymously();
            user = anonResult.user;
          }
        } catch (anonErr) {
          console.error('Anonymous sign-in failed', anonErr);
          throw anonErr;
        }
      }
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
    if (!window.firebase?.apps?.length) return null;
    const user = window.firebase?.auth().currentUser;
    if (!user) return null;
    return {
      uid: user.uid,
      anonymous: user.isAnonymous,
      displayName: user.displayName || user.email?.split('@')[0] || '',
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
    const isSafari = /Safari/i.test(userAgent) && !/(Chrome|CriOS|FxiOS|EdgiOS|OPiOS|Android)/i.test(userAgent);
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    // Standard Safari (desktop and mobile) runs 100% first-party auth via our aligned custom domain (mytinerary.site).
    // Built-in Safari popups are highly reliable and bypass any sessionStorage partition or redirect errors.
    // We only enforce redirect for Standalone/PWA home-screen installs where child window popups are OS-blocked.
    return isSafari && isStandalone;
  }

  async function completeGoogleRedirect() {
    let redirectUrl = null;
    try {
      redirectUrl = localStorage.getItem(googleRedirectKey);
    } catch (e) {
      console.warn('localStorage is disabled', e);
    }
    const auth = initializeFirebaseApp();
    let result = null;
    
    try {
      result = await auth.getRedirectResult();
    } catch (redirectErr) {
      console.warn("Redirect result error, clearing transition state", redirectErr);
      // Clean up local storage key to prevent infinite redirect loops on error
      try {
        localStorage.removeItem(googleRedirectKey);
      } catch (e) {}
      
      // If we failed with partition or missing state, try using existing auth session
      if (auth.currentUser) {
        window.__IS_AUTHENTICATED__ = true;
        firestore = firebase.firestore();
        initializationPromise = Promise.resolve(auth.currentUser.uid);
        return getCurrentUser();
      }
      throw redirectErr;
    }

    // Force redirect detection check on Safari/Google redirect flow if we have stored state
    if (!result?.user && !redirectUrl) {
      return auth.currentUser ? getCurrentUser() : null;
    }

    // Wait explicitly for onAuthStateChanged to resolve if auth is in mid-recovery
    const user = result?.user || auth.currentUser || await new Promise((resolve) => {
      let resolved = false;
      const unsubscribeAuth = auth.onAuthStateChanged((nextUser) => {
        if (!resolved) {
          resolved = true;
          unsubscribeAuth();
          resolve(nextUser);
        }
      });
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          unsubscribeAuth();
          resolve(auth.currentUser);
        }
      }, 5000);
    });

    // Always tidy up state tracking
    try {
      localStorage.removeItem(googleRedirectKey);
    } catch (e) {}

    if (!user) return null;

    // Set authenticated state explicitly for security.js
    window.__IS_AUTHENTICATED__ = true;
    if (redirectUrl && redirectUrl.startsWith(window.location.origin)) {
      window.history.replaceState(null, '', redirectUrl);
    }
    firestore = firebase.firestore();
    initializationPromise = Promise.resolve(user.uid);
    return getCurrentUser();
  }

  function signInWithGoogle() {
    const auth = initializeFirebaseApp();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    if (requiresGoogleRedirect()) {
      try {
        localStorage.setItem(googleRedirectKey, window.location.href);
      } catch (e) {
        console.warn('localStorage is disabled or full, redirect might not return to correct trip', e);
      }
      return auth.signInWithRedirect(provider).then(() => null);
    }
    
    // We execute signInWithPopup synchronously within the call stack of the user click thread.
    // This strictly ensures Safari and Chrome recognize it as a human-initiated action and NEVER block it.
    const promise = auth.signInWithPopup(provider).then(() => {
      firestore = firebase.firestore();
      initializationPromise = Promise.resolve(auth.currentUser?.uid || '');
      return getCurrentUser();
    });
    return promise;
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
    if (presenceUnsubscribe) {
      try {
        presenceUnsubscribe();
      } catch (e) {}
    }
    presenceUnsubscribe = null;
    if (presenceInterval) clearInterval(presenceInterval);
    presenceInterval = null;

    if (currentTripId && firestore) {
      const uid = getUid();
      if (uid) {
        firestore.collection('trips').doc(currentTripId).collection('presence').doc(uid).delete().catch(() => {});
      }
    }

    currentTripId = '';
    currentDocument = null;
    remoteStateHandler = null;
    statusHandler = null;
  }

  async function connect({ tripId, initialState, memberName, onRemoteState, onStatus, onPresence, onAccessRequired, onAccessResolved, onAccessRevoked, onConnectionError }) {
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

      // Start presence tracking
      if (presenceUnsubscribe) {
        try {
          presenceUnsubscribe();
        } catch (e) {}
      }
      presenceUnsubscribe = null;
      if (presenceInterval) clearInterval(presenceInterval);
      presenceInterval = null;

      const uid = getUid();
      if (uid) {
        const updatePresenceFunc = async () => {
          if (!firestore || !currentTripId) return;
          try {
            await firestore.collection('trips').doc(currentTripId).collection('presence').doc(uid).set({
              lastActive: firebase.firestore.FieldValue.serverTimestamp(),
              name: memberName || '',
            });
          } catch (e) {
            console.warn('Could not update active presence', e);
          }
        };

        // Immediate presence update
        updatePresenceFunc();
        presenceInterval = setInterval(updatePresenceFunc, 15000);

        // Listen for all presence documents in this trip
        const presenceCollection = firestore.collection('trips').doc(tripId).collection('presence');
        presenceUnsubscribe = presenceCollection.onSnapshot((querySnapshot) => {
          const activeUsers = {};
          const now = Date.now();
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const lastActiveMillis = data.lastActive?.toMillis?.() || 0;
            // Consider online if updated in the last 45 seconds or if it contains a verified emoji transaction
            const isOnline = (now - lastActiveMillis) < 45000 || (data.emoji && (now - (data.emojiTime || 0)) < 15000);
            if (isOnline) {
              activeUsers[doc.id] = {
                uid: doc.id,
                name: data.name || '',
                emoji: data.emoji || null,
                emojiTarget: data.emojiTarget || null,
                emojiTime: data.emojiTime || 0
              };
            }
          });
          if (onPresence) {
            onPresence(activeUsers);
          }
        }, (err) => {
          console.warn('Presence listener failed', err);
        });
      }

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

  async function sendPresenceEmoji(emoji, targetName) {
    await initializeFirebase();
    const uid = getUid();
    if (!uid || !currentTripId || !firestore) return;
    try {
      const userProfileStr = window.localStorage.getItem('mytinerary-user-profile');
      const parsedUserProfile = userProfileStr ? JSON.parse(userProfileStr) : {};
      const senderName = parsedUserProfile.name || '';
      await firestore.collection('trips').doc(currentTripId).collection('presence').doc(uid).set({
        lastActive: firebase.firestore.FieldValue.serverTimestamp(),
        name: senderName,
        emoji: emoji,
        emojiTarget: targetName,
        emojiTime: Date.now()
      });
    } catch (e) {
      console.warn('Failed to send presence emoji', e);
    }
  }

  // Wipe presence document immediately on page close to avoid waiting for timeout
  window.addEventListener('beforeunload', () => {
    if (firestore && currentTripId) {
      const uid = getUid();
      if (uid) {
        try {
          firestore.collection('trips').doc(currentTripId).collection('presence').doc(uid).delete();
        } catch (e) {}
      }
    }
  });

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
    sendPresenceEmoji,
    signInWithGoogle,
    signOut,
    setTripPin,
  };
}());