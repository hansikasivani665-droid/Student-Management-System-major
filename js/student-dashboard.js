// =====================================================
// STUDENT DASHBOARD
// =====================================================


const API =
"https://student-management-system-backend.onrender.com";



if (localStorage.getItem("loggedIn") !== "true") {

    window.location.href = "/html/login.html";

}



let studentRoll = "";



document.addEventListener(
"DOMContentLoaded",
()=>{

    loadStudentProfile();

});





// =====================================================
// LOAD PROFILE
// =====================================================


async function loadStudentProfile(){


try{


const email =
localStorage.getItem("currentUser");



const response =
await fetch(
`${API}/students/email/${encodeURIComponent(email)}`
);



const data =
await response.json();



console.log(
"Student Data:",
data
);



if(!data.success){


alert("Student not found");

return;


}



const student =
data.student;



studentRoll =
student.roll;




document.getElementById("studentName").textContent =
student.name;


document.getElementById("studentRoll").textContent =
student.roll;


document.getElementById("studentDepartment").textContent =
student.department;


document.getElementById("studentYear").textContent =
student.year;


document.getElementById("studentEmail").textContent =
student.email;


document.getElementById("studentPhone").textContent =
student.phone;




await loadStudentResults();


await loadStudentAttendance();



}


catch(err){

console.error(
"Student Profile Error:",
err
);

}


}







// =====================================================
// LOAD RESULTS
// =====================================================


async function loadStudentResults(){


try{


const response =
await fetch(
`${API}/results`
);



const data =
await response.json();



if(!data.success)
return;



const results =
data.results.filter(
r=>r.roll===studentRoll
);




document.getElementById("totalResults").textContent =
results.length;



const subjects =
[...new Set(results.map(r=>r.subject))];



document.getElementById("totalSubjects").textContent =
subjects.length;




let total=0;

let highest=0;



results.forEach(r=>{


total += Number(r.marks || 0);



if(Number(r.marks)>highest){

highest =
Number(r.marks);

}


});




const average =
results.length
?
(total/results.length).toFixed(2)
:
0;




document.getElementById("averageMarks").textContent =
average+"%";



document.getElementById("highestMarks").textContent =
highest;



const failed =
results.filter(
r=>r.status==="Fail"
).length;



document.getElementById("resultStatus").textContent =
failed===0
?
"Pass"
:
"Fail";





const tbody =
document.getElementById(
"studentResultBody"
);



tbody.innerHTML="";



if(results.length===0){


tbody.innerHTML =
`
<tr>
<td colspan="4">
No Results Found
</td>
</tr>
`;

return;


}





results.forEach(r=>{


tbody.innerHTML +=

`
<tr>

<td>${r.subject}</td>

<td>${r.marks}</td>

<td>${r.grade}</td>

<td>${r.status}</td>

</tr>
`;


});



}


catch(err){

console.error(
"Results Error:",
err
);

}



}







// =====================================================
// LOAD ATTENDANCE
// =====================================================


async function loadStudentAttendance(){


try{


const response =
await fetch(
`${API}/attendance/student/${studentRoll}`
);



const data =
await response.json();



console.log(
"Attendance Data:",
data
);



if(!data.success)
return;




document.getElementById("totalDays").textContent =
data.summary.totalDays;



document.getElementById("presentDays").textContent =
data.summary.present;



document.getElementById("absentDays").textContent =
data.summary.absent;



document.getElementById("attendancePercentage").textContent =
data.summary.percentage+"%";



}


catch(err){

console.error(
"Attendance Error:",
err
);


}


}







// =====================================================
// LOGOUT
// =====================================================


function logout(){


localStorage.clear();

sessionStorage.clear();


window.location.href =
"/html/login.html";


}