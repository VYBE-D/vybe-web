// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByXXVJH9cAppnoaCAXcLHoNTdfzMStzSI",
  authDomain: "vybe-20145.firebaseapp.com",
  projectId: "vybe-20145",
  storageBucket: "vybe-20145.firebasestorage.app",
  messagingSenderId: "441268468400",
  appId: "1:441268468400:web:eaa89578ed5d47d7fb1975"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);