// ======================================
// STUDENT ATTENDANCE MODULE
// ======================================

console.log("Student Attendance Module Loaded");

// ======================================
// CHECK LOGIN
// ======================================

if (localStorage.getItem("loggedIn") !== "true") {

    window.location.href = "/html/login.html";

}

// ======================================
// API
// ======================================

const API = "https://student-management-system-major-1.onrender.com";

// ======================================
// LOAD PAGE
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadAttendance();

});

// ======================================
// LOAD ATTENDANCE
// ======================================

async function loadAttendance() {

    try {

        const email = localStorage.getItem("currentUser");

        if (!email) {

            alert("Student Login Required");

            window.location.href = "/html/login.html";

            return;

        }

        // ======================================
        // GET STUDENT DETAILS
        // ======================================

        const studentResponse =
            await fetch(`${API}/students/email/${email}`);

        const studentData =
            await studentResponse.json();

        console.log("Student :", studentData);

        if (!studentData.success) {

            alert("Student not found");

            return;

        }

        const student = studentData.student;

        document.getElementById("studentName").innerHTML =
            student.name;

        document.getElementById("studentRoll").innerHTML =
            student.roll;

        document.getElementById("studentDepartment").innerHTML =
            student.department;

        document.getElementById("studentYear").innerHTML =
            student.year;

        // ======================================
        // GET ATTENDANCE
        // ======================================

        const attendanceResponse =
            await fetch(`${API}/attendance/student/${student.roll}`);

        const attendanceData =
            await attendanceResponse.json();

        console.log("Attendance :", attendanceData);

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

            document.getElementById("attendancePercentage").innerHTML =
                attendanceData.summary.percentage + "%";

        }

        else {

            table.innerHTML = `

                <tr>

                    <td colspan="2">

                        No Attendance Records Found

                    </td>

                </tr>

            `;

            document.getElementById("attendancePercentage").innerHTML =
                "0%";

        }

    }

    catch (error) {

        console.log(error);

        alert("Unable to load attendance.");

    }

}