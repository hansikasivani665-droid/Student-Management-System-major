// ===============================
// CHECK LOGIN
// ===============================

if (localStorage.getItem("loggedIn") !== "true") {

    window.location.href = "/html/login.html";

}


// ===============================
// API
// ===============================

const API = "https://student-management-system-major-1.onrender.com";


// ===============================
// LOAD PAGE
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadAttendance();

});


// ===============================
// LOAD ATTENDANCE
// ===============================

async function loadAttendance() {

    try {

        const email = localStorage.getItem("currentUser");

        // Get Student Details

        const studentResponse =
            await fetch(`${API}/students/email/${email}`);

        const studentData =
            await studentResponse.json();

        console.log(studentData);

        if (!studentData.success) {

            alert("Student not found");

            return;

        }

        const roll =
            studentData.student.roll;


        // Get Attendance

        const attendanceResponse =
            await fetch(`${API}/attendance/student/${roll}`);

        const attendanceData =
            await attendanceResponse.json();

        console.log(attendanceData);

        const table =
            document.getElementById("attendanceTable");

        table.innerHTML = "";

        if (
            attendanceData.success &&
            attendanceData.attendance.length > 0
        ) {

            attendanceData.attendance.forEach(record => {

                table.innerHTML += `

                <tr>

                    <td>${record.date}</td>

                    <td>${record.status}</td>

                </tr>

                `;

            });

        }

        else {

            table.innerHTML = `

            <tr>

                <td colspan="2">

                    No Attendance Records Found

                </td>

            </tr>

            `;

        }

    }

    catch (error) {

        console.error(error);

    }

}