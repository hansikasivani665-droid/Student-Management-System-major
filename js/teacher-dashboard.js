// ======================================
// Teacher Dashboard
// ======================================

const STUDENT_API = "https://student-management-system-major-1.onrender.com/students";
const RESULT_API = "https://student-management-system-major-1.onrender.com/results";
const ATTENDANCE_API = "https://student-management-system-major-1.onrender.com/attendance";


// ======================================
// Login Check
// ======================================

if (localStorage.getItem("loggedIn") !== "true") {

    location.href = "login.html";

}


// ======================================
// Page Load
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    loadTeacherDashboard();

    showDateTime();

    setInterval(showDateTime, 1000);

    const logout = document.getElementById("logout");

    if (logout) {

        logout.addEventListener("click", () => {

            localStorage.clear();
            sessionStorage.clear();

            location.href = "login.html";

        });

    }

});


// ======================================
// DATE & TIME
// ======================================

function showDateTime() {

    const d = new Date();

    const date = document.getElementById("currentDate");
    const time = document.getElementById("currentTime");

    if (date) {

        date.innerHTML = d.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    }

    if (time) {

        time.innerHTML = d.toLocaleTimeString();

    }

}


// ======================================
// LOAD DASHBOARD
// ======================================

async function loadTeacherDashboard() {

    try {

        // ======================================
        // STUDENTS
        // ======================================

        const studentResponse =
            await fetch(STUDENT_API);

        const studentData =
            await studentResponse.json();

        if (studentData.success) {

            const students =
                studentData.students;

            if (document.getElementById("totalStudents")) {

                document.getElementById("totalStudents").innerHTML =
                    students.length;

            }

        }


        // ======================================
        // RESULTS
        // ======================================

        const resultResponse =
            await fetch(RESULT_API);

        const resultData =
            await resultResponse.json();

        if (resultData.success) {

            const results =
                resultData.results;

            if (document.getElementById("resultsCount")) {

                document.getElementById("resultsCount").innerHTML =
                    results.length;

            }

            let totalMarks = 0;

            let pass = 0;

            results.forEach(result => {

                totalMarks += Number(result.marks);

                if (result.status === "Pass") {

                    pass++;

                }

            });

            const average =
                results.length > 0
                    ? (totalMarks / results.length).toFixed(2)
                    : 0;

            const passPercentage =
                results.length > 0
                    ? ((pass / results.length) * 100).toFixed(0)
                    : 0;

            if (document.getElementById("averageMarks")) {

                document.getElementById("averageMarks").innerHTML =
                    average + "%";

            }

            if (document.getElementById("passPercentage")) {

                document.getElementById("passPercentage").innerHTML =
                    passPercentage + "%";

            }

        }


        // ======================================
        // ATTENDANCE
        // ======================================

        const attendanceResponse =
            await fetch(ATTENDANCE_API);

        const attendanceData =
            await attendanceResponse.json();

        if (attendanceData.success) {

            const attendance =
                attendanceData.attendance;

            const present =
                attendance.filter(a => a.status === "Present").length;

            const absent =
                attendance.filter(a => a.status === "Absent").length;

            if (document.getElementById("presentStudents")) {

                document.getElementById("presentStudents").innerHTML =
                    present;

            }

            if (document.getElementById("absentStudents")) {

                document.getElementById("absentStudents").innerHTML =
                    absent;

            }

        }

    }

    catch (error) {

        console.error("Teacher Dashboard Error:", error);

    }

}


// ======================================
// Auto Refresh
// ======================================

setInterval(() => {

    loadTeacherDashboard();

}, 30000);


console.log("=====================================");
console.log("Teacher Dashboard Loaded");
console.log("=====================================");