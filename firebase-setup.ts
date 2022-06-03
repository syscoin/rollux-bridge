import { initializeApp, getApp, FirebaseOptions } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  projectId: "syscoin-bridge",
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

const firebase = { firestore: getFirestore(app) };

if (process.env.NODE_ENV === "development" && !intialized) {
  connectFirestoreEmulator(firestore, "localhost", 8080);
}

export default firebase;
