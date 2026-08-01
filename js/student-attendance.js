// ===============================
// Check Login
// ===============================

if(localStorage.getItem("loggedIn") !== "true"){

    location.href="login.html";

}


const STUDENT_API = "https://student-management-system-major.onrender.com/students";

const ATTENDANCE_API = "https://student-management-system-major.onrender.com/attendance";



// ===============================
// Load Attendance
// ===============================

document.addEventListener(
"DOMContentLoaded",
()=>{

    loadAttendance();

});




async function loadAttendance(){


try{


const email =
localStorage.getItem("currentUser");



// Get student details

let studentResponse =
await fetch(
`${STUDENT_API}/email/${email}`
);



let studentData =
await studentResponse.json();



if(!studentData.success){

    alert("Student details not found");
    return;

}



const roll =
studentData.student.roll;



// Get attendance using roll

let response =
await fetch(
`${ATTENDANCE_API}/student/${roll}`
);



let data =
await response.json();



const table =
document.getElementById("attendanceTable");



table.innerHTML="";



if(data.success && data.attendance.length>0){


data.attendance.forEach(record=>{


table.innerHTML += `

<tr>

<td>${record.date}</td>

<td>${record.status}</td>

</tr>

`;


});


}

else{


table.innerHTML=`

<tr>

<td colspan="2">
No Attendance Records Found
</td>

</tr>

`;


}



}


catch(error){

console.log(error);

}


}