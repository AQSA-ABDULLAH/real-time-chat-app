// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";  // Import Firestore functions
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA6ec24rhvLWWpnvt4tVd_Gdr5e3v8Dv-4",
  authDomain: "myproject-d70a9.firebaseapp.com",
  projectId: "myproject-d70a9",
  storageBucket: "myproject-d70a9.firebasestorage.app",
  messagingSenderId: "142517754412",
  appId: "1:142517754412:web:1b8ca8971a9e803d378f89",
  measurementId: "G-GJ172X1XW2"
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