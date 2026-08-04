// =====================================
// Teacher Attendance Module
// =====================================

console.log("Teacher Attendance Module Loaded");

// =====================================
// API
// =====================================

const API = window.API_BASE || window.location.origin;


// =====================================
// DOM ELEMENTS
// =====================================

const studentTable =
document.getElementById("studentTable");

const saveButton =
document.getElementById("saveAttendance");

const message =
document.getElementById("message");

const attendanceDate =
document.getElementById("attendanceDate");

const department =
document.getElementById("department");

const year =
document.getElementById("year");

const subject =
document.getElementById("subject");

const teacherIdInput =
document.getElementById("teacherId");

const loadButton =
document.getElementById("loadStudents");


// =====================================
// SET TODAY'S DATE
// =====================================

const today =
new Date().toISOString().split("T")[0];

if (attendanceDate) {

    attendanceDate.value = today;
    attendanceDate.readOnly = true;

}


// =====================================
// LOAD LOGGED-IN TEACHER DETAILS
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    const teacher =
    JSON.parse(localStorage.getItem("teacher") || "null");

    if (!teacher) {

        alert("Teacher not logged in.");

        return;

    }

    // Teacher ID
    if (teacherIdInput) {

        teacherIdInput.value = teacher.teacherId;
        teacherIdInput.readOnly = true;

    }

    // Subject
    if (subject) {

        subject.value = teacher.subject;
        subject.readOnly = true;

    }

    // Department
    if (department) {

        department.value = teacher.department;
        department.disabled = true;

    }

    // Year
    if (year) {

        year.value = teacher.year;
        year.disabled = true;

    }

});


// =====================================
// LOAD STUDENTS
// =====================================

async function loadStudents() {

    const teacher =
    JSON.parse(localStorage.getItem("teacher") || "null");

    if (!teacher) {

        alert("Teacher not logged in.");

        return;

    }

    try {

        const response =
        await fetch(
            `${API}/teachers/${teacher.teacherId}/students`
        );

        const data =
        await response.json();

        if (data.success) {

            const attendanceQuery =
            new URLSearchParams({

                department: teacher.department,
                year: teacher.year,
                subject: teacher.subject,
                teacherId: teacher.teacherId,
                date: attendanceDate.value

            }).toString();

            const attendanceResponse =
            await fetch(`${API}/attendance?${attendanceQuery}`);

            const attendanceData =
            await attendanceResponse.json();

            const existingRecords =
            attendanceData.success
                ? attendanceData.attendance
                : [];

            displayStudents(
                data.students,
                existingRecords
            );

        }

        else {

            studentTable.innerHTML = `

<tr>

<td colspan="6">

No Students Found

</td>

</tr>

`;

        }

    }

    catch (error) {

        console.error(error);

        message.style.color = "red";

        message.innerHTML =
        "Unable to load students";

    }

}

// =====================================
// DISPLAY STUDENTS
// =====================================

function displayStudents(students, existingRecords = []) {

    studentTable.innerHTML = "";

    if (students.length === 0) {

        studentTable.innerHTML = `

<tr>

<td colspan="6">

No Students Found

</td>

</tr>

`;

        return;

    }

    students.forEach(student => {

        const existing = existingRecords.find(record =>

            record.roll === student.roll &&
            record.status !== "Not Marked"

        );

        const statusValue =
            existing ? existing.status : "Present";

        studentTable.innerHTML += `

<tr>

<td>${student.roll}</td>

<td>${student.name}</td>

<td>${student.department}</td>

<td>${student.year}</td>

<td>${subject.value}</td>

<td>

<select
class="status"
data-roll="${student.roll}">

<option value="Present"
${statusValue === "Present" ? "selected" : ""}>

Present

</option>

<option value="Absent"
${statusValue === "Absent" ? "selected" : ""}>

Absent

</option>

</select>

</td>

</tr>

`;

    });

}


// =====================================
// LOAD BUTTON
// =====================================

if (loadButton) {

    loadButton.addEventListener(
        "click",
        loadStudents
    );

}


// =====================================
// SAVE ATTENDANCE
// =====================================

if (saveButton) {

saveButton.addEventListener(

"click",

async () => {

    const statusList =
    document.querySelectorAll(".status");

    if (statusList.length === 0) {

        alert("Load students first");

        return;

    }

    let successCount = 0;

    const teacher =
    JSON.parse(localStorage.getItem("teacher") || "null");

    for (const item of statusList) {

        const attendanceData = {

            roll: item.dataset.roll,

            subject: teacher.subject,

            teacherId: teacher.teacherId,

            date: attendanceDate.value,

            status: item.value

        };

        console.log("Sending Attendance:", attendanceData);

        try {

            const response =
            await fetch(`${API}/attendance`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(attendanceData)

            });

            const result =
            await response.json();

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
        `Attendance Saved For ${successCount} Students`;

        // Reload attendance after saving
        loadStudents();

    }

    else {

        message.style.color = "red";

        message.innerHTML =
        `Saved ${successCount} of ${statusList.length} attendance records`;

    }

});

}