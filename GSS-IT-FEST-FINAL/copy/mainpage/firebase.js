import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCyrBvpXB4533JQjWyOckGjMvo5Yrcm1sQ",
  authDomain: "global-5baef.firebaseapp.com",
  projectId: "global-5baef",
  storageBucket: "global-5baef.firebasestorage.app",
  messagingSenderId: "804612564583",
  appId: "1:804612564583:web:d9d14b654707c9b66656c2",
  measurementId: "G-7QR30TCEHG"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
