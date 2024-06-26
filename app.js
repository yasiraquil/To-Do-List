// Selectors
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const limitMessage = document.getElementById('limit-message');
const celebration = document.getElementById('celebration');
const confettiContainer = document.querySelector('.confetti-container');

const MAX_TASKS = 10; // Set maximum number of tasks

// Event listeners
todoForm.addEventListener('submit', addTask);
todoList.addEventListener('click', handleTaskActions);
document.addEventListener('DOMContentLoaded', displayTasksFromStorage);

// Functions
function addTask(event) {
    event.preventDefault();
    const taskText = todoInput.value.trim();

    if (taskText !== '' && todoList.childElementCount < MAX_TASKS) {
        const task = createTaskElement(taskText);
        todoList.appendChild(task);
        saveTaskToStorage(taskText);
        todoInput.value = '';
        limitMessage.classList.add('hidden');
        checkAllTasksCompleted();
    } else if (todoList.childElementCount >= MAX_TASKS) {
        limitMessage.classList.remove('hidden');
    }
}

function createTaskElement(taskText) {
    const li = document.createElement('li');
    li.textContent = taskText;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';

    const completeButton = document.createElement('button');
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.className = 'complete-btn';
    buttonContainer.appendChild(completeButton);

    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.className = 'edit-btn';
    buttonContainer.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.className = 'delete-btn';
    buttonContainer.appendChild(deleteButton);

    // Move buttons to the right
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.justifyContent = 'space-between';

    li.appendChild(buttonContainer);

    // Complete button click to mark task as completed
    completeButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent triggering li dblclick event
        li.classList.toggle('completed');
        checkAllTasksCompleted();
    });

    // Edit button click to edit task
    editButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent triggering li dblclick event
        const newText = prompt('Edit task:', taskText);
        if (newText !== null && newText.trim() !== '') {
            li.textContent = newText;
            saveEditedTaskToStorage(taskText, newText);
            li.appendChild(buttonContainer); // Re-add buttons after editing
        }
    });

    // Delete button click to delete task
    deleteButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent triggering li dblclick event
        deleteTask(li);
        limitMessage.classList.add('hidden'); // Hide the message when a task is deleted
        checkAllTasksCompleted(); // Check if all tasks are completed after deletion
    });

    return li;
}

function handleTaskActions(event) {
    if (event.target.classList.contains('delete-btn')) {
        const task = event.target.parentElement.parentElement;
        deleteTask(task);
        limitMessage.classList.add('hidden'); // Hide the message when a task is deleted
        checkAllTasksCompleted(); // Check if all tasks are completed after deletion
    }
}

function deleteTask(task) {
    removeFromStorage(task.textContent);
    task.remove();
}

function saveTaskToStorage(taskText) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.push(taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveEditedTaskToStorage(oldText, newText) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    const index = tasks.indexOf(oldText);
    if (index !== -1) {
        tasks[index] = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function displayTasksFromStorage() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.forEach(function(taskText) {
        const task = createTaskElement(taskText);
        todoList.appendChild(task);
    });
}

function removeFromStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(function(task) {
        return task !== taskText;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function checkAllTasksCompleted() {
    const tasks = todoList.getElementsByTagName('li');
    let allCompleted = true;
    for (let task of tasks) {
        if (!task.classList.contains('completed')) {
            allCompleted = false;
            break;
        }
    }

    if (allCompleted && tasks.length > 0) {
        showCelebration();
    } else {
        hideCelebration();
    }
}

function showCelebration() {
    celebration.classList.remove('hidden');
    createConfetti();
}

function hideCelebration() {
    celebration.classList.add('hidden');
    confettiContainer.innerHTML = ''; // Clear confetti
}

function createConfetti() {
    const confettiColors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-piece');
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 3}s`;
        confettiContainer.appendChild(confetti);
    }
}

// Selectors
const dateTimeElement = document.getElementById('date-time');

// Display current date, day, hour, and minute
function displayDateTime() {
    const now = new Date();
    
    // Options for formatting date and time
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const dateTimeString = now.toLocaleDateString('en-US', options);
    
    dateTimeElement.textContent = dateTimeString;
}

// Update date and time every second
setInterval(displayDateTime, 1000);

// Initial display
displayDateTime();

