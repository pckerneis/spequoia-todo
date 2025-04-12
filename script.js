// Get tasks from local storage
export function getTasks() {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks).tasks : [];
}

// Save tasks to local storage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify({ tasks }));
}

// Create a new task
function createTask(title) {
    return {
        id: crypto.randomUUID(),
        title,
        createdAt: new Date().toISOString(),
        done: false
    };
}

// Add a new task
export function addTask(title) {
    const tasks = getTasks();
    const newTask = createTask(title);
    tasks.push(newTask);
    saveTasks(tasks);
    updateTaskList();
    return newTask;
}

// Initialize task list if empty
export function updateTaskList() {
    const taskList = document.getElementById('task-list');
    const tasks = getTasks();
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-state" data-testid="empty-state">No tasks</p>';
        return;
    }

    // Sort tasks by creation date (newest first) and completion status
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    taskList.innerHTML = sortedTasks.map((task, index) => `
        <div class="task" data-testid="task-${index + 1}">
            <input type="checkbox" 
                   ${task.done ? 'checked' : ''} 
                   data-testid="task-${index + 1}-checkbox">
            <span class="task-title ${task.done ? 'done' : ''}" 
                  data-testid="task-${index + 1}-title">${task.title}</span>
            <button class="delete-btn" data-testid="task-${index + 1}-delete">Delete</button>
        </div>
    `).join('');
}

// Initialize when DOM is loaded
if (typeof document !== 'undefined') {
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
}
