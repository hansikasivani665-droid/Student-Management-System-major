// =====================================
// Student List Module
// =====================================

const API = window.API_BASE || window.location.origin;
const STUDENT_API = `${API}/students`;

let allStudents = [];


// =====================================
// LOGIN CHECK
// =====================================

if (localStorage.getItem("loggedIn") !== "true") {

    window.location.href = "/html/login.html";

}



// =====================================
// PAGE LOAD
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Student List Loaded");

    loadStudents();

    const search =
        document.getElementById("searchStudent");

    if (search) {

        search.addEventListener(
            "input",
            filterStudents
        );

    }

    const department =
        document.getElementById("departmentFilter");

    if (department) {

        department.addEventListener(
            "change",
            filterStudents
        );

    }

    const year =
        document.getElementById("yearFilter");

    if (year) {

        year.addEventListener(
            "change",
            filterStudents
        );

    }

});




// =====================================
// LOAD STUDENTS
// =====================================

async function loadStudents() {

    try {

        const response =
            await fetch(STUDENT_API);

        const data =
            await response.json();

        console.log("Students:", data);

        if (data.success) {

            allStudents = data.students;

            displayStudents(allStudents);

        }
        else {

            displayStudents([]);

        }

    }

    catch (error) {

        console.error("Fetch Error:", error);

        displayStudents([]);

    }

}





// =====================================
// DISPLAY STUDENTS
// =====================================

function displayStudents(students) {

    const table =
        document.getElementById("studentTableBody");

    if (!table) {

        console.error("studentTableBody not found");

        return;

    }

    if (students.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="10">

                No Students Found

            </td>

        </tr>

        `;

        return;

    }

    let rows = "";

    students.forEach((student, index) => {

        rows += `

        <tr>

            <td>${index + 1}</td>

            <td>

                <div class="student-avatar">

                    <i class="fa-solid fa-user"></i>

                </div>

            </td>

            <td>${student.name}</td>

            <td>${student.roll}</td>

            <td>${student.department}</td>

            <td>${student.year}</td>

            <td>${student.email}</td>

            <td>${student.phone}</td>

            <td>

                <span class="status-active">

                    Active

                </span>

            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editStudent(${student.id})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

    table.innerHTML = rows;

}





// =====================================
// SEARCH & FILTER
// =====================================

function filterStudents() {

    const search =
        document
            .getElementById("searchStudent")
            .value
            .toLowerCase();

    const department =
        document
            .getElementById("departmentFilter")
            .value;

    const year =
        document
            .getElementById("yearFilter")
            .value;

    const filtered =

        allStudents.filter(student => {

            const name =
                student.name.toLowerCase();

            const roll =
                student.roll.toLowerCase();

            const searchMatch =
                name.includes(search) ||
                roll.includes(search);

            const departmentMatch =
                department === "" ||
                student.department === department;

            const yearMatch =
                year === "" ||
                student.year === year;

            return (
                searchMatch &&
                departmentMatch &&
                yearMatch
            );

        });

    displayStudents(filtered);

}





// =====================================
// DELETE STUDENT
// =====================================

async function deleteStudent(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(

            `${STUDENT_API}/${id}`,

            {
                method: "DELETE"
            }

        );

        const data =
            await response.json();

        alert(data.message);

        loadStudents();

    }

    catch (error) {

        console.error("Delete Error:", error);

    }

}





// =====================================
// EDIT STUDENT
// =====================================

function editStudent(id) {

    window.location.href =
        `edit-student.html?id=${id}`;

}