// =====================================================
// STUDENT MANAGEMENT SYSTEM
// ADMIN DASHBOARD JS
// Developer : Hansika Sivani
// =====================================================


const API =
"https://student-management-system-major-1.onrender.com";



let studentChartInstance = null;

let attendanceChartInstance = null;



// =====================================================
// DATE TIME
// =====================================================


function updateDateTime(){


const now = new Date();


const date =
document.getElementById("currentDate");


const time =
document.getElementById("currentTime");



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



setInterval(
updateDateTime,
1000
);


updateDateTime();




// =====================================================
// LOAD DASHBOARD
// =====================================================


async function loadDashboard(){


try{


const studentResponse =
await fetch(
`${API}/students`
);


const studentData =
await studentResponse.json();



const attendanceResponse =
await fetch(
`${API}/attendance`
);


const attendanceData =
await attendanceResponse.json();





const resultResponse =
await fetch(
`${API}/results`
);


const resultData =
await resultResponse.json();






let students =
studentData.students || [];



let attendance =
attendanceData.attendance || [];



let results =
resultData.results || [];





console.log(
"Students",
students
);


console.log(
"Attendance",
attendance
);


console.log(
"Results",
results
);





// =====================================================
// MAIN CARDS
// =====================================================


update(
"totalStudents",
students.length
);



const present =
attendance.filter(
a=>a.status==="Present"
).length;



const absent =
attendance.filter(
a=>a.status==="Absent"
).length;



const attendancePercentage =
attendance.length
?
Math.round(
(present/attendance.length)*100
)
:
0;



update(
"presentStudents",
present
);



update(
"attendancePercentage",
attendancePercentage+"%"
);






let totalMarks=0;

let pass=0;



results.forEach(r=>{


totalMarks +=
Number(r.marks);


if(r.status==="Pass"){

pass++;

}


});




const average =
results.length
?
(totalMarks/results.length).toFixed(2)
:
0;




const passPercentage =
results.length
?
Math.round(
(pass/results.length)*100
)
:
0;



update(
"averageMarks",
average+"%"
);



update(
"passPercentage",
passPercentage+"%"
);



update(
"resultsCount",
results.length
);





const departments =
[
...new Set(
students.map(
s=>s.department
)
)
];



update(
"totalDepartments",
departments.length
);



if(students.length){

update(
"latestStudent",
students[students.length-1].name
);

}






// =====================================================
// DEPARTMENT ANALYTICS
// =====================================================


const deptNames =
[
"CSE",
"ECE",
"EEE",
"Mechanical",
"Civil"
];



deptNames.forEach(
dept=>{


const deptStudents =
students.filter(
s=>s.department===dept
);



const deptRolls =
deptStudents.map(
s=>s.roll
);




const deptAttendance =
attendance.filter(
a=>
deptRolls.includes(a.roll)
);




const deptResults =
results.filter(
r=>
deptRolls.includes(r.roll)
);





const deptPresent =
deptAttendance.filter(
a=>a.status==="Present"
).length;




const deptAbsent =
deptAttendance.filter(
a=>a.status==="Absent"
).length;




const deptPercentage =
deptAttendance.length
?
Math.round(
(deptPresent/deptAttendance.length)*100
)
:
0;





let marks=0;

let deptPass=0;



deptResults.forEach(r=>{


marks += Number(r.marks);



if(r.status==="Pass"){

deptPass++;

}


});




const deptAverage =
deptResults.length
?
(marks/deptResults.length).toFixed(2)
:
0;




let id =
dept
.toLowerCase()
.replace("mechanical","mech");




update(
`${id}Students`,
deptStudents.length
);



update(
`${id}Present`,
deptPresent
);



update(
`${id}Absent`,
deptAbsent
);



update(
`${id}Attendance`,
deptPercentage+"%"
);



update(
`${id}Results`,
deptResults.length
);



update(
`${id}Average`,
deptAverage
);



});





createAttendanceChart(
present,
absent
);



createStudentChart(
pass,
results.length-pass
);





}

catch(error){


console.log(
"Dashboard Error",
error
);


}



}





// =====================================================
// UPDATE ELEMENT
// =====================================================


function update(id,value){


const element =
document.getElementById(id);



if(element){

element.innerHTML=value;

}


}





// =====================================================
// RECENT STUDENTS
// =====================================================


async function loadStudents(){


try{


const response =
await fetch(
`${API}/students`
);


const data =
await response.json();



const table =
document.getElementById(
"recentStudentTable"
);



if(!table)return;



table.innerHTML="";



data.students
.slice(0,5)
.forEach(
student=>{


table.innerHTML +=`

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


catch(error){

console.log(error);

}


}







// =====================================================
// RESULT CHART
// =====================================================


function createStudentChart(pass,fail){


const canvas =
document.getElementById(
"studentChart"
);


if(!canvas)return;



if(studentChartInstance){

studentChartInstance.destroy();

}




studentChartInstance =
new Chart(
canvas,
{

type:"bar",


data:{

labels:[
"Pass",
"Fail"
],


datasets:[{

data:[
pass,
fail
]

}]

},


options:{

responsive:true

}


});


}








// =====================================================
// ATTENDANCE CHART
// =====================================================


function createAttendanceChart(
present,
absent
){


const canvas =
document.getElementById(
"attendanceChart"
);



if(!canvas)return;




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

data:[
present,
absent
]

}]


},


options:{

responsive:true

}


}

);


}







// =====================================================
// LOGOUT
// =====================================================


const logout =
document.getElementById(
"logout"
);



if(logout){


logout.onclick=function(){


localStorage.clear();

sessionStorage.clear();


location.href="login.html";


};


}







// =====================================================
// START
// =====================================================


loadDashboard();

loadStudents();




setInterval(
()=>{

loadDashboard();

loadStudents();

},
30000
);



console.log(
"Admin Dashboard Loaded Successfully"
);