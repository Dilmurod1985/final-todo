const API_URL = 'http://localhost:5000/tasks';

// 1. Загрузка задач из базы при открытии сайта
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        const list = document.getElementById('todo-list');
        list.innerHTML = ''; 
        tasks.forEach(task => displayTask(task));
    } catch (err) {
        console.error("Сервер не отвечает:", err);
    }
}

// 2. Отправка новой задачи на сервер
async function addTask() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (!text) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const newTask = await response.json();
        displayTask(newTask);
        input.value = '';
    } catch (err) {
        alert("Ошибка при сохранении задачи!");
    }
}

function displayTask(task) {
    const list = document.getElementById('todo-list');
    const li = document.createElement('li');
    li.textContent = task.text;
    list.appendChild(li);
}

loadTasks();