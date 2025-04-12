// Initialize task list container
const taskList = document.getElementById('task-list');

// Show initial state
updateTaskList();

// Initialize task list if empty
function updateTaskList() {
    const tasks = getTasks();
    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="empty-state">No tasks</p>';
    }
}

// Get tasks from local storage
function getTasks() {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks).tasks : [];
}
