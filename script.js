// Constants
const ANIMATION_DURATION = 300;
const LOCAL_STORAGE_KEY = 'tasks';

// Storage operations
function getTasks() {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedTasks ? JSON.parse(storedTasks).tasks : [];
}

function saveTasks(tasks) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ tasks }));
}

// Task operations
function createTask(title) {
    return {
        id: crypto.randomUUID(),
        title,
        createdAt: new Date().toISOString(),
        done: false
    };
}

function addTask(title) {
    const tasks = getTasks();
    const newTask = createTask(title);
    tasks.push(newTask);
    saveTasks(tasks);
    updateTaskList();
    return newTask;
}

function deleteTask(taskId) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        saveTasks(tasks);
        updateTaskList();
    }
}

// UI operations
function createTaskElement(task, index, animateTaskId) {
    return `
        <div class="task ${animateTaskId === task.id ? 'task-moving' : ''}" 
             data-testid="task-${index + 1}"
             data-task-id="${task.id}">
            <input type="checkbox" 
                   ${task.done ? 'checked' : ''} 
                   data-testid="task-${index + 1}-checkbox"
                   onchange="toggleTask('${task.id}')">
            <span class="task-title ${task.done ? 'done' : ''}" 
                  data-testid="task-${index + 1}-title"
                  onclick="toggleTask('${task.id}')"
                  style="cursor: pointer">${task.title}</span>
            <button class="delete-btn" 
                    data-testid="task-${index + 1}-delete"
                    onclick="deleteTask('${task.id}')">Delete</button>
        </div>
    `;
}

function updateTaskList(animateTaskId = null) {
    const taskList = document.getElementById('task-list');
    const tasks = getTasks();
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-state" data-testid="empty-state">No tasks</p>';
        return;
    }

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    taskList.innerHTML = sortedTasks
        .map((task, index) => createTaskElement(task, index, animateTaskId))
        .join('');
}

async function animateTaskCompletion(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (!taskElement) return;

    taskElement.classList.add('task-moving');
    await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION));
    
    updateTaskList(taskId);
    await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION));
    
    const newTaskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (newTaskElement) {
        newTaskElement.classList.remove('task-moving');
    }
}

function toggleTask(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.done = !task.done;
    saveTasks(tasks);
    
    if (task.done) {
        animateTaskCompletion(taskId);
    } else {
        updateTaskList();
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const input = document.getElementById('task-input');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = input.value.trim();
        if (title) {
            addTask(title);
            input.value = '';
        }
    });

    updateTaskList();
});

