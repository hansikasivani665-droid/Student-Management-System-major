// =====================================================
// STUDENT MANAGEMENT SYSTEM
// ADMIN DASHBOARD.JS
// Developer : Hansika Sivani
// Version : Render Compatible
// =====================================================


// ===============================
// API URL
// ===============================

const API = "https://student-management-system-backend.onrender.com";


// ===============================
// Chart Variables
// ===============================

let studentChartInstance = null;
let attendanceChartInstance = null;
let departmentChartInstance = null;


// =====================================================
// DATE & TIME
// =====================================================

function updateDateTime(){

    const now = new Date();


    const dateElement = document.getElementById("currentDate");
    const timeElement = document.getElementById("currentTime");


    if(dateElement){

        dateElement.innerHTML =
        now.toLocaleDateString("en-IN",{
            weekday:"long",
            year:"numeric",
            month:"long",
            day:"numeric"
        });

    }


    if(timeElement){

        timeElement.innerHTML =
        now.toLocaleTimeString();

    }

}


setInterval(updateDateTime,1000);



// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard(){


try{


console.log("Loading Dashboard Data...");



const response = await fetch(
    `${API}/dashboard`
);



const data = await response.json();



console.log("Dashboard API Response :",data);



if(!data.success){

    console.log("Dashboard data failed");

    return;

}



// ===============================
// UPDATE CARDS
// ===============================


updateCard(
    "totalStudents",
    data.totalStudents
);



updateCard(
    "presentStudents",
    data.presentStudents
);



updateCard(
    "absentStudents",
    data.absentStudents
);



updateCard(
    "attendancePercentage",
    data.attendancePercentage + "%"
);



updateCard(
    "averageMarks",
    data.averageMarks
);



updateCard(
    "passPercentage",
    data.passPercentage + "%"
);



updateCard(
    "totalDepartments",
    data.totalDepartments
);



// Latest Student

const latestStudent =
document.getElementById("latestStudent");


if(latestStudent){

latestStudent.innerHTML =
data.latestStudent || "No Data";

}



console.log("Dashboard Updated Successfully");



}
catch(error){


console.error(
"Dashboard Loading Error:",
error
);


}

}



// =====================================================
// UPDATE CARD FUNCTION
// =====================================================

function updateCard(id,value){


const element =
document.getElementById(id);



if(element){

element.innerHTML =
value ?? 0;

}



}



// =====================================================
// LOAD DEPARTMENT ANALYTICS
// =====================================================


async function loadDepartmentData(){


try{


const response =
await fetch(
`${API}/dashboard/department`
);



const data =
await response.json();



console.log(
"Department Data:",
data
);



if(!data.success){

return;

}



displayDepartmentCards(
data.departments
);



}
catch(error){

console.error(
"Department Loading Error:",
error
);


}


}



// =====================================================
// DISPLAY DEPARTMENT CARDS
// =====================================================


function displayDepartmentCards(departments){



const container =
document.getElementById(
"departmentContainer"
);



if(!container)
return;



container.innerHTML="";



departments.forEach(dep=>{


const card=document.createElement("div");


card.className="department-card";



card.innerHTML=`

<h3>${dep.department}</h3>

<p>
Students :
<b>${dep.totalStudents}</b>
</p>


<p>
Attendance :
<b>${dep.attendancePercentage}%</b>
</p>


<p>
Average Marks :
<b>${dep.averageMarks}</b>
</p>


`;



container.appendChild(card);



});



}




// =====================================================
// PAGE LOAD
// =====================================================


document.addEventListener(
"DOMContentLoaded",
()=>{


updateDateTime();

loadDashboard();

loadDepartmentData();


}
);

// =====================================================
// RECENT STUDENTS TABLE
// =====================================================


async function loadRecentStudents(){


try{


console.log("Loading Recent Students...");



const response =
await fetch(
`${API}/students`
);



const data =
await response.json();



console.log(
"Students API Response:",
data
);



// Handle API response format

let students = [];



if(Array.isArray(data)){

    students = data;

}

else if(data.students){

    students = data.students;

}

else if(data.results){

    students = data.results;

}



displayRecentStudents(students);



}
catch(error){


console.error(
"Recent Students Error:",
error
);


}



}




// =====================================================
// DISPLAY RECENT STUDENTS
// =====================================================


function displayRecentStudents(students){



const tableBody =
document.getElementById(
"recentStudentsBody"
);



if(!tableBody){

console.log(
"recentStudentsBody not found"
);

return;

}



tableBody.innerHTML="";



// No students

if(
!students ||
students.length===0
){


tableBody.innerHTML=`

<tr>

<td colspan="6">
No students available
</td>

</tr>

`;


return;

}




// Show latest 5 students

const recentStudents =
students
.slice()
.reverse()
.slice(0,5);




recentStudents.forEach(student=>{



const row =
document.createElement("tr");



row.innerHTML=`

<td>
${student.roll || "-"}
</td>


<td>
${student.name || "-"}
</td>


<td>
${student.department || "-"}
</td>


<td>
${student.year || "-"}
</td>


<td>
${student.email || "-"}
</td>


<td>
${student.phone || "-"}
</td>


`;



tableBody.appendChild(row);



});



}




// =====================================================
// STUDENT COUNT BY DEPARTMENT
// =====================================================


function calculateDepartmentCount(students){



const departmentCount={};



students.forEach(student=>{


const dept =
student.department || "Unknown";



if(
departmentCount[dept]
){

departmentCount[dept]++;

}

else{

departmentCount[dept]=1;

}


});



return departmentCount;


}




// =====================================================
// AUTO REFRESH STUDENT DATA
// =====================================================


function refreshStudentData(){


loadRecentStudents();


}



// =====================================================
// UPDATE DOM LOAD
// =====================================================


document.addEventListener(
"DOMContentLoaded",
()=>{


loadRecentStudents();


}
);

// =====================================================
// CHARTS SECTION
// =====================================================


// =====================================================
// LOAD CHART DATA
// =====================================================


async function loadCharts(){


try{


console.log(
"Loading Chart Data..."
);



const response =
await fetch(
`${API}/dashboard/department`
);



const data =
await response.json();



console.log(
"Chart API Data:",
data
);



if(!data.success){

console.log(
"No chart data available"
);

return;

}



createDepartmentChart(
data.departments
);



createAttendanceChart();



createMarksChart();



}
catch(error){


console.error(
"Chart Loading Error:",
error
);


}


}



// =====================================================
// DEPARTMENT CHART
// =====================================================


function createDepartmentChart(departments){



const canvas =
document.getElementById(
"departmentChart"
);



if(!canvas)
return;



const labels =
departments.map(
item=>item.department
);



const values =
departments.map(
item=>item.totalStudents
);



// Destroy old chart

if(departmentChartInstance){

departmentChartInstance.destroy();

}



departmentChartInstance =
new Chart(
canvas,
{


type:"bar",


data:{


labels:labels,


datasets:[{

label:
"Students",


data:values


}]


},


options:{


responsive:true,


plugins:{


legend:{


display:true


}


}



}


}

);



}




// =====================================================
// ATTENDANCE CHART
// =====================================================


function createAttendanceChart(){



const canvas =
document.getElementById(
"attendanceChart"
);



if(!canvas)
return;



fetch(
`${API}/dashboard`
)

.then(
response=>response.json()
)

.then(
data=>{


if(attendanceChartInstance){

attendanceChartInstance.destroy();

}



attendanceChartInstance =
new Chart(
canvas,
{


type:"doughnut",


data:{


labels:[

"Present",

"Absent"

],



datasets:[{


label:
"Attendance",


data:[

data.presentStudents || 0,

data.absentStudents || 0

]


}]


},


options:{


responsive:true,


plugins:{


legend:{


position:"bottom"


}



}



}


}

);



}

)

.catch(error=>{

console.error(
"Attendance Chart Error:",
error
);

});



}




// =====================================================
// MARKS PERFORMANCE CHART
// =====================================================


async function createMarksChart(){



const canvas =
document.getElementById(
"marksChart"
);



if(!canvas)
return;



try{


const response =
await fetch(
`${API}/results`
);



const data =
await response.json();



let results=[];



if(Array.isArray(data)){

results=data;

}

else if(data.results){

results=data.results;

}



let pass=0;

let fail=0;



results.forEach(result=>{


if(
result.status==="Pass"
){

pass++;

}

else{

fail++;

}



});





if(attendanceChartInstance){

}



const existing =
window.marksChartInstance;



if(existing){

existing.destroy();

}




window.marksChartInstance =
new Chart(
canvas,
{


type:"pie",


data:{


labels:[

"Pass",

"Fail"

],



datasets:[{


label:
"Results",


data:[

pass,

fail

]


}]


},


options:{


responsive:true,


plugins:{


legend:{


position:"bottom"


}


}


}


}

);



}
catch(error){


console.error(
"Marks Chart Error:",
error
);


}



}




// =====================================================
// LOAD ALL CHARTS AFTER PAGE LOAD
// =====================================================


document.addEventListener(
"DOMContentLoaded",
()=>{


loadCharts();


}
);

// =====================================================
// LOGOUT FUNCTION
// =====================================================


function logout(){


localStorage.removeItem(
"user"
);


localStorage.removeItem(
"token"
);



window.location.href =
"login.html";


}



// =====================================================
// LOGOUT BUTTON EVENT
// =====================================================


document.addEventListener(
"DOMContentLoaded",
()=>{


const logoutBtn =
document.getElementById(
"logoutBtn"
);



if(logoutBtn){


logoutBtn.addEventListener(
"click",
logout
);


}


});




// =====================================================
// AUTO REFRESH DASHBOARD
// =====================================================


function refreshDashboard(){


console.log(
"Refreshing Dashboard..."
);



loadDashboard();

loadRecentStudents();

loadDepartmentData();

loadCharts();


}



// Refresh every 60 seconds

setInterval(
refreshDashboard,
60000
);




// =====================================================
// PROFILE / ADMIN NAME
// =====================================================


function loadAdminProfile(){



const adminName =
document.getElementById(
"adminName"
);



const storedUser =
localStorage.getItem(
"user"
);



if(
adminName &&
storedUser
){


try{


const user =
JSON.parse(
storedUser
);



adminName.innerHTML =
user.name || "Admin";


}
catch(error){


adminName.innerHTML =
"Admin";


}


}



}




// =====================================================
// FINAL PAGE INITIALIZATION
// =====================================================


window.addEventListener(
"load",
()=>{


console.log(
"================================="
);


console.log(
"Student Management Dashboard Loaded"
);


console.log(
"Render API:",
API
);


console.log(
"================================="
);



loadAdminProfile();


});