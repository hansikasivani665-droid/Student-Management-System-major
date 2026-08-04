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


document.addEventListener("DOMContentLoaded",()=>{

    loadDashboard();

    loadDepartmentDetails();

    loadRecentStudents();

    loadDateTime();

});




// =====================================================
// MAIN DASHBOARD
// =====================================================


async function loadDashboard(){


try{


const response =
await fetch(`${API}/dashboard`);



const data =
await response.json();



console.log(
"Dashboard Data:",
data
);



if(!data.success)
return;




// ===============================
// TOP CARDS
// ===============================


setText(
"totalStudents",
data.totalStudents
);


setText(
"attendancePercentage",
(data.attendancePercentage || 0)+"%"
);


setText(
"averageMarks",
data.averageMarks
);


setText(
"passPercentage",
(data.passPercentage || 0)+"%"
);


setText(
"totalDepartments",
data.totalDepartments
);


setText(
"resultsCount",
data.resultsCount
);


setText(
"presentStudents",
data.presentStudents
);




// ===============================
// DEPARTMENT CARDS
// ===============================


if(data.departments){


data.departments.forEach(dep=>{


let id =
dep.department
.toLowerCase();



if(id==="computer science engineering")
id="cse";


if(id==="electronics and communication engineering")
id="ece";


if(id==="electrical and electronics engineering")
id="eee";


if(id==="mechanical engineering")
id="mech";



setDepartment(
id,
dep
);



});

}



createCharts(data);



}

catch(error){

console.log(
"Dashboard Error:",
error
);


}


}





// =====================================================
// SAFE TEXT UPDATE
// =====================================================


function setText(id,value){


const element =
document.getElementById(id);



if(element)

element.innerText =
value ?? 0;



}






// =====================================================
// DEPARTMENT CARD UPDATE
// =====================================================


function setDepartment(id,dep){



setText(
id+"Students",
dep.totalStudents
);



setText(
id+"Present",
dep.presentStudents
);



setText(
id+"Absent",
dep.absentStudents
);



setText(
id+"Attendance",
(dep.attendancePercentage || 0)+"%"
);



setText(
id+"Average",
dep.averageMarks
);



setText(
id+"Results",
dep.resultsCount || 0
);



}








// =====================================================
// DEPARTMENT OVERVIEW
// =====================================================


async function loadDepartmentDetails(){


try{


const response =
await fetch(
`${API}/dashboard/department`
);



const data =
await response.json();



console.log(
"Department Details:",
data
);



const container =
document.getElementById(
"departmentCards"
);



if(!container)
return;



container.innerHTML="";



(data.departments || [])
.forEach(dep=>{


container.innerHTML += `


<div class="card">


<h3>
${dep.department}
</h3>


<p>
Students :
${dep.totalStudents}
</p>


<p>
Present :
${dep.presentStudents}
</p>


<p>
Absent :
${dep.absentStudents}
</p>


<p>
Attendance :
${dep.attendancePercentage}%
</p>


<p>
Average Marks :
${dep.averageMarks}
</p>


</div>


`;



});



}

catch(error){


console.log(
"Department Error:",
error
);


}


}








// =====================================================
// RECENT STUDENTS
// =====================================================


async function loadRecentStudents(){



try{


const response =
await fetch(
`${API}/students`
);



const data =
await response.json();



const students =
data.students ||
data ||
[];



const table =
document.getElementById(
"recentStudentTable"
);



if(!table)
return;



table.innerHTML="";



students
.slice(0,5)
.forEach(student=>{


table.innerHTML +=`


<tr>


<td>
${student.name}
</td>


<td>
${student.roll}
</td>


<td>
${student.department}
</td>


<td>
${student.year}
</td>


<td>
Active
</td>


</tr>


`;



});



}

catch(error){


console.log(
"Recent Student Error:",
error
);



}



}









// =====================================================
// DATE TIME
// =====================================================


function loadDateTime(){


setInterval(()=>{


const now =
new Date();



setText(
"currentDate",
now.toLocaleDateString()
);



setText(
"currentTime",
now.toLocaleTimeString()
);



},1000);



}









// =====================================================
// CHARTS
// =====================================================


function createCharts(data){



if(typeof Chart==="undefined")
return;




const resultCanvas =
document.getElementById(
"studentChart"
);



const attendanceCanvas =
document.getElementById(
"attendanceChart"
);





if(resultChartInstance)

studentChartInstance.destroy();



if(attendanceChartInstance)

attendanceChartInstance.destroy();






if(resultCanvas){



studentChartInstance =
new Chart(
resultCanvas,
{


type:"bar",


data:{


labels:[

"Average Marks",

"Pass Percentage"

],



datasets:[{

label:"Performance",

data:[

data.averageMarks || 0,

data.passPercentage || 0

]


}]


}



}

);



}







if(attendanceCanvas){



attendanceChartInstance =
new Chart(
attendanceCanvas,
{


type:"pie",


data:{


labels:[

"Present",

"Absent"

],



datasets:[{


data:[

data.presentStudents || 0,

data.absentStudents || 0

]


}]


}



}

);



}




}