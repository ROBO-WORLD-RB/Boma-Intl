import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6X-hpaYfwa2YsT9s7yKPdeRNbcftqdnA",
  authDomain: "boma-shop.firebaseapp.com",
  projectId: "boma-shop",
  storageBucket: "boma-shop.firebasestorage.app",
  messagingSenderId: "279073203968",
  appId: "1:279073203968:web:d1ddbc9448919472ad75e5",
  measurementId: "G-3V1NZHD176"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
