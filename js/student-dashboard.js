// =====================================================
// STUDENT DASHBOARD
// =====================================================

const API = "https://student-management-system-major-1.onrender.com";
console.log("Student Dashboard JS Loaded");
console.log("Current User:", localStorage.getItem("currentUser"));

// ======================================
// LOGIN CHECK
// ======================================

if (localStorage.getItem("loggedIn") !== "true") {

    window.location.href = "/html/login.html";

}

let studentRoll = "";


// ======================================
// PAGE LOAD
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadStudentProfile();

});


// ======================================
// LOAD STUDENT PROFILE
// ======================================

async function loadStudentProfile() {

    try {

        const email = localStorage.getItem("currentUser");

        if (!email) {

            alert("Login expired.");

            localStorage.clear();

            window.location.href = "/html/login.html";

            return;

        }


        const response =
            await fetch(`${API}/students/email/${email}`);


        const data =
            await response.json();


        console.log("Student Profile :", data);


        if (!data.success) {

            alert("Student not found.");

            return;

        }


        const student = data.student;

        studentRoll = student.roll;


        document.getElementById("studentName").innerHTML =
            student.name;

        document.getElementById("studentRoll").innerHTML =
            student.roll;

        document.getElementById("studentDepartment").innerHTML =
            student.department;

        document.getElementById("studentYear").innerHTML =
            student.year;

        document.getElementById("studentEmail").innerHTML =
            student.email;

        document.getElementById("studentPhone").innerHTML =
            student.phone;


        // Load remaining data

        loadStudentResults();

        loadStudentAttendance();

    }

    catch (error) {

        console.error("Profile Error :", error);

    }

}

// ======================================
// LOAD STUDENT RESULTS
// ======================================

async function loadStudentResults() {

    try {

        const response =
            await fetch(`${API}/results`);

        const data =
            await response.json();

        console.log("Results :", data);

        if (!data.success) return;

        const results =
            data.results.filter(r => r.roll === studentRoll);

        document.getElementById("totalResults").innerHTML =
            results.length;

        const subjects =
            [...new Set(results.map(r => r.subject))];

        document.getElementById("totalSubjects").innerHTML =
            subjects.length;

        let totalMarks = 0;
        let highestMarks = 0;

        results.forEach(result => {

            const marks = Number(result.marks);

            totalMarks += marks;

            if (marks > highestMarks) {

                highestMarks = marks;

            }

        });

        const average =
            results.length > 0
                ? (totalMarks / results.length).toFixed(2)
                : 0;

        document.getElementById("averageMarks").innerHTML =
            average + "%";

        document.getElementById("highestMarks").innerHTML =
            highestMarks;

        const failed =
            results.filter(r => r.status === "Fail").length;

        document.getElementById("resultStatus").innerHTML =
            failed === 0 ? "Pass" : "Fail";

        const table =
            document.getElementById("studentResultBody");

        table.innerHTML = "";

        if (results.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="4">No Results Available</td>
                </tr>
            `;

            return;

        }

        results.forEach(result => {

            table.innerHTML += `
                <tr>
                    <td>${result.subject}</td>
                    <td>${result.marks}</td>
                    <td>${result.grade}</td>
                    <td>${result.status}</td>
                </tr>
            `;

        });

    }

    catch (error) {

        console.error("Results Error :", error);

    }

}



// ======================================
// LOAD STUDENT ATTENDANCE
// ======================================

async function loadStudentAttendance() {

    try {

        const response =
            await fetch(`${API}/attendance/student/${studentRoll}`);

        const data =
            await response.json();

        console.log("Attendance :", data);

        if (!data.success) return;

        document.getElementById("totalDays").innerHTML =
            data.summary.totalDays;

        document.getElementById("presentDays").innerHTML =
            data.summary.present;

        document.getElementById("absentDays").innerHTML =
            data.summary.absent;

        document.getElementById("attendancePercentage").innerHTML =
            data.summary.percentage + "%";

    }

    catch (error) {

        console.error("Attendance Error :", error);

    }

}



// ======================================
// LOGOUT
// ======================================

function logout() {

    if (confirm("Are you sure you want to logout?")) {

        localStorage.clear();

        sessionStorage.clear();

        window.location.href = "/html/login.html";

    }

}