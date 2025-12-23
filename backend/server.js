const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Замените этой строкой ту, что была:
mongoose.connect('mongodb+srv://dkurganbaev_db_user:TodoPass2025@cluster0.mqekpc8.mongodb.net/?appName=Cluster0')

    .then(() => console.log('✅ Успешно подключено к MongoDB Atlas'))
    .catch(err => console.error('❌ Ошибка подключения:', err));// 2. Описание модели задачи (Schema)
const TaskSchema = new mongoose.Schema({
    text: String,
    completed: { type: Boolean, default: false }
});
const Task = mongoose.model('Task', TaskSchema);

// 3. Маршруты (API)
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер на порту ${PORT}`));
const API_URL = 'http://localhost:5000/tasks';

// Функция для загрузки задач из базы при открытии страницы
async function loadTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    tasks.forEach(task => displayTask(task));
}

// Функция для отправки новой задачи на сервер
async function addTask() {
    const input = document.getElementById('todo-input');
    if (!input.value) return;

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.value })
    });
    const newTask = await res.json();
    displayTask(newTask);
    input.value = '';
}

function displayTask(task) {
    const li = document.createElement('li');
    li.textContent = task.text;
    document.getElementById('todo-list').appendChild(li);
}

loadTasks();
