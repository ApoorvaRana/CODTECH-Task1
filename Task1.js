const newTaskInput = document.getElementById('new-task');
const taskDateInput = document.getElementById('task-date');
const taskTimeInput = document.getElementById('task-time');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = [];
let filter = 'all';
renderTasks();
addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

function addTask() {
    const taskText = newTaskInput.value.trim();
    const taskDate = taskDateInput.value;
    const taskTime = taskTimeInput.value;
    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            date: taskDate,
            time: taskTime,
        };
        tasks.push(task);
        clearInputs();
        renderTasks();
    }
}

function clearInputs() {
    newTaskInput.value = "";
    taskDateInput.value = "";
    taskTimeInput.value = "";
}
function renderTasks() {
    taskList.innerHTML = "";
    const now = new Date();
    tasks
        .filter(task => {
            const taskDateTime = new Date(`${task.date}T${task.time}`);
            switch (filter) {
                case 'active':
                    return !task.completed && taskDateTime >= now;
                case 'completed':
                    return task.completed;
                case 'incomplete':
                    return !task.completed && taskDateTime < now;
                default:
                    return true;
            }
        }).forEach(task => createTaskElement(task));
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
        <strong>${task.text}</strong><br>
        <div class="task-info">
            <span>Deadline:</span>
            <span>Date: ${task.date}</span>
            <span>Time: ${task.time}</span>
        </div>
        <div>
            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
            <button onclick="toggleComplete(${task.id})">Done</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
    taskList.appendChild(li);
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    const newText = prompt('Edit task:', task.text);
    const newDate = prompt('Edit date (YYYY-MM-DD):', task.date);
    const newTime = prompt('Edit time (HH:MM):', task.time);
    if (newText !== null) {
        task.text = newText;
        task.date = newDate;
        task.time = newTime;
        renderTasks();
    }
}

function toggleComplete(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    renderTasks();
}
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filter = btn.id.split('-')[1];
        renderTasks();
    });
});
