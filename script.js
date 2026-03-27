const input = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const addBtn = document.getElementById("addBtn");

const lists = {
    todo: document.getElementById("todo"),
    inprogress: document.getElementById("inprogress"),
    done: document.getElementById("done")
};

// Load tasks
window.onload = () => {
    const data = JSON.parse(localStorage.getItem("tasks")) || [];
    data.forEach(t => createCard(t.text, t.priority, t.status));
};

// Create card
function createCard(text, prio, status) {
    const card = document.createElement("div");
    card.className = `card ${prio}`;
    card.draggable = true;

    // Text (editable)
    const content = document.createElement("div");
    content.textContent = text;

    content.ondblclick = () => {
        content.contentEditable = true;
        content.focus();
    };

    content.onblur = () => {
        content.contentEditable = false;
        saveTasks();
    };

    // Actions
    const actions = document.createElement("div");
    actions.className = "actions";

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => {
        card.remove();
        saveTasks();
    };

    actions.appendChild(delBtn);

    card.appendChild(content);
    card.appendChild(actions);

    // Drag events
    card.addEventListener("dragstart", () => {
        card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
        saveTasks();
    });

    lists[status].appendChild(card);
}

// Add task
addBtn.onclick = () => {
    if (!input.value.trim()) return;

    createCard(input.value, priority.value, "todo");
    saveTasks();
    input.value = "";
};

// Drag logic
Object.values(lists).forEach(list => {

    list.addEventListener("dragover", e => {
        e.preventDefault();
        list.classList.add("drag-over");

        const dragging = document.querySelector(".dragging");
        list.appendChild(dragging);
    });

    list.addEventListener("dragleave", () => {
        list.classList.remove("drag-over");
    });

    list.addEventListener("drop", () => {
        list.classList.remove("drag-over");
        saveTasks();
    });

});

// Save tasks
function saveTasks() {
    const data = [];

    Object.keys(lists).forEach(status => {
        lists[status].querySelectorAll(".card").forEach(card => {
            data.push({
                text: card.firstChild.textContent,
                priority: card.classList[1],
                status: status
            });
        });
    });

    localStorage.setItem("tasks", JSON.stringify(data));
}