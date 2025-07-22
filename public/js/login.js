// src/login.js

import { auth } from "../js/firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("⛔ Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Login successful!");

      window.location.href = "../html/homepage.html";
    } catch (error) {
      console.error("Login error:", error);
      alert(`❌ Login failed: ${error.message}`);
    }
  });
});
