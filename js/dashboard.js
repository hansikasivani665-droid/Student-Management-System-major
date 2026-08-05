// =====================================================
// ADMIN DASHBOARD FRONTEND JAVASCRIPT
// =====================================================

const API =
    window.API_BASE ||
    "https://student-management-system-major-1.onrender.com";

let studentChartInstance;
let attendanceChartInstance;

// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

    loadDepartmentDetails();

    loadRecentStudents();

    loadDateTime();

});

// =====================================================
// MAIN DASHBOARD
// =====================================================

async function loadDashboard() {

    try {

        const response = await fetch(`${API}/dashboard`);

        const data = await response.json();

        console.log("Dashboard Data:", data);

        if (!data.success) return;

        // ===============================
        // TOP CARDS
        // ===============================

        setText("totalStudents", data.totalStudents);

        setText(
            "attendancePercentage",
            (data.attendancePercentage || 0) + "%"
        );

        setText("averageMarks", data.averageMarks || 0);

        setText(
            "passPercentage",
            (data.passPercentage || 0) + "%"
        );

        setText("totalDepartments", data.totalDepartments);

        setText("resultsCount", data.resultsCount);

        setText("presentStudents", data.presentStudents);

        // ===============================
        // DEPARTMENT CARDS
        // ===============================

        (data.departments || []).forEach(dep => {

            let id = dep.department.toLowerCase();

            switch (id) {

                case "cse":
                case "computer science engineering":
                    id = "cse";
                    break;

                case "ece":
                case "electronics and communication engineering":
                    id = "ece";
                    break;

                case "eee":
                case "electrical and electronics engineering":
                    id = "eee";
                    break;

                case "mechanical":
                case "mechanical engineering":
                    id = "mech";
                    break;

                case "civil":
                case "civil engineering":
                    id = "civil";
                    break;

                default:
                    return;

            }

            setDepartment(id, dep);

        });

        createCharts(data);

    }

    catch (error) {

        console.log("Dashboard Error:", error);

    }

}

// =====================================================
// SAFE TEXT UPDATE
// =====================================================

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {

        element.innerText = value ?? 0;

    }

}

// =====================================================
// UPDATE DEPARTMENT CARD
// =====================================================

function setDepartment(id, dep) {

    setText(id + "Students", dep.totalStudents || 0);

    setText(id + "Present", dep.presentStudents || 0);

    setText(id + "Absent", dep.absentStudents || 0);

    setText(
        id + "Attendance",
        (dep.attendancePercentage || 0) + "%"
    );

    setText(id + "Average", dep.averageMarks || 0);

    setText(id + "Results", dep.resultsCount || 0);

}

// =====================================================
// DEPARTMENT OVERVIEW
// =====================================================

async function loadDepartmentDetails() {

    try {

        const response =
            await fetch(`${API}/dashboard/department`);

        const data =
            await response.json();

        console.log("Department Details:", data);

        const container =
            document.getElementById("departmentCards");

        if (!container) return;

        container.innerHTML = "";

        (data.departments || []).forEach(dep => {

            container.innerHTML += `

<div class="card">

<h3>${dep.department}</h3>

<p><strong>Students:</strong> ${dep.totalStudents}</p>

<p><strong>Present:</strong> ${dep.presentStudents}</p>

<p><strong>Absent:</strong> ${dep.absentStudents}</p>

<p><strong>Attendance:</strong> ${dep.attendancePercentage}%</p>

<p><strong>Results:</strong> ${dep.resultsCount || 0}</p>

<p><strong>Average Marks:</strong> ${dep.averageMarks}</p>

</div>

`;

        });

    }

    catch (error) {

        console.log("Department Error:", error);

    }

}

// =====================================================
// RECENT STUDENTS
// =====================================================

async function loadRecentStudents() {

    try {

        const response =
            await fetch(`${API}/students`);

        const data =
            await response.json();

        const students =
            data.students || [];

        const table =
            document.getElementById("recentStudentTable");

        if (!table) return;

        table.innerHTML = "";

        students
            .slice(0, 5)
            .forEach(student => {

                table.innerHTML += `

<tr>

<td>${student.name}</td>

<td>${student.roll}</td>

<td>${student.department}</td>

<td>${student.year}</td>

<td>Active</td>

</tr>

`;

            });

    }

    catch (error) {

        console.log(error);

    }

}

// =====================================================
// DATE & TIME
// =====================================================

function loadDateTime() {

    setInterval(() => {

        const now = new Date();

        setText(
            "currentDate",
            now.toLocaleDateString()
        );

        setText(
            "currentTime",
            now.toLocaleTimeString()
        );

    }, 1000);

}

// =====================================================
// CHARTS
// =====================================================

function createCharts(data) {

    if (typeof Chart === "undefined") return;

    const resultCanvas =
        document.getElementById("studentChart");

    const attendanceCanvas =
        document.getElementById("attendanceChart");

    if (studentChartInstance) {

        studentChartInstance.destroy();

    }

    if (attendanceChartInstance) {

        attendanceChartInstance.destroy();

    }

    if (resultCanvas) {

        studentChartInstance = new Chart(resultCanvas, {

            type: "bar",

            data: {

                labels: [

                    "Average Marks",

                    "Pass Percentage"

                ],

                datasets: [

                    {

                        label: "Performance",

                        data: [

                            data.averageMarks || 0,

                            data.passPercentage || 0

                        ]

                    }

                ]

            }

        });

    }

    if (attendanceCanvas) {

        attendanceChartInstance = new Chart(attendanceCanvas, {

            type: "pie",

            data: {

                labels: [

                    "Present",

                    "Absent"

                ],

                datasets: [

                    {

                        data: [

                            data.presentStudents || 0,

                            data.absentStudents || 0

                        ]

                    }

                ]

            }

        });

    }

}