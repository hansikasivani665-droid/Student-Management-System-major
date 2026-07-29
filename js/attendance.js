// =============================================
// STUDENT MANAGEMENT SYSTEM
// Attendance Module
// =============================================


// Login Check
if (localStorage.getItem("loggedIn") !== "true") {

    window.location.href = "login.html";

}



const API_URL = "http://localhost:5000/attendance";


let attendanceData = [];




// =============================================
// PAGE LOAD
// =============================================


document.addEventListener("DOMContentLoaded",()=>{


document.getElementById("todayDate").innerHTML =

new Date().toLocaleDateString("en-GB",{

day:"2-digit",
month:"long",
year:"numeric"

});



loadAttendance();



document
.getElementById("searchStudent")
.addEventListener("keyup",filterStudents);



document
.getElementById("departmentFilter")
.addEventListener("change",filterStudents);



document
.getElementById("yearFilter")
.addEventListener("change",filterStudents);



document
.getElementById("markPresent")
.addEventListener("click",markAllPresent);



document
.getElementById("markAbsent")
.addEventListener("click",markAllAbsent);



document
.getElementById("attendanceForm")
.addEventListener("submit",saveAttendance);



});








// =============================================
// LOAD ATTENDANCE
// =============================================


async function loadAttendance(){



const table =
document.getElementById("attendanceBody");



table.innerHTML = `

<tr>

<td colspan="5">

Loading Students...

</td>

</tr>

`;



try{


let response =
await fetch(API_URL);



let data =
await response.json();



console.log(data);



if(data.success){


attendanceData =
data.attendance;



// Default absent if no record

attendanceData.forEach(student=>{


if(student.status===null){

student.status="Absent";

}


});



renderTable(attendanceData);



}


else{


table.innerHTML=

`
<tr>
<td colspan="5">
No Data Found
</td>
</tr>
`

}



}

catch(error){


console.log(error);


table.innerHTML=

`
<tr>
<td colspan="5">
Backend Connection Failed
</td>
</tr>
`


}



}









// =============================================
// DISPLAY TABLE
// =============================================


function renderTable(students){



const table =
document.getElementById("attendanceBody");



table.innerHTML="";



students.forEach(student=>{



table.innerHTML += `


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



<label>


<input

type="radio"

name="attendance_${student.roll}"

class="attendanceRadio"

data-roll="${student.roll}"

value="Present"

${student.status==="Present" ? "checked":""}

>

Present


</label>




<label>


<input

type="radio"

name="attendance_${student.roll}"

class="attendanceRadio"

data-roll="${student.roll}"

value="Absent"

${student.status==="Absent" ? "checked":""}

>

Absent


</label>



</td>



</tr>


`;



});



updateStatistics(students);





// Store changes


document
.querySelectorAll(".attendanceRadio")
.forEach(input=>{


input.addEventListener("change",()=>{


let roll =
input.dataset.roll;



let student =
attendanceData.find(
s=>s.roll===roll
);



if(student){


student.status=input.value;


}



});


});



}









// =============================================
// UPDATE CARDS
// =============================================


function updateStatistics(data){



let total =
data.length;



let present =
data.filter(
s=>s.status==="Present"
).length;



let absent =
total-present;



let percentage =

total===0

?
0

:

Math.round(
(present/total)*100
);



document
.getElementById("totalStudents")
.innerHTML=total;



document
.getElementById("presentCount")
.innerHTML=present;



document
.getElementById("absentCount")
.innerHTML=absent;



document
.getElementById("attendancePercentage")
.innerHTML=
percentage+"%";



}









// =============================================
// SEARCH FILTER
// =============================================


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


let search =


student.name
.toLowerCase()
.includes(keyword)


||

student.roll
.toLowerCase()
.includes(keyword);




let department =

dept==="All"

||

student.department===dept;



let studyYear =

year==="All"

||

student.year===year;



return search && department && studyYear;



});



renderTable(filtered);



}









// =============================================
// MARK ALL PRESENT
// =============================================


function markAllPresent(){



document
.querySelectorAll('input[value="Present"]')
.forEach(input=>{


input.checked=true;



let roll =
input.dataset.roll;



let student =
attendanceData.find(
s=>s.roll===roll
);



if(student){

student.status="Present";

}



});



updateStatistics(attendanceData);



}









// =============================================
// MARK ALL ABSENT
// =============================================


function markAllAbsent(){



document
.querySelectorAll('input[value="Absent"]')
.forEach(input=>{


input.checked=true;



let roll =
input.dataset.roll;



let student =
attendanceData.find(
s=>s.roll===roll
);



if(student){

student.status="Absent";

}



});



updateStatistics(attendanceData);



}









// =============================================
// SAVE ATTENDANCE
// =============================================


async function saveAttendance(e){



e.preventDefault();



try{



for(let student of attendanceData){



await fetch(API_URL,{

method:"POST",


headers:{


"Content-Type":
"application/json"

},


body:JSON.stringify({

roll:student.roll,

status:student.status


})


});



}



alert(
"Attendance Saved Successfully"
);



loadAttendance();



}


catch(error){


console.log(error);


alert(
"Attendance Save Failed"
);



}



}