// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";  // Import Firestore functions
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3misE-bDbMW5MSmB8ckENP5RuMCtg6Cg",
  authDomain: "myproject-d70a9.firebaseapp.com",
  projectId: "myproject-d70a9",
  storageBucket: "myproject-d70a9.firebasestorage.app",
  messagingSenderId: "142517754412",
  appId: "1:142517754412:web:54c0f17d97165390378f89",
  measurementId: "G-4LB67F3LF3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

let analytics;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}

export { app, db, storage, auth, firestore, analytics };