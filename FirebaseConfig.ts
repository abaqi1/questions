import dotenv from 'dotenv';
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

// Uncomment and Comment this to Connect to emulators
// Using a more reliable way to detect if we should use emulators
const useEmulator = true; // You can toggle this based on your needs

if (useEmulator) {
    // Connect to Firestore emulator
    try {
        connectFirestoreEmulator(FIREBASE_DB, '127.0.0.1', 8080);
        console.log('Connected to Firestore emulator');
    } catch (error) {
        console.error('Failed to connect to Firestore emulator:', error);
    }

    // Connect to Auth emulator
    try {
        connectAuthEmulator(FIREBASE_AUTH, 'http://127.0.0.1:9099');
        console.log('Connected to Auth emulator');
    } catch (error) {
        console.error('Failed to connect to Auth emulator:', error);
    }
}