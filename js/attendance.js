// =============================================
// STUDENT MANAGEMENT SYSTEM
// Attendance Module
// =============================================

// =============================================
// Login Check
// =============================================

if (localStorage.getItem("loggedIn") !== "true") {

    window.location.href = "/html/login.html";

}

// =============================================
// API
// =============================================

const API_URL = "https://student-management-system-major-1.onrender.com/attendance";

let attendanceData = [];

// =============================================
// PAGE LOAD
// =============================================

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("todayDate").innerHTML =
        new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

    loadAttendance();

    document
        .getElementById("searchStudent")
        .addEventListener("keyup", filterStudents);

    document
        .getElementById("departmentFilter")
        .addEventListener("change", filterStudents);

    document
        .getElementById("yearFilter")
        .addEventListener("change", filterStudents);

    document
        .getElementById("markPresent")
        .addEventListener("click", markAllPresent);

    document
        .getElementById("markAbsent")
        .addEventListener("click", markAllAbsent);

    document
        .getElementById("attendanceForm")
        .addEventListener("submit", saveAttendance);

});

// =============================================
// LOAD ATTENDANCE
// =============================================

async function loadAttendance() {

    const table = document.getElementById("attendanceBody");

    table.innerHTML = `
        <tr>
            <td colspan="5">Loading Students...</td>
        </tr>
    `;

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        console.log(data);

        if (data.success) {

            attendanceData = data.attendance;

            attendanceData.forEach(student => {

                if (!student.status) {

                    student.status = "Absent";

                }

            });

            renderTable(attendanceData);

        }

        else {

            table.innerHTML = `
                <tr>
                    <td colspan="5">No Data Found</td>
                </tr>
            `;

        }

    }

    catch (error) {

        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="5">Backend Connection Failed</td>
            </tr>
        `;

    }

}

// =============================================
// DISPLAY TABLE
// =============================================

function renderTable(students) {

    const table = document.getElementById("attendanceBody");

    table.innerHTML = "";

    students.forEach(student => {

        table.innerHTML += `
        <tr>

            <td>${student.roll}</td>

            <td>${student.name}</td>

            <td>${student.department}</td>

            <td>${student.year}</td>

            <td>

                <label>

                    <input
                        type="radio"
                        name="attendance_${student.roll}"
                        value="Present"
                        data-roll="${student.roll}"
                        class="attendanceRadio"
                        ${student.status === "Present" ? "checked" : ""}
                    >

                    Present

                </label>

                <label>

                    <input
                        type="radio"
                        name="attendance_${student.roll}"
                        value="Absent"
                        data-roll="${student.roll}"
                        class="attendanceRadio"
                        ${student.status === "Absent" ? "checked" : ""}
                    >

                    Absent

                </label>

            </td>

        </tr>
        `;

    });

    updateStatistics(students);

    document.querySelectorAll(".attendanceRadio").forEach(input => {

        input.addEventListener("change", () => {

            const student = attendanceData.find(
                s => s.roll === input.dataset.roll
            );

            if (student) {

                student.status = input.value;

            }

            updateStatistics(attendanceData);

        });

    });

}

// =============================================
// UPDATE DASHBOARD CARDS
// =============================================

function updateStatistics(data) {

    const total = data.length;

    const present = data.filter(
        s => s.status === "Present"
    ).length;

    const absent = total - present;

    const percentage =
        total === 0
            ? 0
            : Math.round((present / total) * 100);

    document.getElementById("totalStudents").innerHTML = total;
    document.getElementById("presentCount").innerHTML = present;
    document.getElementById("absentCount").innerHTML = absent;
    document.getElementById("attendancePercentage").innerHTML =
        percentage + "%";

}

// =============================================
// SEARCH FILTER
// =============================================

function filterStudents() {

    const keyword =
        document.getElementById("searchStudent").value.toLowerCase();

    const dept =
        document.getElementById("departmentFilter").value;

    const year =
        document.getElementById("yearFilter").value;

    const filtered = attendanceData.filter(student => {

        const search =
            student.name.toLowerCase().includes(keyword) ||
            student.roll.toLowerCase().includes(keyword);

        const department =
            dept === "All" || dept === "" ||
            student.department === dept;

        const studyYear =
            year === "All" || year === "" ||
            student.year === year;

        return search && department && studyYear;

    });

    renderTable(filtered);

}

// =============================================
// MARK ALL PRESENT
// =============================================

function markAllPresent() {

    attendanceData.forEach(student => {

        student.status = "Present";

    });

    renderTable(attendanceData);

}

// =============================================
// MARK ALL ABSENT
// =============================================

function markAllAbsent() {

    attendanceData.forEach(student => {

        student.status = "Absent";

    });

    renderTable(attendanceData);

}

// =============================================
// SAVE ATTENDANCE
// =============================================

async function saveAttendance(e) {

    e.preventDefault();

    try {

        for (const student of attendanceData) {

            await fetch(API_URL, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    roll: student.roll,
                    status: student.status

                })

            });

        }

        alert("Attendance Saved Successfully");

        loadAttendance();

    }

    catch (error) {

        console.error(error);

        alert("Attendance Save Failed");

    }

}