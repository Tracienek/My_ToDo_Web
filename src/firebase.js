// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCoM0IAK34-oLAyMCchKm5CNN66XCSmFUo",
  authDomain: "my-to-do-e4bba.firebaseapp.com",
  databaseURL: "https://my-to-do-e4bba-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-to-do-e4bba",
  storageBucket: "my-to-do-e4bba.appspot.com",
  messagingSenderId: "778227224641",
  appId: "1:778227224641:web:acf2edd3de1d8ae5f276c0",
  measurementId: "G-CHEYKDES16"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
