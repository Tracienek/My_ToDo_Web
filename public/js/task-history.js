import { renderNavbar } from '../js/navbar.js';
import { db, auth } from '../js/firebase.js';
import { ref, onValue, remove } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();

  const completedList = document.getElementById("completed-list");
  const missedList = document.getElementById("missed-list");
  const summary = document.getElementById("history-summary");
  const clearCompletedBtn = document.getElementById("clear-completed");

  const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
  const now = new Date();

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "../html/login.html";
      return;
    }

    const userId = user.uid;
    const historyRef = ref(db, `history/${userId}`);

    let completedCount = 0;
    let missedCount = 0;

    onValue(historyRef, (snapshot) => {
      completedList.innerHTML = "";
      missedList.innerHTML = "";
      completedCount = 0;
      missedCount = 0;

      snapshot.forEach((child) => {
        const task = child.val();
        const taskId = child.key;
        const createdAt = new Date(task.createdAt);
        const deadline = task.deadline ? new Date(task.deadline) : null;
        const isRecent = (now - createdAt <= THIRTY_DAYS);

        if (!isRecent) return;

        const li = document.createElement("li");
        li.classList.add("task-item");

        const span = document.createElement("span");
        const deadlineStr = task.deadline
          ? `Due: ${new Date(task.deadline).toLocaleDateString()}`
          : "No deadline";
        span.textContent = `${task.text} (${deadlineStr})`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.title = "Delete this task from history";
        deleteBtn.addEventListener("click", () => {
          if (confirm("Delete this task from history?")) {
            remove(ref(db, `history/${userId}/${taskId}`));
          }
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);

        if (task.completed) {
          completedCount++;
          completedList.appendChild(li);
        } else if (!task.completed && deadline && deadline < now) {
          missedCount++;
          missedList.appendChild(li);
        }
      });

      updateSummary();
    });

    clearCompletedBtn.addEventListener("click", () => {
      if (confirm("Clear ALL history (completed + missed)?")) {
        remove(historyRef).then(() => {
          alert("✅ All task history cleared.");
        });
      }
    });

    function updateSummary() {
      summary.innerHTML = `
        <p><strong>✅ Completed tasks:</strong> ${completedCount}</p>
        <p><strong>⚠️ Missed tasks:</strong> ${missedCount}</p>
      `;

      if (completedCount === 0 && missedCount === 0) {
        summary.innerHTML += `<p>No task history found in the last 30 days.</p>`;
      }
    }
  });
});
