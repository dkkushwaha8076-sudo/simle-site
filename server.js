const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'storage/students.json');

app.use(express.json());
app.use(express.static('public'));

const readData = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

const writeData = async (data) => {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get('/api/students', async (req, res) => {
    console.log('GET /api/students');
    const students = await readData();
    res.json(students);
});

app.post('/api/students', async (req, res) => {
    console.log('POST /api/students', req.body);
    const students = await readData();
    const newStudent = {
        id: Date.now().toString(),
        name: req.body.name,
        fatherName: req.body.fatherName,
        age: req.body.age,
        height: req.body.height,
        bodyColor: req.body.bodyColor,
        grade: req.body.grade,
    };
    students.push(newStudent);
    await writeData(students);
    res.status(201).json(newStudent);
});

app.put('/api/students/:id', async (req, res) => {
    console.log(`PUT /api/students/${req.params.id}`, req.body);
    const students = await readData();
    const index = students.findIndex(s => s.id === req.params.id);
    if (index !== -1) {
        students[index] = {
            ...students[index],
            name: req.body.name,
            fatherName: req.body.fatherName,
            age: req.body.age,
            height: req.body.height,
            bodyColor: req.body.bodyColor,
            grade: req.body.grade,
        };
        await writeData(students);
        res.json(students[index]);
    } else {
        res.status(404).send('Student not found');
    }
});

app.delete('/api/students/:id', async (req, res) => {
    console.log(`DELETE /api/students/${req.params.id}`);
    let students = await readData();
    students = students.filter(s => s.id !== req.params.id);
    await writeData(students);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
