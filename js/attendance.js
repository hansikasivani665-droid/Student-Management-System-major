// =============================================
// STUDENT MANAGEMENT SYSTEM
// ADMIN ATTENDANCE MODULE
// =============================================

if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "/html/login.html";
}

// =============================================
// API
// =============================================

const API = window.API_BASE || window.location.origin;

const STUDENT_API = `${API}/students`;
const ATTENDANCE_API = `${API}/attendance`;

const ADMIN_ATTENDANCE_SUBJECT = "Daily Attendance";
const ADMIN_TEACHER_ID = "ADMIN";

let attendanceData = [];

// =============================================
// PAGE LOAD
// =============================================

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("todayDate").textContent =
        new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

    loadAttendance();

    document.getElementById("searchStudent")
        .addEventListener("keyup", filterStudents);

    document.getElementById("departmentFilter")
        .addEventListener("change", filterStudents);

    document.getElementById("yearFilter")
        .addEventListener("change", filterStudents);

    document.getElementById("markPresent")
        ?.addEventListener("click", markAllPresent);

    document.getElementById("markAbsent")
        ?.addEventListener("click", markAllAbsent);

    document.getElementById("attendanceForm")
        ?.addEventListener("submit", saveAttendance);

});

// =============================================
// LOAD ATTENDANCE
// =============================================

async function loadAttendance() {

    try {

        const studentResponse = await fetch(STUDENT_API);
        const studentData = await studentResponse.json();

        const attendanceResponse = await fetch(ATTENDANCE_API);
        const attendanceResult = await attendanceResponse.json();

        const students = studentData.students || [];
        const attendance = attendanceResult.attendance || [];

        const today = new Date().toISOString().split("T")[0];

        attendanceData = students.map(student => {

            const todayRecord = attendance.find(record =>
                record.roll === student.roll &&
                record.date === today &&
                record.subject === ADMIN_ATTENDANCE_SUBJECT &&
                record.teacherId === ADMIN_TEACHER_ID
            );

            return {

                roll: student.roll,
                name: student.name,
                department: student.department,
                year: student.year,
                status: todayRecord ? todayRecord.status : "Absent"

            };

        });

        renderTable(attendanceData);

    }

    catch (error) {

        console.error("Attendance Error:", error);

    }

}

// =============================================
// DISPLAY TABLE
// =============================================

function renderTable(data) {

    const table = document.getElementById("attendanceBody");

    table.innerHTML = "";

    data.forEach(student => {

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
${student.status === "Present" ? "checked" : ""}>

Present

</label>

&nbsp;&nbsp;

<label>

<input
type="radio"
name="attendance_${student.roll}"
value="Absent"
data-roll="${student.roll}"
class="attendanceRadio"
${student.status === "Absent" ? "checked" : ""}>

Absent

</label>

</td>

</tr>

`;

    });

    updateStatistics(data);

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
// UPDATE STATISTICS
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

    document.getElementById("totalStudents").textContent = total;

    document.getElementById("presentCount").textContent = present;

    document.getElementById("absentCount").textContent = absent;

    document.getElementById("attendancePercentage").textContent =
        percentage + "%";

}

// =============================================
// FILTER STUDENTS
// =============================================

function filterStudents() {

    const keyword =
        document.getElementById("searchStudent")
        .value
        .toLowerCase();

    const dept =
        document.getElementById("departmentFilter").value;

    const year =
        document.getElementById("yearFilter").value;

    const filtered = attendanceData.filter(student => {

        return (

            (
                student.name.toLowerCase().includes(keyword) ||
                student.roll.toLowerCase().includes(keyword)
            )

            &&

            (
                dept === "All" ||
                student.department === dept
            )

            &&

            (
                year === "All" ||
                student.year === year
            )

        );

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

    async function saveAttendance(e) {

    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];

    try {

        let success = 0;

        for (const student of attendanceData) {

            const response = await fetch(ATTENDANCE_API, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    roll: student.roll,
                    status: student.status,
                    subject: ADMIN_ATTENDANCE_SUBJECT,
                    teacherId: ADMIN_TEACHER_ID,
                    date: today

                })

            });

            const result = await response.json();

            if (result.success) {
                success++;
            } else {
                console.log(result.message);
            }

        }

        alert(`Attendance Saved Successfully (${success}/${attendanceData.length})`);

        await loadAttendance();

    }

    catch (error) {

        console.error("Save Attendance Error:", error);

        alert("Attendance Save Failed");

    }

}