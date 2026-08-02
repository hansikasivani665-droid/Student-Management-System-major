// =====================================================
// STUDENT MANAGEMENT SYSTEM
// ADMIN DASHBOARD.JS
// Developer : Hansika Sivani
// Render Compatible Version
// =====================================================


// ===============================
// API URL
// ===============================

const API =
"https://student-management-system-major-1.onrender.com";



// ===============================
// Chart Variables
// ===============================

let studentChartInstance = null;
let attendanceChartInstance = null;
let departmentChartInstance = null;
let marksChartInstance = null;



// =====================================================
// DATE & TIME
// =====================================================

function updateDateTime(){


const now = new Date();


const dateElement =
document.getElementById("currentDate");


const timeElement =
document.getElementById("currentTime");



if(dateElement){

dateElement.innerText =
now.toLocaleDateString("en-IN",{

weekday:"long",
year:"numeric",
month:"long",
day:"numeric"

});

}



if(timeElement){

timeElement.innerText =
now.toLocaleTimeString();

}


}




setInterval(
updateDateTime,
1000
);





// =====================================================
// UPDATE CARD
// =====================================================


function updateCard(id,value){


const element =
document.getElementById(id);



if(element){

element.innerText =
value ?? 0;

}


}





// =====================================================
// LOAD DASHBOARD DATA
// =====================================================


async function loadDashboard(){


try{


console.log(
"Loading Dashboard Data..."
);



const response =
await fetch(
`${API}/dashboard`
);



const data =
await response.json();



console.log(
"Dashboard Response:",
data
);



if(!data.success){

console.log(
"Dashboard API failed"
);

return;

}



// ===============================
// MAIN CARDS
// ===============================


updateCard(
"totalStudents",
data.totalStudents
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



updateCard(
"resultsCount",
data.resultsCount
);



updateCard(
"presentStudents",
data.presentStudents
);



updateCard(
"absentStudents",
data.absentStudents
);




// Latest student if exists

const latest =
document.getElementById(
"latestStudent"
);



if(latest){

latest.innerText =
data.latestStudent || "-";

}



console.log(
"Dashboard Cards Updated"
);



}


catch(error){


console.error(
"Dashboard Loading Error:",
error
);


}



}






// =====================================================
// LOAD DEPARTMENT DATA
// =====================================================


async function loadDepartmentData(){



try{


console.log(
"Loading Department Data..."
);



const response =
await fetch(
`${API}/dashboard/department`
);



const data =
await response.json();



console.log(
"Department Response:",
data
);



if(!data.success)
return;



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
"departmentCards"
);



if(!container){

console.log(
"departmentCards not found"
);

return;

}



container.innerHTML="";



departments.forEach(dep=>{


const card =
document.createElement("div");



card.className =
"card";



card.innerHTML = `


<h3>
${dep.department}
</h3>


<p>
Students :
<b>
${dep.totalStudents}
</b>
</p>


<p>
Attendance :
<b>
${dep.attendancePercentage}%
</b>
</p>


<p>
Average Marks :
<b>
${dep.averageMarks}
</b>
</p>


<p>
Pass :
<b>
${dep.passPercentage}%
</b>
</p>


`;



container.appendChild(card);



});



}

// =====================================================
// RECENT STUDENTS
// =====================================================


async function loadRecentStudents(){


try{


console.log(
"Loading Recent Students..."
);



const response =
await fetch(
`${API}/students`
);



const data =
await response.json();



console.log(
"Students Response:",
data
);



let students = [];



// Handle API formats

if(Array.isArray(data)){

students = data;

}

else if(data.students){

students = data.students;

}

else if(data.results){

students = data.results;

}





displayRecentStudents(
students
);



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



const table =
document.getElementById(
"recentStudentTable"
);



if(!table){

console.log(
"recentStudentTable not found"
);

return;

}



table.innerHTML="";





if(
!students ||
students.length===0
){


table.innerHTML = `

<tr>

<td colspan="5">

No Students Available

</td>

</tr>

`;

return;

}




// latest 5 students

const recent =
students
.slice()
.reverse()
.slice(0,5);





recent.forEach(student=>{


const row =
document.createElement("tr");



row.innerHTML = `


<td>
${student.name || "-"}
</td>


<td>
${student.roll || "-"}
</td>


<td>
${student.department || "-"}
</td>


<td>
${student.year || "-"}
</td>


<td>

<span class="success">

Active

</span>

</td>


`;



table.appendChild(row);



});



}






// =====================================================
// DEPARTMENT COUNT CALCULATION
// =====================================================


function calculateDepartmentCount(students){



const count = {};



students.forEach(student=>{


const dept =
student.department || "Unknown";



if(count[dept]){

count[dept]++;

}

else{

count[dept]=1;

}


});



return count;


}

// =====================================================
// CHARTS SECTION
// =====================================================



// =====================================================
// LOAD ALL CHARTS
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
"Chart Data:",
data
);



if(!data.success)
return;



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
// DEPARTMENT BAR CHART
// =====================================================


function createDepartmentChart(departments){



const canvas =
document.getElementById(
"studentChart"
);



if(!canvas)
return;




const labels =
departments.map(
d=>d.department
);



const values =
departments.map(
d=>d.totalStudents
);




if(studentChartInstance){

studentChartInstance.destroy();

}




studentChartInstance =
new Chart(
canvas,
{


type:"bar",


data:{


labels:labels,


datasets:[

{

label:"Students",

data:values

}

]


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
// ATTENDANCE DOUGHNUT CHART
// =====================================================


async function createAttendanceChart(){



const canvas =
document.getElementById(
"attendanceChart"
);



if(!canvas)
return;




try{


const response =
await fetch(
`${API}/dashboard`
);



const data =
await response.json();




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



datasets:[


{


label:"Attendance",


data:[


data.presentStudents || 0,


data.absentStudents || 0


]


}


]


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
"Attendance Chart Error:",
error
);


}



}








// =====================================================
// MARKS PERFORMANCE CHART
// =====================================================


async function createMarksChart(){



const canvas =
document.getElementById(
"attendanceChart"
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


if(result.status==="Pass"){

pass++;

}

else{

fail++;

}


});




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



datasets:[

{

label:"Results",

data:[

pass,

fail

]

}

]


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
// LOGOUT FUNCTION
// =====================================================


function logout(){


localStorage.removeItem(
"user"
);


localStorage.removeItem(
"token"
);


localStorage.removeItem(
"loggedIn"
);



window.location.href =
"/html/index.html";


}






// =====================================================
// LOGOUT BUTTON EVENT
// =====================================================


document.addEventListener(
"DOMContentLoaded",
()=>{


const logoutBtn =
document.getElementById(
"logout"
);



if(logoutBtn){


logoutBtn.addEventListener(
"click",
logout
);


}



});







// =====================================================
// ADMIN PROFILE
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



adminName.innerText =
user.name || "Administrator";



}

catch(error){


adminName.innerText =
"Administrator";


}



}



}






// =====================================================
// REFRESH DASHBOARD
// =====================================================


function refreshDashboard(){



console.log(
"Refreshing Dashboard..."
);



loadDashboard();

loadDepartmentData();

loadRecentStudents();

loadCharts();



}





// Refresh every 60 seconds

setInterval(
refreshDashboard,
60000
);







// =====================================================
// FINAL PAGE LOAD
// =====================================================


document.addEventListener(
"DOMContentLoaded",
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



updateDateTime();


loadDashboard();


loadDepartmentData();


loadRecentStudents();


loadCharts();


loadAdminProfile();



});