const form = document.getElementById('student-form');
const studentIdInput = document.getElementById('student-id');
const studentNameInput = document.getElementById('student-name');
const studentFatherNameInput = document.getElementById('student-father-name');
const studentAgeInput = document.getElementById('student-age');
const studentHeightInput = document.getElementById('student-height');
const studentBodyColorInput = document.getElementById('student-body-color');
const studentGradeInput = document.getElementById('student-grade');
const studentTableBody = document.querySelector('#student-table tbody');

const apiUrl = '/api/students';

const fetchStudents = async () => {
    const response = await fetch(apiUrl);
    const students = await response.json();
    studentTableBody.innerHTML = '';
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.fatherName}</td>
            <td>${student.age}</td>
            <td>${student.height}</td>
            <td>${student.bodyColor}</td>
            <td>${student.grade}</td>
            <td>
                <button class="edit-button" onclick="editStudent('${student.id}', '${student.name}', '${student.fatherName}', '${student.age}', '${student.height}', '${student.bodyColor}', '${student.grade}')">Edit</button>
                <button class="delete-button" onclick="deleteStudent('${student.id}')">Delete</button>
            </td>
        `;
        studentTableBody.appendChild(row);
    });
};

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = studentIdInput.value;
    const name = studentNameInput.value;
    const fatherName = studentFatherNameInput.value;
    const age = studentAgeInput.value;
    const height = studentHeightInput.value;
    const bodyColor = studentBodyColorInput.value;
    const grade = studentGradeInput.value;

    if (id) {
        // Update existing student
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, fatherName, age, height, bodyColor, grade }),
        });
    } else {
        // Create new student
        await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, fatherName, age, height, bodyColor, grade }),
        });
    }

    fetchStudents();
    form.reset();
    studentIdInput.value = '';
});

const editStudent = (id, name, fatherName, age, height, bodyColor, grade) => {
    studentIdInput.value = id;
    studentNameInput.value = name;
    studentFatherNameInput.value = fatherName;
    studentAgeInput.value = age;
    studentHeightInput.value = height;
    studentBodyColorInput.value = bodyColor;
    studentGradeInput.value = grade;
};

const deleteStudent = async (id) => {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    });
    fetchStudents();
};

fetchStudents();
