import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBXDOPlxr0BKY8FmTtYy3Z24vXHv0v0yFY",
  authDomain: "chowlocal2025.firebaseapp.com",
  projectId: "chowlocal2025",
  storageBucket: "chowlocal2025.firebasestorage.app",
  messagingSenderId: "1013498707959",
  appId: "1:1013498707959:web:b53949cd1d2614799a78f2",
  measurementId: "G-JQRQGDKJ4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;