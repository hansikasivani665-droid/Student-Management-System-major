// ======================================
// STUDENT MANAGEMENT SYSTEM
// TEACHER DASHBOARD
// ======================================

console.log("Teacher Dashboard Loaded");

const API = window.API_BASE || window.location.origin;

if(localStorage.getItem("loggedIn") !== "true"){

    location.href="/html/login.html";

}

let teacherId="";
let teacherDepartment="";
let teacherSubject="";

document.addEventListener(
"DOMContentLoaded",
async ()=>{

await resolveTeacherDetails();
loadTeacherDashboard();

showDateTime();

setInterval(
showDateTime,
1000
);

const logout =
document.getElementById("logout");

if(logout){

logout.onclick=()=>{

localStorage.clear();
sessionStorage.clear();

location.href="/html/login.html";

};

}

});

async function resolveTeacherDetails(){

let teacher =
JSON.parse(
localStorage.getItem("teacher") || "null"
);

if(!teacher){

const email =
localStorage.getItem("currentUser");

if(email){

try{

const response =
await fetch(
`${API}/teachers/email/${encodeURIComponent(email)}`
);

const data =
await response.json();

if(data.success){

teacher = data.teacher;

localStorage.setItem(
"teacher",
JSON.stringify(teacher)
);

}

}

catch(error){

console.error("Teacher lookup failed", error);

}

}

}

if(teacher){

teacherId = teacher.teacherId || "";
teacherDepartment = teacher.department || "";
teacherSubject = teacher.subject || "";

}

console.log("Teacher:", teacher);

}

function showDateTime(){

const date =
document.getElementById("currentDate");

const time =
document.getElementById("currentTime");

const now =
new Date();

if(date){

date.innerHTML =
now.toLocaleDateString(
"en-IN",
{
weekday:"long",
day:"numeric",
month:"long",
year:"numeric"
}
);

}

if(time){

time.innerHTML =
now.toLocaleTimeString();

}

}

async function loadTeacherDashboard(){

try{

const studentResponse =
await fetch(
`${API}/students`
);

const studentData =
await studentResponse.json();

let students =
studentData.students || [];

students =
students.filter(
student =>
student.department.toLowerCase() ===
teacherDepartment.toLowerCase()
);

update(
"totalStudents",
students.length
);

const resultResponse =
await fetch(
`${API}/results`
);

const resultData =
await resultResponse.json();

let results =
resultData.results || [];

results =
results.filter(
result =>

result.department.toLowerCase() ===
teacherDepartment.toLowerCase()

&&

result.subject.toLowerCase() ===
teacherSubject.toLowerCase()

);

update(
"resultsCount",
results.length
);

let totalMarks=0;

let pass=0;

results.forEach(result=>{

totalMarks +=
Number(result.marks || 0);

if(result.status==="Pass"){

pass++;

}

});

let average =

results.length ?

(
totalMarks/results.length
).toFixed(2)

:

0;

let passPercentage =

results.length ?

Math.round(
(pass/results.length)*100
)

:

0;

update(
"averageMarks",
average
);

update(
"passPercentage",
passPercentage+"%"
);

const today =
new Date()
.toISOString()
.split("T")[0];

const attendanceQuery =
new URLSearchParams({
department: teacherDepartment,
subject: teacherSubject,
teacherId: teacherId,
date: today
}).toString();

const attendanceResponse =
await fetch(
`${API}/attendance?${attendanceQuery}`
);

const attendanceData =
await attendanceResponse.json();

let attendance =
attendanceData.attendance || [];

attendance =
attendance.filter(
record =>
record.status === "Present" ||
record.status === "Absent"
);

console.log(
"Attendance:",
attendance
);

let present =
attendance.filter(
a=>a.status==="Present"
).length;

let absent =
attendance.filter(
a=>a.status==="Absent"
).length;

update(
"presentStudents",
present
);

update(
"absentStudents",
absent
);

let attendancePercentage =

attendance.length ?

Math.round(
(present/attendance.length)*100
)

:

0;

update(
"attendancePercentage",
attendancePercentage+"%"
);

}

catch(error){

console.error(
"Teacher Dashboard Error",
error
);

}

}

function update(id,value){

const element =
document.getElementById(id);

if(element){

element.innerHTML=value;

}

}

setInterval(
()=>{

loadTeacherDashboard();

},
30000
);
