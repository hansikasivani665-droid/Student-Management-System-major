const STUDENT_API = "http://localhost:5000/students";
const RESULT_API = "http://localhost:5000/results";
const ATTENDANCE_API = "http://localhost:5000/attendance";


// Login check

if(localStorage.getItem("loggedIn") !== "true"){

    location.href = "login.html";

}



document.addEventListener("DOMContentLoaded",()=>{

    loadDashboard();

    showDateTime();

    setInterval(showDateTime,1000);

});




// ===============================
// DATE & TIME
// ===============================

function showDateTime(){

    let d = new Date();


    let date =
    document.getElementById("currentDate");


    let time =
    document.getElementById("currentTime");



    if(date){

        date.innerHTML =
        d.toLocaleDateString();

    }


    if(time){

        time.innerHTML =
        d.toLocaleTimeString();

    }

}






// ===============================
// LOAD DASHBOARD
// ===============================

async function loadDashboard(){


    loadStudents();

    loadResults();

    loadAttendance();


}







// ===============================
// STUDENTS
// ===============================


async function loadStudents(){


try{


let response =
await fetch(STUDENT_API);



let data =
await response.json();



console.log("Students:",data);



if(data.success){



let students =
data.students;



document.getElementById("totalStudents").innerHTML =
students.length;





let departments =
[
...new Set(
students.map(
s=>s.department
)
)
];



document.getElementById("totalDepartments").innerHTML =
departments.length;





if(students.length>0){


document.getElementById("latestStudent").innerHTML =
students[0].name;


}



}



}

catch(error){

console.log("Student Error:",error);

}


}









// ===============================
// RESULTS
// ===============================


async function loadResults(){


try{


let response =
await fetch(RESULT_API);



let data =
await response.json();



console.log("Results:",data);



if(data.success){



let results =
data.results;





// Total Results

document.getElementById("resultsCount").innerHTML =
results.length;








// Total Subjects

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


let totalMarks = 0;



results.forEach(r=>{


totalMarks += Number(r.marks);


});




let average = 0;



if(results.length > 0){


average =
(
totalMarks / results.length
)
.toFixed(2);


}



document.getElementById("averageMarks").innerHTML =
average+"%";









// ===============================
// PASS PERCENTAGE
// ===============================


let passedStudents =
results.filter(
r=>r.status==="Pass"
).length;



let passPercentage = 0;



if(results.length > 0){


passPercentage =
(
passedStudents /
results.length *
100
)
.toFixed(2);


}



document.getElementById("passPercentage").innerHTML =
passPercentage+"%";



}




}

catch(error){

console.log("Result Error:",error);

}


}









// ===============================
// ATTENDANCE
// ===============================


async function loadAttendance(){


try{


let response =
await fetch(ATTENDANCE_API);



let data =
await response.json();



console.log("Attendance:",data);




if(data.success){



let attendance =
data.attendance;





let present =
attendance.filter(
a=>a.status==="Present"
).length;





let absent =
attendance.filter(
a=>a.status==="Absent"
).length;






document.getElementById("presentStudents").innerHTML =
present;



document.getElementById("absentStudents").innerHTML =
absent;







let percentage = 0;



if(attendance.length>0){


percentage =
(
present /
attendance.length *
100
)
.toFixed(2);


}



document.getElementById("attendancePercentage").innerHTML =
percentage+"%";



}



}

catch(error){

console.log("Attendance Error:",error);

}


}







// ===============================
// LOGOUT
// ===============================


document.getElementById("logout").onclick=function(e){


e.preventDefault();


localStorage.clear();


location.href="login.html";


};