// ======================================
// Teacher Dashboard
// ======================================


const API =
"https://student-management-system-major-1.onrender.com";



const STUDENT_API =
`${API}/students`;

const RESULT_API =
`${API}/results`;

const ATTENDANCE_API =
`${API}/attendance`;



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


if(teacher){

    teacherId =
    teacher.teacherId;


    const name =
    document.getElementById("teacherName");


    if(name){

        name.innerHTML =
        `Welcome ${teacher.name}`;

    }

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


});


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
// LOAD DASHBOARD DATA
// ======================================


async function loadTeacherDashboard(){


try{



// ======================================
// TOTAL STUDENTS
// ======================================


const studentResponse =
await fetch(STUDENT_API);



const studentData =
await studentResponse.json();



if(studentData.success){



const students =
studentData.students;



// show only teacher department students


let teacherStudents =
students;



if(teacher && teacher.department){


teacherStudents =
students.filter(

s=>

s.department ===
teacher.department

);


}




const total =
document.getElementById(
"totalStudents"
);



if(total){

total.innerHTML =
teacherStudents.length;


}



}







// ======================================
// RESULTS COUNT
// ======================================


const resultResponse =
await fetch(RESULT_API);



const resultData =
await resultResponse.json();



if(resultData.success){


let results =
resultData.results;



if(teacher && teacher.department){


results =
results.filter(

r=>

r.department ===
teacher.department

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


}







// ======================================
// ATTENDANCE
// ======================================



let url =
ATTENDANCE_API;



if(teacherId){


url +=
`?teacherId=${teacherId}`;


}



const attendanceResponse =
await fetch(url);



const attendanceData =
await attendanceResponse.json();




if(attendanceData.success){



const attendance =
attendanceData.attendance;



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





const presentBox =
document.getElementById(
"presentStudents"
);



const absentBox =
document.getElementById(
"absentStudents"
);





if(presentBox){

presentBox.innerHTML =
present;

}




if(absentBox){

absentBox.innerHTML =
absent;

}




}




}

catch(error){


console.error(

"Teacher Dashboard Error:",

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




console.log(
"====================================="
);

console.log(
"Teacher Dashboard Loaded Successfully"
);

console.log(
"====================================="
);