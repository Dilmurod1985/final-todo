const input = document.querySelector('input');
const button = document.querySelector('button');
const ul = document.createElement('ul');
document.body.appendChild(ul);

// 1. Функция, которая сохраняет весь список в память браузера
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('li').forEach(li => tasks.push(li.textContent));
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

// 2. Функция, которая достает задачи из памяти при загрузке страницы
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('myTasks')) || [];
    savedTasks.forEach(taskText => {
        addTaskToDOM(taskText);
    });
}

// 3. Вспомогательная функция для отрисовки задачи на экране
function addTaskToDOM(text) {
    const li = document.createElement('li');
    li.textContent = text;
    li.style.color = "black";
    li.style.marginTop = "10px";
    
    // Добавим возможность удалять задачу по клику (бонус!)
    li.onclick = function() {
        li.remove();
        saveTasks(); // Пересохраняем после удаления
    };
    
    ul.appendChild(li);
}

// Логика нажатия на кнопку
button.onclick = function() {
    if (input.value !== "") {
        addTaskToDOM(input.value);
        saveTasks(); // Сохраняем новую задачу
        input.value = "";
    }
};

// Запускаем загрузку задач при старте
loadTasks();