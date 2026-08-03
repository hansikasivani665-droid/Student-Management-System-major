// =====================================
// Teacher Attendance Module
// =====================================

console.log("Teacher Attendance Module Loaded");

const API = window.API_BASE || window.location.origin;

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

const today =
new Date()
.toISOString()
.split("T")[0];

if(attendanceDate){

    attendanceDate.value = today;
    attendanceDate.readOnly = true;

}

document.addEventListener("DOMContentLoaded", () => {

    const teacher =
    JSON.parse(localStorage.getItem("teacher") || "null");

    if(teacher){

        if(teacherIdInput && teacher.teacherId){
            teacherIdInput.value = teacher.teacherId;
        }

        if(subject && teacher.subject){
            subject.value = teacher.subject;
        }

        if(department && teacher.department){

            const options =
            department.querySelectorAll("option");

            options.forEach(option => {

                if(
                option.value.toLowerCase() ===
                teacher.department.toLowerCase()
                ){
                    department.value = option.value;
                }

            });

            if(!department.value){
                department.value = teacher.department;
            }

        }

    }

});

async function loadStudents(){

const dept =
department.value;

const yr =
year.value;

if(
!dept ||
!yr ||
!teacherIdInput.value ||
!subject.value
){

alert(
"Enter Teacher ID, Subject, Department and Year"
);

return;

}

try{

const response =
await fetch(

`${API}/students?department=${encodeURIComponent(dept)}&year=${encodeURIComponent(yr)}`

);

const data =
await response.json();

if(data.success){

const attendanceQuery =
new URLSearchParams({
department: dept,
year: yr,
subject: subject.value,
teacherId: teacherIdInput.value,
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

else{

studentTable.innerHTML = `

<tr>

<td colspan="6">

No Students Found

</td>

</tr>

`;

}

}

catch(error){

console.log(error);

message.innerHTML =
"Unable to load students";

}

}

function displayStudents(students, existingRecords = []){

studentTable.innerHTML="";

students.forEach(student=>{

const existing =
existingRecords.find(
record =>
record.roll === student.roll &&
record.status !== "Not Marked"
);

const statusValue =
existing ? existing.status : "Present";

studentTable.innerHTML += `

<tr>

<td>
${student.roll}
</td>

<td>
${student.name}
</td>

<td>
${student.department}
</td>

<td>
${student.year}
</td>

<td>
${subject.value}
</td>

<td>

<select class="status"
data-roll="${student.roll}">

<option value="Present" ${statusValue === "Present" ? "selected" : ""}>
Present
</option>

<option value="Absent" ${statusValue === "Absent" ? "selected" : ""}>
Absent
</option>

</select>

</td>

</tr>

`;

});

}

loadButton.addEventListener(
"click",
loadStudents
);

saveButton.addEventListener(

"click",

async()=>{

const statusList =
document.querySelectorAll(".status");

if(statusList.length===0){

alert(
"Load students first"
);

return;

}

let successCount=0;

for(
const item of statusList
){

const attendanceData = {

roll:
item.dataset.roll,

subject:
subject.value,

teacherId:
teacherIdInput.value,

date:
attendanceDate.value,

status:
item.value

};

try{

const response =
await fetch(

`${API}/attendance`,

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:
JSON.stringify(
attendanceData
)

}

);

const result =
await response.json();

console.log(result);

if(result.success){

successCount++;

}

}

catch(error){

console.log(error);

}

}

if(
successCount === statusList.length
){

message.style.color="green";

message.innerHTML =

`Attendance Saved For ${successCount} Students`;

}

else{

message.style.color="red";

message.innerHTML =

"Some attendance records failed";

}

}

);
