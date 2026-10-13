
const input = document.getElementById("task-input");
const addButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const completedCount = document.getElementById("completed-count");
const emptyMessage = document.getElementById("empty-message");

let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("smartTasks") || "[]"
    );

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(task =>
            task &&
            typeof task.text === "string" &&
            typeof task.done === "boolean" &&
            typeof task.id === "number"
        );
    }
} catch {
    tasks = [];
}

function saveTasks() {
    try {
        localStorage.setItem("smartTasks", JSON.stringify(tasks));
    } catch {
    }
}

function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(task => {
        const item = document.createElement("li");
        item.className = task.done ? "task done" : "task";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.setAttribute("aria-label", "Mark task completed");

        checkbox.addEventListener("change", () => {
            task.done = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const text = document.createElement("span");
        text.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });

        item.append(checkbox, text, deleteButton);
        taskList.appendChild(item);
    });

    taskCount.textContent =
        tasks.length + (tasks.length === 1 ? " task" : " tasks");

    const completed = tasks.filter(task => task.done).length;
    completedCount.textContent = completed + " completed";

    emptyMessage.hidden = tasks.length > 0;
}

function addTask() {
    const text = input.value.trim();

    if (text === "") {
        input.focus();
        return;
    }

    tasks.push({
        id: Date.now() + Math.random(),
        text: text,
        done: false
    });

    saveTasks();
    renderTasks();

    input.value = "";
    input.focus();
}

addButton.addEventListener("click", addTask);

input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        addTask();
    }
});

renderTasks();
