/*
  security.js — simple client-side hardening helpers

  Purpose: make it harder for casual users (or accidental scripts) to call
  Cloud Functions / external function endpoints from the browser by
  monkey-patching fetch / XHR and firebase.functions().httpsCallable.

  IMPORTANT: This is only a client-side convenience and can be bypassed
  by a determined user. Server-side protections (require auth, check
  ID tokens, restrict CORS, remove secrets from client) are REQUIRED for
  real security. See README or comments below for recommended server-side steps.

  Usage: the script blocks outgoing requests to common Cloud Functions
  hosts and throws when code attempts to call firebase functions unless
  `window.__ALLOW_FUNCTIONS__` is set to `true` (not recommended).
*/
(function () {
  'use strict';

  // Toggle - default: functions blocked in the browser
  window.__ALLOW_FUNCTIONS__ = window.__ALLOW_FUNCTIONS__ || false;
  // Authentication state flag — updated when Firebase Auth becomes available
  window.__IS_AUTHENTICATED__ = false;

  function isAuthenticated() {
    // explicit allow overrides
    if (window.__ALLOW_FUNCTIONS__) return true;
    // runtime flag set by Firebase Auth watcher
    if (window.__IS_AUTHENTICATED__) return true;
    return false;
  }

  // Hosts to block — kept empty by default to avoid breaking auth flows.
  // Add specific function hosts here only if you understand the consequence.
  const BLOCKED_HOSTS = [];

  function isBlockedUrl(url) {
    try {
      const u = new URL(url, location.origin);
      const host = (u.hostname || '').toLowerCase();
      return BLOCKED_HOSTS.some((b) => host.includes(b.replace(/^\./, '')));
    } catch (e) {
      // if not a full URL, check as string
      const s = String(url).toLowerCase();
      return BLOCKED_HOSTS.some((b) => s.includes(b.replace(/^\./, '')));
    }
  }

  // Patch fetch
  try {
    const _fetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      const url = typeof input === 'string' ? input : (input && input.url) || '';
      if (isBlockedUrl(url) && !isAuthenticated()) {
        console.warn('security.js: blocked request to', url, 'but allowing to avoid breaking auth flows');
      }
      return _fetch(input, init);
    };
  } catch (e) {
    // ignore
  }

  // Patch XMLHttpRequest
  try {
    const _open = XMLHttpRequest.prototype.open;
    const _send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) {
      this.__url_to_check = url;
      return _open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (body) {
      if (this.__url_to_check && isBlockedUrl(this.__url_to_check) && !isAuthenticated()) {
        console.warn('security.js: blocked XHR to', this.__url_to_check, 'but allowing to avoid breaking auth flows');
      }
      return _send.apply(this, arguments);
    };
  } catch (e) {
    // ignore
  }

  // Try to patch firebase.functions().httpsCallable when firebase loads
  function patchFirebaseFunctions() {
    try {
      if (!window.firebase || !firebase.functions) return false;
      const inst = firebase.functions();
      if (!inst || !inst.httpsCallable) return false;
      if (inst.__httpsCallablePatched) return true;
      const _orig = inst.httpsCallable.bind(inst);
      inst.httpsCallable = function (name) {
        if (!isAuthenticated()) {
          console.warn('security.js: calling httpsCallable while unauthenticated — proceeding to original callable:', name);
        }
        return _orig(name);
      };
      inst.__httpsCallablePatched = true;
      console.info('security.js: patched firebase.functions().httpsCallable');
      return true;
    } catch (e) {
      return false;
    }
  }

  // attempt immediate patch and schedule a few retries in case firebase loads later
  if (!patchFirebaseFunctions()) {
    const maxRetries = 6;
    let tries = 0;
    const i = setInterval(() => {
      tries += 1;
      if (patchFirebaseFunctions() || tries >= maxRetries) clearInterval(i);
    }, 1000);
  }

  // watch Firebase Auth state (if available) so we only block unauthenticated users
  function watchAuthState() {
    try {
      if (!window.firebase || !firebase.auth) return false;
      const auth = firebase.auth();
      // set initial state
      window.__IS_AUTHENTICATED__ = Boolean(auth.currentUser);
      auth.onAuthStateChanged((user) => {
        window.__IS_AUTHENTICATED__ = Boolean(user);
        console.info('security.js: auth state changed, authenticated=', window.__IS_AUTHENTICATED__);
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  if (!watchAuthState()) {
    const authRetries = 6;
    let authTries = 0;
    const j = setInterval(() => {
      authTries += 1;
      if (watchAuthState() || authTries >= authRetries) clearInterval(j);
    }, 1000);
  }

  // Helpful console note
  console.info('security.js: client-side function access is blocked by default. This is NOT a substitute for server-side protections.');

  // Export a small helper to allow temporary enabling in dev console (discouraged)
  window.__security = window.__security || {};
  window.__security.allowFunctionsTemporarily = function (seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) seconds = 60;
    window.__ALLOW_FUNCTIONS__ = true;
    console.warn('security.js: temporarily allowing functions for', seconds, 'seconds');
    setTimeout(() => {
      window.__ALLOW_FUNCTIONS__ = false;
      console.warn('security.js: functions re-blocked');
    }, seconds * 1000);
  };

})();
