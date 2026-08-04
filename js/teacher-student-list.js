// =====================================
// Teacher Student List
// =====================================

const API = window.API_BASE || window.location.origin;

const table = document.getElementById("studentTable");
const search = document.getElementById("search");

let students = [];


async function loadStudents() {

    const teacher =
    JSON.parse(localStorage.getItem("teacher") || "null");

    if (!teacher) {

        table.innerHTML = `

        <tr>

            <td colspan="6">

                Teacher not logged in

            </td>

        </tr>

        `;

        return;

    }

    try {

        const response = await fetch(
            `${API}/teachers/${teacher.teacherId}/students`
        );

        const data = await response.json();

        console.log(data);

        if (data.success) {

            students = data.students;

            displayStudents(students);

        }

        else {

            table.innerHTML = `

            <tr>

                <td colspan="6">

                    No Students Found

                </td>

            </tr>

            `;

        }

    }

    catch (error) {

        console.error(error);

        table.innerHTML = `

        <tr>

            <td colspan="6">

                Unable to Load Students

            </td>

        </tr>

        `;

    }

}


// =====================================
// Display Students
// =====================================

function displayStudents(list) {

    table.innerHTML = "";

    if (list.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="6">

                No Students Found

            </td>

        </tr>

        `;

        return;

    }

    list.forEach(student => {

        table.innerHTML += `

        <tr>

            <td>${student.roll}</td>

            <td>${student.name}</td>

            <td>${student.department}</td>

            <td>${student.year}</td>

            <td>${student.email}</td>

            <td>${student.phone}</td>

        </tr>

        `;

    });

}


// =====================================
// Search Student
// =====================================

search.addEventListener("keyup", () => {

    const value = search.value.toLowerCase();

    const filtered = students.filter(student =>

        student.name.toLowerCase().includes(value) ||

        student.roll.toLowerCase().includes(value)

    );

    displayStudents(filtered);

});


// =====================================
// Initial Load
// =====================================

loadStudents();