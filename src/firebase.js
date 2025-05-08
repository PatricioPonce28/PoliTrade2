import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyAlQv1PRwi5XDVluQgYV5IglScqYxpHlgo",
  authDomain: "politrade-24d57.firebaseapp.com",
  projectId: "politrade-24d57",
  storageBucket: "politrade-24d57.firebasestorage.app",
  messagingSenderId: "151277527695",
  appId: "1:151277527695:web:331fed8221ead9ff1786fa",
  measurementId: "G-7WNRZFL44N"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
