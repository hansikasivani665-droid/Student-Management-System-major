// =====================================================
// STUDENT MANAGEMENT SYSTEM
// ADMIN DASHBOARD
// Developer : Hansika Sivani
// =====================================================

const API = "https://student-management-system-major-1.onrender.com";

// ======================================
// Chart Instances
// ======================================

let studentChartInstance = null;
let attendanceChartInstance = null;


// =====================================================
// DATE & TIME
// =====================================================

function updateDateTime() {

    const now = new Date();

    const dateOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    const date = document.getElementById("currentDate");
    const time = document.getElementById("currentTime");

    if (date) {
        date.textContent =
            now.toLocaleDateString("en-IN", dateOptions);
    }

    if (time) {
        time.textContent =
            now.toLocaleTimeString();
    }

}

setInterval(updateDateTime, 1000);

updateDateTime();


// =====================================================
// LOAD DASHBOARD CARDS
// =====================================================

async function loadDashboard() {

    try {

        const response =
            await fetch(`${API}/dashboard`);

        const data =
            await response.json();

        console.log("Dashboard :", data);

        if (!data.success) {
            return;
        }

        const update = (id, value) => {

            const element =
                document.getElementById(id);

            if (element) {
                element.innerHTML = value;
            }

        };

        update(
            "totalStudents",
            data.totalStudents
        );

        update(
            "presentStudents",
            data.presentStudents
        );

        update(
            "attendancePercentage",
            data.attendancePercentage + "%"
        );

        update(
            "averageMarks",
            data.averageMarks + "%"
        );

        update(
            "passPercentage",
            data.passPercentage + "%"
        );

        update(
            "resultsCount",
            data.resultsCount
        );

        update(
            "totalDepartments",
            data.totalDepartments
        );

        update(
            "latestStudent",
            data.latestStudent
        );

    }

    catch (err) {

        console.log(err);

    }

}

loadDashboard();


// =====================================================
// LOAD RECENT STUDENTS
// =====================================================

async function loadStudents() {

    try {

        const response =
            await fetch(`${API}/students`);

        const data =
            await response.json();

        console.log("Students:", data);

        const tbody =
            document.getElementById(
                "recentStudentTable"
            );

        if (!tbody) {
            return;
        }

        tbody.innerHTML = "";

        if (
            !data.students ||
            data.students.length === 0
        ) {

            tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No Students Found
                </td>
            </tr>
            `;

            return;

        }

        data.students
            .slice(0, 5)
            .forEach(student => {

                tbody.innerHTML += `

                <tr>

                    <td>${student.name}</td>

                    <td>${student.roll}</td>

                    <td>${student.department}</td>

                    <td>${student.year}</td>

                    <td>

                        <span class="success">

                            Active

                        </span>

                    </td>

                </tr>

                `;

            });

    }

    catch (err) {

        console.log(err);

    }

}

loadStudents();


// =====================================================
// LOAD ATTENDANCE
// =====================================================

async function loadAttendance() {

    try {

        const response =
            await fetch(`${API}/dashboard`);

        const data =
            await response.json();

        console.log(
            "Attendance Dashboard:",
            data
        );

        if (!data.success) {
            return;
        }

        createAttendanceChart(
            data.presentStudents,
            data.absentStudents
        );

    }

    catch (error) {

        console.log(
            "Attendance Error:",
            error
        );

    }

}

loadAttendance();