import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBobUZUrjPa2yAUwbm8KLFkiGKY80SR2jg",
  authDomain: "poultry-form-7425b.firebaseapp.com",
  projectId: "poultry-form-7425b",
  storageBucket: "poultry-form-7425b.firebasestorage.app",
  messagingSenderId: "101705174558",
  appId: "1:101705174558:web:b8fb2402aaa84d2d99a80f",
  measurementId: "G-PQSN4NP300",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
