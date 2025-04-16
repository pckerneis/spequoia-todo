// Get tasks from local storage
function getTasks() {
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
function addTask(title) {
    const tasks = getTasks();
    const newTask = createTask(title);
    tasks.push(newTask);
    saveTasks(tasks);
    updateTaskList();
    return newTask;
}

// Initialize task list if empty
function updateTaskList() {
    const taskList = document.getElementById('task-list');
    const tasks = getTasks();
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-state" data-testid="empty-state">No tasks</p>';
        return;
    }

    // Sort tasks by creation date (oldest first)
    const sortedTasks = [...tasks].sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
    });

    taskList.innerHTML = sortedTasks.map((task, index) => `
        <div class="task" data-testid="task-${index + 1}">
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
    `).join('');
}

// Toggle task completion status
function toggleTask(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.done = !task.done;
        saveTasks(tasks);
        updateTaskList();
    }
}

// Delete a task
function deleteTask(taskId) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        saveTasks(tasks);
        updateTaskList();
    }
}

// Initialize when DOM is loaded
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

