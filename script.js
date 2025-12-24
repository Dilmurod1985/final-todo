const API_URL = 'https://final-todo.onrender.com/tasks';

// Загрузка всех задач
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

// Добавление задачи
async function addTask() {
    const input = document.getElementById('task-input');
    const categorySelect = document.getElementById('task-category');
    
    if (!input || !input.value) return;

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            text: input.value, 
            category: categorySelect.value 
        })
    });
    const task = await response.json();
    displayTask(task);
    input.value = '';
}

// Отображение задачи
function displayTask(task) {
    const list = document.getElementById('todo-list');
    const li = document.createElement('li');
    li.setAttribute('draggable', 'true'); // Разрешаем перетаскивание
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
        <div class="task-info">
            <span class="category-label">${task.category || 'Личное'}</span>
            <span class="task-text" onclick="toggleTask('${task._id}', this)">${task.text}</span>
        </div>
        <button class="delete-btn" onclick="deleteTask('${task._id}', this)">Удалить</button>
    `;

    // События перетаскивания
    li.addEventListener('dragstart', () => li.classList.add('dragging'));
    li.addEventListener('dragend', () => li.classList.remove('dragging'));

    list.appendChild(li);
}

// Удаление (ТЕПЕРЬ БУДЕТ РАБОТАТЬ!)
async function deleteTask(id, buttonElement) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            buttonElement.closest('li').remove();
        }
    } catch (err) {
        console.error("Ошибка удаления:", err);
    }
}

// Выполнение
async function toggleTask(id, textElement) {
    await fetch(`${API_URL}/${id}`, { method: 'PATCH' });
    textElement.closest('li').classList.toggle('completed');
}

// Редактирование
async function editTask(id, textElement) {
    const newText = prompt("Изменить задачу:", textElement.innerText);
    if (newText && newText !== textElement.innerText) {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: newText })
        });
        textElement.innerText = newText;
    }
}
/// Улучшенная функция поиска (по тексту и категориям)
function filterTasks() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    const allTasks = document.querySelectorAll('#todo-list li');

    allTasks.forEach(li => {
        const taskText = li.querySelector('.task-text').innerText.toLowerCase();
        // Находим текст категории (он у нас в span с классом category-label или category-tag)
        const categoryText = li.querySelector('.task-info span:first-child').innerText.toLowerCase();
        
        // Если запрос совпадает с текстом ИЛИ с категорией — показываем задачу
        if (taskText.includes(searchText) || categoryText.includes(searchText)) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
}
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-toggle');
    
    body.classList.toggle('dark-mode');
    
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light'); // Сохраняем выбор
    btn.innerText = isDark ? "☀️ Светлая тема" : "🌙 Темная тема";
}

// Добавь это в самый конец script.js, чтобы тема грузилась при старте
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('theme-toggle').innerText = "☀️ Светлая тема";
}
const list = document.getElementById('todo-list');

list.addEventListener('dragover', e => {
    e.preventDefault(); // Разрешаем сброс
    const draggingItem = document.querySelector('.dragging');
    const siblings = [...list.querySelectorAll('li:not(.dragging)')];

    // Находим элемент, перед которым нужно вставить наш "груз"
    const nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });

    list.insertBefore(draggingItem, nextSibling);
});
// Запуск при загрузке страницы
loadTasks();
