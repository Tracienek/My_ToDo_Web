import { auth } from '../js/firebase.js';
import { EmailAuthProvider, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import {
    updateProfile,
    updatePassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

window.addEventListener("DOMContentLoaded", () => {
    renderNavbar();
    
    let currentUser;
    const viewMode = document.getElementById("view-mode");
    const editMode = document.getElementById("edit-mode");
    const avatarPreview = document.getElementById("avatar-preview");

    function toggleEdit(editing) {
        viewMode.style.display = editing ? "none" : "block";
        editMode.style.display = editing ? "block" : "none";
    }

    function cancelEdit() {
        toggleEdit(false);
        loadProfile();
    }

    function previewImage() {
        const file = document.getElementById("avatarFile").files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            avatarPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
        }
    }

    function loadProfile() {
        document.getElementById("username-display").textContent = currentUser.displayName || "(no name)";
        document.getElementById("email-display").textContent = currentUser.email;
        const profile = JSON.parse(localStorage.getItem("userProfile")) || {};
        document.getElementById("birth-display").textContent = profile.birth || "(not set)";
        document.getElementById("gender-display").textContent = profile.gender || "(not set)";
        avatarPreview.src = profile.avatar || "assets/default-avatar.png";
        document.getElementById("username").value = currentUser.displayName || "";
        document.getElementById("birth").value = profile.birth || "";
        document.getElementById("gender").value = profile.gender || "";
    }

    document.getElementById("edit-mode").addEventListener("submit", function(e) {
        e.preventDefault();
        const file = document.getElementById("avatarFile").files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            saveProfile(e.target.result);
        };
        reader.readAsDataURL(file);
        } else {
        const profile = JSON.parse(localStorage.getItem("userProfile")) || {};
        saveProfile(profile.avatar || "https://via.placeholder.com/100");
        }
    });

    function saveProfile(avatarData) {
        const newDisplayName = document.getElementById("username").value.trim();
        const newBirth = document.getElementById("birth").value;
        const newGender = document.getElementById("gender").value;
        const newPassword = document.getElementById("password").value.trim();

        updateProfile(currentUser, {
        displayName: newDisplayName
        });

        if (newPassword) {
        const currentPassword = document.getElementById("currentPassword").value.trim();
        if (!currentPassword) {
            alert("❌ Please enter your current password to change to a new one.");
            return;
        }

        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);

        reauthenticateWithCredential(currentUser, credential)
            .then(() => {
            return updatePassword(currentUser, newPassword);
            })
            .then(() => {
            alert("✅ Password updated!");
            })
            .catch((error) => {
            alert("❌ Password update failed: " + error.message);
            });
        }

        const profile = {
        birth: newBirth,
        gender: newGender,
        avatar: avatarData
        };
        localStorage.setItem("userProfile", JSON.stringify(profile));

        alert("✅ Profile updated!");
        toggleEdit(false);
        loadProfile();
    }

    onAuthStateChanged(auth, (user) => {
        if (!user) {
        alert("⚠️ Please login first.");
        window.location.href = "/login.html";
        } else {
        currentUser = user;
        loadProfile();
        }
    });

    window.toggleEdit = toggleEdit;
    window.cancelEdit = cancelEdit;
});