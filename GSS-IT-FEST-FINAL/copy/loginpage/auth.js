
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// TODO: Replace with your actual Firebase project configuration
// Get these from Project Settings > General in the Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Handle Signup
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Inputs are selected by ID from index.html
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("User created:", user);
        alert("Account created successfully! Switching to login...");
        
        // Switch view to Login (triggering the animation reverse provided by script.js)
        const container = document.querySelector('.hero-container');
        if(container) {
            container.classList.remove('sign-up-mode');
        }
        
        // Optional: Auto-fill login email
        document.getElementById('login-email').value = email;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Signup Error:", errorCode, errorMessage);
        alert("Error creating account: " + errorMessage);
      });
  });
}

// Handle Login
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("User logged in:", user);
        
        // Redirect to main page (Assuming relative path is correct)
        window.location.href = '../mainpage/index.html';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Login Error:", errorCode, errorMessage);
        alert("Login failed: " + errorMessage);
      });
  });
}
