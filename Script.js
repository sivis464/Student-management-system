let students = JSON.parse(
    localStorage.getItem("students") || "[]"
);

let editIndex = -1;

const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");

function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}

function displayStudents(filter = "") {
    studentList.replaceChildren();

    const searchText = filter.toLowerCase();

    students.forEach((student, index) => {
        const values = [
            student.name,
            student.roll,
            student.department,
            student.email
        ];

        if (!values.some(value =>
            value.toLowerCase().includes(searchText)
        )) return;

        const row = document.createElement("tr");

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", () => editStudent(index));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => deleteStudent(index));

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);

        studentList.appendChild(row);
    });

    document.getElementById("totalStudents").textContent =
        students.length;
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const student = {
        name: document.getElementById("name").value.trim(),
        roll: document.getElementById("roll").value.trim(),
        department: document.getElementById("department").value.trim(),
        email: document.getElementById("email").value.trim()
    };

    if (students.some((s, i) =>
        s.roll.toLowerCase() === student.roll.toLowerCase()
        && i !== editIndex
    )) {
        alert("This Roll Number already exists!");
        return;
    }

    if (editIndex === -1) {
        students.push(student);
    } else {
        students[editIndex] = student;
        editIndex = -1;
        document.getElementById("submitBtn").textContent = "Add Student";
    }

    saveData();
    displayStudents();
    form.reset();
});

function editStudent(index) {
    const student = students[index];

    document.getElementById("name").value = student.name;
    document.getElementById("roll").value = student.roll;
    document.getElementById("department").value = student.department;
    document.getElementById("email").value = student.email;

    editIndex = index;
    document.getElementById("submitBtn").textContent = "Update Student";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteStudent(index) {
    if (confirm("Are you sure you want to delete this student?")) {
        students.splice(index, 1);
        saveData();
        displayStudents(
            document.getElementById("search").value
        );
    }
}

document.getElementById("search").addEventListener("input", function() {
    displayStudents(this.value);
});

displayStudents();
