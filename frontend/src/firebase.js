// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyApzT_rG0R6JhsXTsMG8bYz7ubjyItcg4k",
    authDomain: "zeroshift.firebaseapp.com",
    projectId: "zeroshift",
    storageBucket: "zeroshift.firebasestorage.app",
    messagingSenderId: "1018028619849",
    appId: "1:1018028619849:web:cf504437239e6b7b2a2798",
    measurementId: "G-VNQRZ75GZD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);