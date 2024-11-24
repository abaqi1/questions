// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// import { 
//     FIREBASE_API_KEY,
//     FIREBASE_AUTH_DOMAIN,
//     FIREBASE_PROJECT_ID,
//     FIREBASE_STORAGE_BUCKET,
//     FIREBASE_MESSAGING_SENDER_ID,
//     FIREBASE_APP_ID
// } from '@env';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBlwjzm7FSKp-kg7khiEMP4H04KIImlLbI",
    authDomain: "ariapp-9ec5b.firebaseapp.com",
    projectId: "ariapp-9ec5b",
    storageBucket: "ariapp-9ec5b.firebasestorage.app",
    messagingSenderId: "1084398831066",
    appId: "1:1084398831066:web:03bb81f427cfbd3c642ce3"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);