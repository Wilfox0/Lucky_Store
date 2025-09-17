// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDFEQYcYRC_A_Lpe4iSlzbe9NNEwxqpBQI",
  authDomain: "lacky-store.firebaseapp.com",
  projectId: "lacky-store",
  storageBucket: "lacky-store.appspot.com",
  messagingSenderId: "715637340163",
  appId: "1:715637340163:web:5c54c5494bddec1f9c3636"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
