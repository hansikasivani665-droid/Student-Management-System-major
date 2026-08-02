// ======================================
// STUDENT MANAGEMENT SYSTEM
// TEACHER DASHBOARD
// ======================================


console.log("Teacher Dashboard Loaded");



// ======================================
// API
// ======================================

const API =
"https://student-management-system-major-1.onrender.com";




// ======================================
// LOGIN CHECK
// ======================================

if(localStorage.getItem("loggedIn") !== "true"){

    location.href="login.html";

}




// ======================================
// GET TEACHER DETAILS
// ======================================

const teacher =
JSON.parse(
localStorage.getItem("teacher")
);



let teacherId="";
let teacherDepartment="";
let teacherSubject="";



if(teacher){

    teacherId = teacher.teacherId;
    teacherDepartment = teacher.department;
    teacherSubject = teacher.subject;

}



console.log("Teacher:",teacher);





// ======================================
// PAGE LOAD
// ======================================

document.addEventListener(
"DOMContentLoaded",
()=>{


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

location.href="login.html";

};

}



});







// ======================================
// DATE TIME
// ======================================


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








// ======================================
// LOAD TEACHER DASHBOARD
// ======================================


async function loadTeacherDashboard(){


try{


// ===============================
// STUDENTS
// ===============================


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
student.department === teacherDepartment
);



update(
"totalStudents",
students.length
);






// ===============================
// RESULTS
// ===============================


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

result.department === teacherDepartment

&&

result.subject === teacherSubject

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








// ===============================
// ATTENDANCE
// ===============================



const attendanceResponse =
await fetch(

`${API}/attendance?department=${teacherDepartment}&subject=${teacherSubject}&teacherId=${teacherId}`

);



const attendanceData =
await attendanceResponse.json();



let attendance =
attendanceData.attendance || [];





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







// ======================================
// UPDATE CARD
// ======================================


function update(id,value){


const element =
document.getElementById(id);



if(element){

element.innerHTML=value;

}


}







// ======================================
// AUTO REFRESH
// ======================================


setInterval(
()=>{

loadTeacherDashboard();

},
30000
);