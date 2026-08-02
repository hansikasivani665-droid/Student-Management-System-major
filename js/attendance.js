// =============================================
// STUDENT MANAGEMENT SYSTEM
// ADMIN ATTENDANCE MODULE
// =============================================


if(localStorage.getItem("loggedIn") !== "true"){

window.location.href="/html/login.html";

}




// ===============================
// API
// ===============================


const STUDENT_API =
"https://student-management-system-major-1.onrender.com/students";


const ATTENDANCE_API =
"https://student-management-system-major-1.onrender.com/attendance";



let attendanceData=[];




// ===============================
// PAGE LOAD
// ===============================


document.addEventListener(
"DOMContentLoaded",
()=>{


document.getElementById("todayDate").innerHTML =
new Date().toLocaleDateString(
"en-IN",
{
day:"2-digit",
month:"long",
year:"numeric"
}
);



loadAttendance();



document
.getElementById("searchStudent")
.addEventListener(
"keyup",
filterStudents
);



document
.getElementById("departmentFilter")
.addEventListener(
"change",
filterStudents
);



document
.getElementById("yearFilter")
.addEventListener(
"change",
filterStudents
);



});








// ===============================
// LOAD ATTENDANCE
// ===============================


async function loadAttendance(){


try{


const studentResponse =
await fetch(STUDENT_API);


const studentData =
await studentResponse.json();



const attendanceResponse =
await fetch(ATTENDANCE_API);


const attendanceResult =
await attendanceResponse.json();




const students =
studentData.students || [];



const attendance =
attendanceResult.attendance || [];






attendanceData =
students.map(student=>{



const records =

attendance.filter(

a=>

a.roll === student.roll

);




let status="Absent";



// check today's attendance

if(records.length>0){


let todayRecord =
records.find(

r=>

r.date ===
new Date()
.toISOString()
.split("T")[0]

);



if(todayRecord){

status =
todayRecord.status;

}


}





return{


roll:student.roll,

name:student.name,

department:student.department,

year:student.year,

status:status


};



});





renderTable(attendanceData);



}




catch(error){

console.log(
"Attendance Error:",
error
);

}



}









// ===============================
// DISPLAY TABLE
// ===============================


function renderTable(data){



const table =
document.getElementById(
"attendanceBody"
);



table.innerHTML="";



data.forEach(student=>{



table.innerHTML += `


<tr>


<td>${student.roll}</td>


<td>${student.name}</td>


<td>${student.department}</td>


<td>${student.year}</td>


<td>


<label>

<input

type="radio"

name="attendance_${student.roll}"

value="Present"

data-roll="${student.roll}"

class="attendanceRadio"

${student.status==="Present"?"checked":""}

>

Present

</label>



<label>


<input

type="radio"

name="attendance_${student.roll}"

value="Absent"

data-roll="${student.roll}"

class="attendanceRadio"

${student.status==="Absent"?"checked":""}

>

Absent

</label>



</td>


</tr>


`;



});



updateStatistics(data);




document
.querySelectorAll(".attendanceRadio")
.forEach(input=>{


input.addEventListener(
"change",
()=>{


let student =
attendanceData.find(
s=>

s.roll === input.dataset.roll

);



if(student){

student.status =
input.value;

}



updateStatistics(
attendanceData
);



});


});



}








// ===============================
// CARDS
// ===============================


function updateStatistics(data){


let total =
data.length;



let present =
data.filter(
s=>
s.status==="Present"
).length;




let absent =
total-present;



let percentage =

total

?

Math.round(
(present/total)*100
)

:

0;




document.getElementById(
"totalStudents"
).innerHTML =
total;



document.getElementById(
"presentCount"
).innerHTML =
present;



document.getElementById(
"absentCount"
).innerHTML =
absent;



document.getElementById(
"attendancePercentage"
).innerHTML =
percentage+"%";



}








// ===============================
// FILTER
// ===============================


function filterStudents(){


let keyword =
document
.getElementById("searchStudent")
.value
.toLowerCase();



let dept =
document
.getElementById("departmentFilter")
.value;



let year =
document
.getElementById("yearFilter")
.value;





let filtered =

attendanceData.filter(student=>{


return (

student.name
.toLowerCase()
.includes(keyword)

||

student.roll
.toLowerCase()
.includes(keyword)

)

&&

(
dept==="All"
||
student.department===dept
)

&&

(
year==="All"
||
student.year===year
)



});




renderTable(filtered);



}