// ======================================
// API URL
// ======================================

const API = "https://student-management-system-major-1.onrender.com";


// ======================================
// Student Login Check
// ======================================

if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "/html/login.html";
}

let studentRoll = null;

document.addEventListener("DOMContentLoaded", () => {
    loadStudentProfile();
});


// ======================================
// STUDENT PROFILE
// ======================================

async function loadStudentProfile() {

    try {

        const email = localStorage.getItem("currentUser");

        const response = await fetch(`${API}/students/email/${email}`);

        const data = await response.json();

        if (!data.success) {
            alert("Student not found.");
            return;
        }

        const student = data.student;

        studentRoll = student.roll;

        document.getElementById("studentName").innerHTML = student.name;
        document.getElementById("studentRoll").innerHTML = student.roll;
        document.getElementById("studentDepartment").innerHTML = student.department;
        document.getElementById("studentYear").innerHTML = student.year;
        document.getElementById("studentEmail").innerHTML = student.email;
        document.getElementById("studentPhone").innerHTML = student.phone;

        loadStudentResults();
        loadStudentAttendance();

    }

    catch (error) {

        console.error("Profile Error:", error);

    }

}


// ======================================
// STUDENT RESULTS
// ======================================

async function loadStudentResults() {

    try {

        const response = await fetch(`${API}/results`);

        const data = await response.json();

        if (!data.success) return;

        const results = data.results.filter(r => r.roll === studentRoll);

        document.getElementById("totalResults").innerHTML = results.length;

        const subjects = [...new Set(results.map(r => r.subject))];

        document.getElementById("totalSubjects").innerHTML = subjects.length;

        let total = 0;

        results.forEach(r => {
            total += Number(r.marks);
        });

        const average =
            results.length > 0
                ? (total / results.length).toFixed(2)
                : 0;

        document.getElementById("averageMarks").innerHTML = average + "%";

        let highest = 0;

        results.forEach(r => {

            if (Number(r.marks) > highest) {

                highest = Number(r.marks);

            }

        });

        document.getElementById("highestMarks").innerHTML = highest;

        const failed = results.filter(r => r.status === "Fail").length;

        document.getElementById("resultStatus").innerHTML =
            failed === 0 ? "Pass" : "Fail";

        const table = document.getElementById("studentResultBody");

        table.innerHTML = "";

        results.forEach(r => {

            table.innerHTML += `
                <tr>
                    <td>${r.subject}</td>
                    <td>${r.marks}</td>
                    <td>${r.grade}</td>
                    <td>${r.status}</td>
                </tr>
            `;

        });

    }

    catch (error) {

        console.error("Result Error:", error);

    }

}


// ======================================
// ATTENDANCE
// ======================================

async function loadStudentAttendance() {

    try {

        const response = await fetch(`${API}/attendance`);

        const data = await response.json();

        if (!data.success) return;

        const attendance =
            data.attendance.filter(a => a.roll === studentRoll);

        const totalDays = attendance.length;

        const presentDays =
            attendance.filter(a => a.status === "Present").length;

        const absentDays =
            attendance.filter(a => a.status === "Absent").length;

        const percentage =
            totalDays > 0
                ? ((presentDays / totalDays) * 100).toFixed(2)
                : 0;

        document.getElementById("totalDays").innerHTML = totalDays;
        document.getElementById("presentDays").innerHTML = presentDays;
        document.getElementById("absentDays").innerHTML = absentDays;
        document.getElementById("attendancePercentage").innerHTML =
            percentage + "%";

    }

    catch (error) {

        console.error("Attendance Error:", error);

    }

}


// ======================================
// LOGOUT
// ======================================

function logout() {

    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/html/login.html";

}