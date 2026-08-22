# Itinerary

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

The provided rules require an authenticated Firebase session, but possession
of the shared URL grants access to its trip. Add explicit user membership and
stricter rules before using the app for sensitive travel information.