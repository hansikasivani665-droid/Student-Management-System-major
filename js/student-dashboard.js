const STUDENT_API =   "https://onrender.com"; 
const RESULT_API =     "https://onrender.com";
const ATTENDANCE_API = "https://onrender.com";




// Student Login Check

if(localStorage.getItem("loggedIn") !== "true"){

    location.href="login.html";

}




let studentRoll = null;






document.addEventListener("DOMContentLoaded",()=>{


    loadStudentProfile();


});




// ======================================
// STUDENT PROFILE
// ======================================


async function loadStudentProfile(){


try{


const email =
localStorage.getItem("currentUser");



let response =
await fetch(`${STUDENT_API}/email/${email}`);



let data =
await response.json();



if(data.success){



let student =
data.student;



studentRoll =
student.roll;




document.getElementById("studentName").innerHTML =
student.name;



document.getElementById("studentRoll").innerHTML =
student.roll;



document.getElementById("studentDepartment").innerHTML =
student.department;



document.getElementById("studentYear").innerHTML =
student.year;



document.getElementById("studentEmail").innerHTML =
student.email;



document.getElementById("studentPhone").innerHTML =
student.phone;




// Now that we have the roll, load the rest

loadStudentResults();

loadStudentAttendance();



}

else{

console.log("Student not found");

}



}

catch(error){

console.log("Profile Error:",error);

}



}









// ======================================
// RESULTS
// ======================================


async function loadStudentResults(){


try{


let response =
await fetch(RESULT_API);



let data =
await response.json();




if(data.success){



let results =
data.results.filter(
r=>r.roll===studentRoll
);







// Total Results

document.getElementById("totalResults").innerHTML =
results.length;








// Subjects


let subjects =
[
...new Set(
results.map(
r=>r.subject
)
)
];



document.getElementById("totalSubjects").innerHTML =
subjects.length;








// Average Marks


let total = 0;



results.forEach(r=>{


total += Number(r.marks);


});




let average = 0;



if(results.length>0){


average =
(
total/results.length
)
.toFixed(2);


}




document.getElementById("averageMarks").innerHTML =
average+"%";








// Highest Marks


let highest = 0;



results.forEach(r=>{


if(Number(r.marks)>highest){

highest = Number(r.marks);

}


});



document.getElementById("highestMarks").innerHTML =
highest;







// Result Status


let failed =
results.filter(
r=>r.status==="Fail"
).length;



if(failed===0){


document.getElementById("resultStatus").innerHTML =
"Pass";


}

else{


document.getElementById("resultStatus").innerHTML =
"Fail";


}








// Results Table


let table =
document.getElementById("studentResultBody");



table.innerHTML="";



results.forEach(r=>{


table.innerHTML += `

<tr>

<td>${r.subject}</td>

<td>${r.marks}</td>

<td>${r.grade}</td>

<td>${r.status}</td>

</tr>

`;


});



}



}

catch(error){

console.log("Result Error:",error);

}



}









// ======================================
// ATTENDANCE
// ======================================


async function loadStudentAttendance(){



try{


let response =
await fetch(ATTENDANCE_API);



let data =
await response.json();





if(data.success){



let attendance =
data.attendance.filter(
a=>a.roll===studentRoll
);






let totalDays =
attendance.length;



let presentDays =
attendance.filter(
a=>a.status==="Present"
).length;



let absentDays =
attendance.filter(
a=>a.status==="Absent"
).length;







let percentage = 0;



if(totalDays>0){


percentage =
(
presentDays /
totalDays *
100
)
.toFixed(2);



}






document.getElementById("totalDays").innerHTML =
totalDays;



document.getElementById("presentDays").innerHTML =
presentDays;



document.getElementById("absentDays").innerHTML =
absentDays;



document.getElementById("attendancePercentage").innerHTML =
percentage+"%";



}



}

catch(error){

console.log("Attendance Error:",error);

}



}







// ======================================
// LOGOUT
// ======================================


function logout(){


localStorage.clear();


location.href="login.html";


}