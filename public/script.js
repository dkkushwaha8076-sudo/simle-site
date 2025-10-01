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

// Function to create a random position within the viewport
function getRandomPosition() {
    const maxX = window.innerWidth - 100; // Account for button width
    const maxY = window.innerHeight - 40; // Account for button height
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    return { x, y };
}

// Function to move an element to a random position
function moveButtonToRandomPosition(button) {
    const position = getRandomPosition();
    button.style.position = 'fixed';
    button.style.left = position.x + 'px';
    button.style.top = position.y + 'px';
    button.style.zIndex = '1000';
    button.style.transition = 'all 0.5s ease-in-out';
}

// Function to create falling flowers
function createFallingFlowers() {
    const flowerEmojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '💐', '🌿', '🍃'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const flower = document.createElement('div');
            flower.textContent = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
            flower.style.position = 'fixed';
            flower.style.left = Math.random() * window.innerWidth + 'px';
            flower.style.top = '-50px';
            flower.style.fontSize = Math.random() * 20 + 20 + 'px';
            flower.style.zIndex = '999';
            flower.style.pointerEvents = 'none';
            flower.style.animation = 'fallingFlower 3s linear forwards';
            
            document.body.appendChild(flower);
            
            // Remove flower after animation completes
            setTimeout(() => {
                if (flower.parentNode) {
                    flower.parentNode.removeChild(flower);
                }
            }, 3000);
        }, i * 200); // Stagger the flower creation
    }
}

// Add CSS animation for falling flowers
const style = document.createElement('style');
style.textContent = `
    @keyframes fallingFlower {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(${window.innerHeight + 100}px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

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

    // Add hover event listeners to all edit buttons
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            // Move the button to a random position on hover
            moveButtonToRandomPosition(this);
        });
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
