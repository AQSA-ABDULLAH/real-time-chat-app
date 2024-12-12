// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";  // Import Firestore functions
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCwndQ4rC7iOCnIL0wjG2ERVYBOwH38lx0",
    authDomain: "maazinformatics.firebaseapp.com",
    projectId: "maazinformatics",
    storageBucket: "maazinformatics.appspot.com",
    messagingSenderId: "207021978529",
    appId: "1:207021978529:web:dc2e60a4802dedad6851e0",
    measurementId: "G-C1PD3G2ECF"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

let analytics;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}

export { app, storage, auth, firestore, analytics, doc, getDoc, setDoc };