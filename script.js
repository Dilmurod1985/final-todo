const API_URL = 'https://final-todo.onrender.com/tasks';

// Загрузка задач при старте
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Ошибка сервера');
        const tasks = await response.json();
        const list = document.getElementById('todo-list');
        list.innerHTML = '';
        tasks.forEach(task => displayTask(task));
    } catch (err) {
        console.error('Сервер не отвечает:', err);
    }
}

function displayTask(task) {
    const list = document.getElementById('todo-list');
    const li = document.createElement('li');
    li.setAttribute('draggable', 'true');
    li.innerHTML = `
        <div class="task-info">
            <span class="category-label">${task.category || 'Личное'}</span>
            <span class="task-text">${task.text}</span>
        </div>
        <button class="delete-btn" onclick="deleteTask('${task._id}', this)">Удалить</button>
    `;
    li.addEventListener('dragstart', () => li.classList.add('dragging'));
    li.addEventListener('dragend', () => li.classList.remove('dragging'));
    list.appendChild(li);
}

async function addTask() {
    const input = document.getElementById('task-input');
    const category = document.getElementById('task-category').value;
    if (!input.value) return;

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.value, category: category })
    });
    const task = await response.json();
    displayTask(task);
    input.value = '';
}

async function deleteTask(id, btn) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    btn.parentElement.remove();
}

function filterTasks() {
    const query = document.getElementById('search-input').value.toLowerCase();
    document.querySelectorAll('#todo-list li').forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = text.includes(query) ? 'flex' : 'none';
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
fetchTasks();