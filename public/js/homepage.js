import { renderNavbar } from '../js/navbar.js';
import { auth, db } from '../js/firebase.js';
import { ref, set, push, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { taskHistoryScheduler } from '../js/taskHistoryScheduler.js';

import { renderNavbar } from '../js/navbar.js';
renderNavbar();


window.addEventListener("DOMContentLoaded", () => {
renderNavbar();

const taskInput = document.getElementById("task-input");
const deadlineInput = document.getElementById("task-deadline");
const addButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

let tasks = [];

deadlineInput.min = new Date().toISOString().split("T")[0];

function showMessage(msg) {
    const message = document.createElement("div");
    message.textContent = msg;
    message.className = "success-msg";
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
}

function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("task-item");

    const taskContent = document.createElement("div");

    const taskTitle = document.createElement("span");
    taskTitle.textContent = task.text;
    if (task.completed) {
        taskTitle.classList.add("completed");
    }

    const taskDeadline = document.createElement("small");
    taskDeadline.textContent = task.deadline ? `Due: ${task.deadline}` : "";

    if (task.deadline) {
        const deadlineDate = new Date(task.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysLeft = (deadlineDate - today) / (1000 * 60 * 60 * 24);

        if (daysLeft < 2 && daysLeft >= 0) taskDeadline.style.color = "#e67e22";
        if (daysLeft < 0) taskDeadline.style.color = "red";
    }

    taskContent.appendChild(taskTitle);
    taskContent.appendChild(taskDeadline);

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.title = "Edit this task";
    editBtn.addEventListener("click", () => {
        taskInput.value = task.text;
        deadlineInput.value = task.deadline || "";

        addButton.textContent = "Update Task";
        addButton.dataset.editing = task.id;
    });

    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "↩️" : "✅";
    completeBtn.title = task.completed ? "Mark as incomplete" : "Mark as completed";

    completeBtn.addEventListener("click", () => {
        const taskRef = ref(db, `tasks/${task.id}`);

        if (!task.completed) {
        const updatedTask = { ...task, completed: true };

        set(taskRef, updatedTask).then(() => {
            li.classList.add("completed");
            completeBtn.textContent = "↩️";
            completeBtn.title = "Mark as incomplete";
            showMessage("✅ Task will be moved to history in 10 seconds...");

            taskHistoryScheduler.schedule(updatedTask, (taskToMove) => {
            const historyRef = ref(db, `history/${taskToMove.owner}/${taskToMove.id}`);
            set(historyRef, {
                ...taskToMove,
                movedAt: new Date().toISOString()
            }).then(() => {
                set(ref(db, `tasks/${taskToMove.id}`), null).then(() => {
                showMessage("📦 Task moved to history!");
                li.remove();
                });
            });
            });

            task.completed = true;
        });

        } else {
        taskHistoryScheduler.cancel(task.id);

        const updatedTask = { ...task, completed: false };

        set(taskRef, updatedTask).then(() => {
            li.classList.remove("completed");
            completeBtn.textContent = "✅";
            completeBtn.title = "Mark as completed";
            showMessage("↩️ Move to history canceled.");
            task.completed = false;
        });
        }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.title = "Delete this task";
    deleteBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this task?")) {
        const taskRef = ref(db, `tasks/${task.id}`);
        set(taskRef, null)
            .then(() => showMessage("🗑️ Task deleted."))
            .catch((err) => {
            console.error("❌ Delete failed:", err);
            });
        }
    });

    li.appendChild(taskContent);
    li.appendChild(editBtn);
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    });
}

onAuthStateChanged(auth, (user) => {
    if (!user) {
    window.location.href = "/login.html";
    return;
    }

    const userId = user.uid;

    const tasksRef = ref(db, 'tasks');
    onValue(tasksRef, (snapshot) => {
    tasks = [];
    snapshot.forEach((child) => {
        const data = child.val();
        if (data.owner === userId) {
        tasks.push({ id: child.key, ...data });
        }
    });
    renderTasks();
    });

    addButton.addEventListener("click", () => {
    const text = taskInput.value.trim();
    const deadline = deadlineInput.value;
    const editingId = addButton.dataset.editing;

    if (text === "") return;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const selectedDate = new Date(deadline);
    selectedDate.setHours(0, 0, 0, 0);

    if (deadline && selectedDate < now) {
        alert("⛔ Deadline cannot be in the past.");
        return;
    }

    if (editingId) {
        const taskRef = ref(db, `tasks/${editingId}`);
        set(taskRef, {
        text,
        deadline,
        completed: false,
        createdAt: new Date().toISOString(),
        owner: user.uid,
        ownerEmail: user.email,
        role: "host"
        }).then(() => {
        showMessage("✏️ Task updated!");
        addButton.textContent = "Add Task";
        delete addButton.dataset.editing;
        taskInput.value = "";
        deadlineInput.value = "";
        });
        return;
    }

    const taskData = {
        text,
        deadline,
        completed: false,
        createdAt: new Date().toISOString(),
        owner: user.uid,
        ownerEmail: user.email,
        role: "host"
    };

    const newTaskRef = push(ref(db, "tasks"));
    const taskId = newTaskRef.key;

    set(newTaskRef, taskData)
        .then(() => {
        showMessage("✅ Task added successfully!");
        taskInput.value = "";
        deadlineInput.value = "";
        })
        .catch((err) => {
        console.error("❌ Failed to save task:", err);
        });
    });
});
});
