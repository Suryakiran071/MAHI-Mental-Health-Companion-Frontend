import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkvzbDgkLsVTcNqwEP3RKJw5f7mL6bS3I",
  authDomain: "mahi-82b54.firebaseapp.com",
  projectId: "mahi-82b54",
  storageBucket: "mahi-82b54.firebasestorage.app",
  messagingSenderId: "130470296789",
  appId: "1:130470296789:web:b53f57a0d1fe2e1e08365c",
  measurementId: "G-VN0TYC1Q67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and Google provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
const db = getFirestore(app); // Firestore initialization

export { auth, googleProvider, db }; // Export db for Firestore usage
