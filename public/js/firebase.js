// src/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js';
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

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

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem("authUser", JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }));
  } else {
    localStorage.removeItem("authUser");
  }
});

export const db = getDatabase(app);
