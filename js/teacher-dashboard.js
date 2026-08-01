const STUDENT_API = "https://student-management-system-major.onrender.com/students";
const RESULT_API = "https://student-management-system-major.onrender.com/results";
const ATTENDANCE_API = "https://student-management-system-major.onrender.com/attendance";


if(localStorage.getItem("loggedIn") !== "true"){

    location.href="login.html";

}



document.addEventListener("DOMContentLoaded",()=>{

    loadTeacherDashboard();

    showDateTime();

    setInterval(showDateTime,1000);



    const logout=document.getElementById("logout");


    if(logout){

        logout.onclick=()=>{

            localStorage.clear();

            location.href="login.html";

        }

    }


});




// ===============================
// DATE TIME
// ===============================

function showDateTime(){

    let d=new Date();


    if(document.getElementById("currentDate")){

        document.getElementById("currentDate").innerHTML =
        d.toLocaleDateString();

    }



    if(document.getElementById("currentTime")){

        document.getElementById("currentTime").innerHTML =
        d.toLocaleTimeString();

    }

}





// ===============================
// LOAD TEACHER DASHBOARD
// ===============================

async function loadTeacherDashboard(){


try{


// ===============================
// STUDENTS
// ===============================

let studentResponse =
await fetch(STUDENT_API);


let studentData =
await studentResponse.json();



if(studentData.success){


let students =
studentData.students;



if(document.getElementById("totalStudents")){


document.getElementById("totalStudents").innerHTML =
students.length;


}


}





// ===============================
// RESULTS
// ===============================


let resultResponse =
await fetch(RESULT_API);


let resultData =
await resultResponse.json();



if(resultData.success){


if(document.getElementById("resultsCount")){


document.getElementById("resultsCount").innerHTML =
resultData.results.length;


}


}





// ===============================
// ATTENDANCE
// ===============================


let attendanceResponse =
await fetch(ATTENDANCE_API);


let attendanceData =
await attendanceResponse.json();



if(attendanceData.success){


let attendance =
attendanceData.attendance;



let present =
attendance.filter(
a=>a.status==="Present"
).length;



let absent =
attendance.filter(
a=>a.status==="Absent"
).length;



if(document.getElementById("presentStudents")){


document.getElementById("presentStudents").innerHTML =
present;


}



if(document.getElementById("absentStudents")){


document.getElementById("absentStudents").innerHTML =
absent;


}



}





}
catch(error){

console.log(error);

}


}