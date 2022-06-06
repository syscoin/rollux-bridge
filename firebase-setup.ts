import { initializeApp, getApp, FirebaseOptions } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

let app = null;
let intialized = false;
try {
  app = getApp();
  intialized = true;
} catch (e) {
  app = initializeApp(firebaseConfig);
}

const firestore = getFirestore(app);

const firebase = {
  app,
  firestore,
};

if (process.env.NODE_ENV === "development" && !intialized) {
  connectFirestoreEmulator(firestore, "localhost", 8080);
}

export default firebase;
