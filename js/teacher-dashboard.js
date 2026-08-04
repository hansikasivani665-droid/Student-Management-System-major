// ======================================
// STUDENT MANAGEMENT SYSTEM
// TEACHER DASHBOARD
// ======================================

console.log("Teacher Dashboard Loaded");


const API = window.API_BASE || window.location.origin;



if(localStorage.getItem("loggedIn") !== "true"){

    location.href="/html/login.html";

}



let teacherId = "";
let teacherDepartment = "";
let teacherSubject = "";




// ======================================
// PAGE LOAD
// ======================================

document.addEventListener(
"DOMContentLoaded",
async ()=>{


    await resolveTeacherDetails();


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


            location.href="/html/login.html";


        };


    }


});




// ======================================
// GET TEACHER DETAILS
// ======================================

async function resolveTeacherDetails(){


let teacher =
JSON.parse(
localStorage.getItem("teacher") || "null"
);



if(!teacher){


const email =
localStorage.getItem("currentUser");



if(email){


try{


const response =
await fetch(

`${API}/teachers/email/${encodeURIComponent(email)}`

);



const data =
await response.json();



if(data.success){


teacher=data.teacher;



localStorage.setItem(

"teacher",

JSON.stringify(teacher)

);


}



}


catch(error){


console.log(
"Teacher fetch error:",
error
);


}



}



}





if(teacher){



teacherId =
teacher.teacherId || "";



teacherDepartment =
teacher.department || "";



teacherSubject =
teacher.subject || "";



const name =
document.getElementById(
"teacherName"
);



if(name){


name.innerHTML =
"Welcome " + teacher.name;


}



}



console.log(
"Teacher Details",
{

teacherId,
teacherDepartment,
teacherSubject

}

);



}








// ======================================
// DATE TIME
// ======================================


function showDateTime(){



const date =
document.getElementById(
"currentDate"
);



const time =
document.getElementById(
"currentTime"
);



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
// LOAD DASHBOARD DATA
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

student.department &&

teacherDepartment &&

student.department.toLowerCase()

===

teacherDepartment.toLowerCase()


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


result.department &&

result.subject &&

teacherDepartment &&

teacherSubject &&



result.department.toLowerCase()

===

teacherDepartment.toLowerCase()



&&



result.subject.toLowerCase()

===

teacherSubject.toLowerCase()



);





update(

"resultsCount",

results.length

);








// ===============================
// ATTENDANCE
// ===============================


const today =

new Date()

.toISOString()

.split("T")[0];





const attendanceQuery =

new URLSearchParams({

department:teacherDepartment,

subject:teacherSubject,

teacherId:teacherId,

date:today

});





const attendanceResponse =

await fetch(

`${API}/attendance?${attendanceQuery}`

);






const attendanceData =

await attendanceResponse.json();






let attendance =

attendanceData.attendance || [];






attendance =

attendance.filter(

item =>

item.status==="Present"

||

item.status==="Absent"


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






console.log(

"Teacher Dashboard Data",

{

students:students.length,

results:results.length,

present,

absent

}

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







// Refresh every 30 seconds

setInterval(

()=>{

loadTeacherDashboard();

},

30000

);