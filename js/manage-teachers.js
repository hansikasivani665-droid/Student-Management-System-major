// ======================================
// MANAGE TEACHERS
// ======================================

if (localStorage.getItem("loggedIn") !== "true") {

    location.href = "/html/login.html";

}

const API = `${window.API_BASE || window.location.origin}/teachers`;

const form = document.getElementById("teacherForm");
const table = document.getElementById("teacherTable");

document.addEventListener(
    "DOMContentLoaded",
    loadTeachers
);

// ======================================
// ADD TEACHER
// ======================================

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const teacher = {

            teacherId:
                document.getElementById("teacherEmployeeId").value.trim(),

            name:
                document.getElementById("teacherName").value.trim(),

            email:
                document.getElementById("teacherEmail").value.trim(),

            department:
                document.getElementById("teacherDepartment").value.trim(),

            subject:
                document.getElementById("teacherSubject").value.trim(),

            phone:
                document.getElementById("teacherPhone").value.trim(),

            qualification: "",

            experience: "",

            password: "Teacher@123"

        };

        // Validation

        if (
            !teacher.teacherId ||
            !teacher.name ||
            !teacher.email ||
            !teacher.department ||
            !teacher.phone
        ) {

            alert("Please fill all required fields.");
            return;

        }

        if (!/^[0-9]{10}$/.test(teacher.phone)) {

            alert("Phone number must contain exactly 10 digits.");
            return;

        }

        try {

            const response = await fetch(API, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(teacher)

            });

            const data = await response.json();

            if (!response.ok || !data.success) {

                alert(data.message || "Failed to add teacher");
                return;

            }

            alert("Teacher Added Successfully");

            form.reset();

            loadTeachers();

        }

        catch (error) {

            console.error(error);

            alert("Server connection failed.");

        }

    }
);

// ======================================
// LOAD TEACHERS
// ======================================

async function loadTeachers() {

    try {

        const response = await fetch(API);

        const data = await response.json();

        table.innerHTML = "";

        if (!data.success) return;

        data.teachers.forEach(t => {

            table.innerHTML += `

<tr>

<td>${t.teacherId}</td>

<td>${t.name}</td>

<td>${t.email}</td>

<td>${t.department}</td>

<td>${t.subject || "-"}</td>

<td>${t.phone}</td>

<td>

<button class="delete"
onclick="deleteTeacher(${t.id})">

Delete

</button>

</td>

</tr>

`;

        });

    }

    catch (error) {

        console.error(error);

    }

}

// ======================================
// DELETE TEACHER
// ======================================

async function deleteTeacher(id) {

    if (!confirm("Delete Teacher?")) return;

    try {

        await fetch(`${API}/${id}`, {

            method: "DELETE"

        });

        loadTeachers();

    }

    catch (error) {

        console.error(error);

    }

}

// ======================================
// SEARCH
// ======================================

document
.getElementById("searchTeacher")
.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    document
    .querySelectorAll("#teacherTable tr")
    .forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(value)
                ? ""
                : "none";

    });

});