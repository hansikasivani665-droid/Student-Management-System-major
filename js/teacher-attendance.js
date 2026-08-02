// =====================================
// Teacher Attendance Module
// =====================================

console.log("Teacher Attendance Module Loaded");

// =====================================
// API
// =====================================

const API = "https://student-management-system-major-1.onrender.com";

const studentTable = document.getElementById("studentTable");
const saveButton = document.getElementById("saveAttendance");
const message = document.getElementById("message");
const attendanceDate = document.getElementById("attendanceDate");


// =====================================
// Set Today's Date
// =====================================

const today = new Date().toISOString().split("T")[0];

if (attendanceDate) {
    attendanceDate.value = today;
    attendanceDate.readOnly = true;
}


// =====================================
// Load Students
// =====================================

async function loadStudents() {

    try {

        const response = await fetch(`${API}/students`);

        const data = await response.json();

        console.log("Students:", data);

        if (data.success) {

            displayStudents(data.students);

        } else {

            studentTable.innerHTML = `
            <tr>
                <td colspan="4">No Students Found</td>
            </tr>
            `;

        }

    }

    catch (error) {

        console.error(error);

        message.style.color = "red";
        message.innerHTML = "❌ Unable to load students.";

    }

}


// =====================================
// Display Students
// =====================================

function displayStudents(students) {

    studentTable.innerHTML = "";

    students.forEach(student => {

        studentTable.innerHTML += `

        <tr>

            <td>${student.roll}</td>

            <td>${student.name}</td>

            <td>${student.department}</td>

            <td>

                <select
                    class="status"
                    data-roll="${student.roll}">

                    <option value="Present">Present</option>

                    <option value="Absent">Absent</option>

                </select>

            </td>

        </tr>

        `;

    });

}


// =====================================
// Save Attendance
// =====================================

saveButton.addEventListener("click", async () => {

    const statusList = document.querySelectorAll(".status");

    let successCount = 0;

    for (const item of statusList) {

        const roll = item.dataset.roll;
        const status = item.value;

        try {

            const response = await fetch(`${API}/attendance`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    roll,
                    status
                })

            });

            const result = await response.json();

            console.log(result);

            if (result.success) {

                successCount++;

            }

        }

        catch (error) {

            console.error(error);

        }

    }

    if (successCount === statusList.length) {

        message.style.color = "green";
        message.innerHTML =
            `✅ Attendance Saved Successfully (${successCount} Students)`;

    }

    else {

        message.style.color = "red";
        message.innerHTML =
            "❌ Some attendance records could not be saved.";

    }

});


// =====================================
// Initial Load
// =====================================

loadStudents();