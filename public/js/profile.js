import { auth } from '../js/firebase.js';
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { renderNavbar } from '../js/navbar.js';

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

    const avatar = profile.avatar || "/assets/default-avatar.png";
    avatarPreview.src = avatar;

    // Form edit
    document.getElementById("username").value = currentUser.displayName || "";
    document.getElementById("birth").value = profile.birth || "";
    document.getElementById("gender").value = profile.gender || "";
  }

  document.getElementById("edit-mode").addEventListener("submit", function (e) {
    e.preventDefault();
    const file = document.getElementById("avatarFile").files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        saveProfile(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      // ✅ Lấy ảnh hiện đang hiển thị (nếu không chọn ảnh mới)
      saveProfile(avatarPreview.src || "/assets/default-avatar.png");
    }
  });

  async function saveProfile(avatarData) {
    const newDisplayName = document.getElementById("username").value.trim();
    const newBirth = document.getElementById("birth").value;
    const newGender = document.getElementById("gender").value;
    const newPassword = document.getElementById("password").value.trim();
    const currentPassword = document.getElementById("currentPassword").value.trim();

    try {
      if (newDisplayName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: newDisplayName });
      }

      if (newPassword) {
        if (!currentPassword) {
          alert("❌ Please enter your current password to change to a new one.");
          return;
        }
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPassword);
        alert("✅ Password updated!");
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
    } catch (err) {
      alert("❌ Error updating profile: " + err.message);
    }
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
  window.previewImage = previewImage;
});
