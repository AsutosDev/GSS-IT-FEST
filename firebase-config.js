import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCNak07WATWzk0f_WxEC9zJY5DHpnqlkIk", // From your screenshot
  authDomain: "gss-it-fest.firebaseapp.com",
  projectId: "gss-it-fest",
  storageBucket: "gss-it-fest.firebasestorage.app",
  messagingSenderId: "108858542968",
  appId: "1:108858542968:web:3b9257ee54a187d090568d",
  measurementId: "G-EC3960N8BJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);