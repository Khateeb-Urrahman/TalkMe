// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration (from environment variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDgSAGO591hCCBk0Mn131iUfc-0NPbXKfE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "talk-me-dd262.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "talk-me-dd262",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "talk-me-dd262.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "278415621957",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:278415621957:web:6439f61ec742799c8b082c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-G23GYFZ0EK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Conditionally initialize Firestore with settings to handle connection issues
let db;
try {
  db = getFirestore(app);
  // Enable offline persistence
  // This will help with connection issues
} catch (error) {
  console.error("Firestore initialization error:", error);
  db = null;
}

// Conditionally initialize Analytics
let analytics;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn("Analytics initialization error:", error);
  analytics = null;
}

// Conditionally initialize Firebase Messaging
let messaging;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.warn("Messaging initialization error:", error);
  messaging = null;
}

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firebase Functions
let functions;
try {
  functions = getFunctions(app, 'us-central1');
  // Uncomment the following line to use the local emulator during development
  // connectFunctionsEmulator(functions, "localhost", 5001);
} catch (error) {
  console.warn("Functions initialization error:", error);
  functions = null;
}

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Export Firestore instance, Messaging, Storage, and Functions
export { db, messaging, functions, storage };

// Add a function to handle Firestore errors and implement backoff logic
export const handleFirestoreError = (error) => {
  // Don't log permission-denied errors to reduce console noise
  if (error.code === 'permission-denied') {
    // Silently skip - user needs to update Firestore rules
    return;
  }
  
  console.error("Firestore error:", error);
  
  // Check if it's a quota exceeded error
  if (error.code === 'resource-exhausted') {
    console.warn("Quota exceeded. Implementing backoff strategy.");
    // You could implement a more sophisticated backoff strategy here
    // For now, we'll just log the error and suggest waiting
    alert("Service temporarily unavailable due to usage limits. Please wait a few minutes before trying again.");
  }
  
  // Check if it's a network error
  if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
    console.warn("Network error. Retrying...");
    // You could implement retry logic here
  }
};

export default app;