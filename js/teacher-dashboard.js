// ======================================
// Teacher Dashboard
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
// GET TEACHER DATA
// ======================================

const teacher =
JSON.parse(
localStorage.getItem("teacher")
);



let teacherId="";
let teacherDepartment="";
let teacherSubject="";



if(teacher){

    teacherId =
    teacher.teacherId;

    teacherDepartment =
    teacher.department;

    teacherSubject =
    teacher.subject;

}




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

logout.addEventListener(

"click",

()=>{


localStorage.clear();

sessionStorage.clear();

location.href="login.html";


}

);

}


}

);





// ======================================
// DATE TIME
// ======================================


function showDateTime(){


const d =
new Date();



const date =
document.getElementById("currentDate");


const time =
document.getElementById("currentTime");



if(date){

date.innerHTML =
d.toLocaleDateString(
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
d.toLocaleTimeString();

}



}







// ======================================
// LOAD DASHBOARD
// ======================================


async function loadTeacherDashboard(){



try{


// ======================================
// STUDENTS
// ======================================


const studentResponse =
await fetch(

`${API}/students?department=${teacherDepartment}`

);



const studentData =
await studentResponse.json();



let students=[];



if(studentData.success){


students =
studentData.students;


}




// total students for teacher department


const totalStudents =
students.length;



const totalElement =
document.getElementById(
"totalStudents"
);



if(totalElement){

totalElement.innerHTML =
totalStudents;

}






// ======================================
// RESULTS FILTER
// ======================================


const resultResponse =
await fetch(

`${API}/results`

);



const resultData =
await resultResponse.json();



let results=[];



if(resultData.success){



results =
resultData.results.filter(

result=>

result.subject === teacherSubject

&&

result.department === teacherDepartment

);



}





const resultCount =
document.getElementById(
"resultsCount"
);



if(resultCount){

resultCount.innerHTML =
results.length;

}




let totalMarks=0;

let pass=0;



results.forEach(result=>{


totalMarks +=
Number(result.marks);



if(result.status==="Pass"){

pass++;

}


});



const average =
results.length>0

?

(totalMarks/results.length)
.toFixed(2)

:

0;



const percentage =
results.length>0

?

((pass/results.length)*100)
.toFixed(0)

:

0;




const avgElement =
document.getElementById(
"averageMarks"
);


if(avgElement){

avgElement.innerHTML =
average+"%";

}



const passElement =
document.getElementById(
"passPercentage"
);



if(passElement){

passElement.innerHTML =
percentage+"%";

}






// ======================================
// ATTENDANCE FILTER
// ======================================


const attendanceResponse =
await fetch(

`${API}/attendance`

);



const attendanceData =
await attendanceResponse.json();



let attendance=[];



if(attendanceData.success){



attendance =

attendanceData.attendance.filter(

item=>

item.subject===teacherSubject

&&

item.department===teacherDepartment

);


}





const present =

attendance.filter(

a=>

a.status==="Present"

).length;





const absent =

attendance.filter(

a=>

a.status==="Absent"

).length;







const presentElement =
document.getElementById(
"presentStudents"
);



if(presentElement){

presentElement.innerHTML =
present;

}




const absentElement =
document.getElementById(
"absentStudents"
);



if(absentElement){

absentElement.innerHTML =
absent;

}





}

catch(error){


console.error(
"Dashboard Error:",
error
);


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