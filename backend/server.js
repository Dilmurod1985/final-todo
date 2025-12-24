const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к базе
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Успешно подключено к MongoDB Atlas'))
    .catch(err => console.error('❌ Ошибка подключения:', err));

// 1. Сначала СХЕМА
const TaskSchema = new mongoose.Schema({
    text: String,
    completed: { type: Boolean, default: false },
    category: { type: String, default: 'Личное' }
});

// 2. Затем МОДЕЛЬ (строго один раз)
const Task = mongoose.model('Task', TaskSchema);

// МАРШРУТЫ (API)
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
});

app.patch('/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task) {
        task.completed = !task.completed;
        await task.save();
    }
    res.json(task);
});

app.put('/tasks/:id', async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id, 
        { text: req.body.text }, 
        { new: true }
    );
    res.json(updatedTask);
});

app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Удалено' });
});
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));