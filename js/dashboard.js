// =====================================================
// STUDENT MANAGEMENT SYSTEM
// ADMIN DASHBOARD
// Developer : Hansika Sivani
// =====================================================


const API = "https://student-management-system-693o.onrender.com/";


// ======================================
// Chart Instances
// ======================================

let studentChartInstance = null;
let attendanceChartInstance = null;



// =====================================================
// DATE & TIME
// =====================================================

function updateDateTime() {


    const now = new Date();


    const dateOptions = {

        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric"

    };


    const date =
    document.getElementById("currentDate");


    const time =
    document.getElementById("currentTime");



    if(date){

        date.textContent =
        now.toLocaleDateString(
            "en-IN",
            dateOptions
        );

    }



    if(time){

        time.textContent =
        now.toLocaleTimeString();

    }


}



setInterval(updateDateTime,1000);

updateDateTime();





// =====================================================
// LOAD DASHBOARD CARDS
// =====================================================


async function loadDashboard(){


try{


const response =
await fetch(`${API}/dashboard`);



const data =
await response.json();



console.log(
"Dashboard :",
data
);




if(!data.success){

return;

}





const update = (id,value)=>{


const element =
document.getElementById(id);


if(element){

element.innerHTML=value;

}


};





update(
"totalStudents",
data.totalStudents
);



update(
"presentStudents",
data.presentStudents
);



update(
"averageMarks",
data.averageMarks+"%"
);



update(
"passPercentage",
data.passPercentage+"%"
);



update(
"resultsCount",
data.resultsCount
);



update(
"totalDepartments",
data.totalDepartments
);



update(
"latestStudent",
data.latestStudent
);



}



catch(err){

console.log(err);

}



}



loadDashboard();







// =====================================================
// LOAD RECENT STUDENTS
// =====================================================


async function loadStudents(){


try{


const response =
await fetch(`${API}/students`);



const data =
await response.json();



console.log(
"Students:",
data
);



const tbody =
document.getElementById(
"recentStudentTable"
);



if(!tbody){

return;

}



tbody.innerHTML="";





if(!data.students ||
data.students.length===0){


tbody.innerHTML=`

<tr>

<td colspan="5">

No Students Found

</td>

</tr>

`;

return;


}







data.students
.slice(0,5)
.forEach(student=>{


tbody.innerHTML += `


<tr>


<td>${student.name}</td>


<td>${student.roll}</td>


<td>${student.department}</td>


<td>${student.year}</td>


<td>

<span class="success">

Active

</span>

</td>


</tr>


`;


});



}



catch(err){


console.log(err);


}



}



loadStudents();








// =====================================================
// LOAD ATTENDANCE
// =====================================================


async function loadAttendance(){


try{


const response =
await fetch(`${API}/attendance`);



const data =
await response.json();



console.log(
"Attendance Data:",
data
);





let present = 0;

let absent = 0;





if(data.attendance){


data.attendance.forEach(item=>{


if(item.status==="Present"){


present++;


}

else{


absent++;


}


});


}





let total =
present + absent;



let percentage = 0;



if(total>0){


percentage =
Math.round(
(present / total) * 100
);


}





// Attendance Percentage Card


const attendanceCard =
document.getElementById(
"attendancePercentage"
);



if(attendanceCard){


attendanceCard.innerHTML =
percentage+"%";


}






// Present Today Card


const presentCard =
document.getElementById(
"presentStudents"
);



if(presentCard){


presentCard.innerHTML =
present;


}





createAttendanceChart(
present,
absent
);



}



catch(err){


console.log(
"Attendance Error:",
err
);


}



}



loadAttendance();








// =====================================================
// LOAD RESULTS
// =====================================================


async function loadResults(){


try{


const response =
await fetch(`${API}/results`);



const data =
await response.json();



console.log(
"Results:",
data
);




let pass = 0;

let fail = 0;





if(data.results){


data.results.forEach(result=>{


if(result.status==="Pass"){


pass++;


}

else{


fail++;


}



});


}





createStudentChart(
pass,
fail
);



}



catch(err){


console.log(err);


}



}



loadResults();







// =====================================================
// STUDENT RESULT CHART
// =====================================================


function createStudentChart(pass,fail){



const canvas =
document.getElementById(
"studentChart"
);



if(!canvas){

return;

}



if(studentChartInstance){

studentChartInstance.destroy();

}




studentChartInstance =
new Chart(
canvas,
{


type:"bar",


data:{


labels:[
"Pass",
"Fail"
],


datasets:[{


label:"Students",


data:[
pass,
fail
],


backgroundColor:[
"#16a34a",
"#dc2626"
],


borderRadius:10


}]


},


options:{


responsive:true,


plugins:{


legend:{


display:false


}


}


}


}

);



}








// =====================================================
// ATTENDANCE CHART
// =====================================================


function createAttendanceChart(present,absent){



const canvas =
document.getElementById(
"attendanceChart"
);



if(!canvas){

return;

}



if(attendanceChartInstance){


attendanceChartInstance.destroy();


}





attendanceChartInstance =
new Chart(
canvas,
{


type:"doughnut",


data:{


labels:[

"Present",

"Absent"

],


datasets:[{


data:[

present,

absent

],


backgroundColor:[

"#16a34a",

"#dc2626"

]


}]


},


options:{


responsive:true,


plugins:{


legend:{


position:"bottom"


}


}


}


}

);



}









// =====================================================
// CARD ANIMATION
// =====================================================


function animateCards(){


const cards =
document.querySelectorAll(".card");



cards.forEach((card,index)=>{


card.style.opacity="0";


card.style.transform=
"translateY(40px)";



setTimeout(()=>{


card.style.transition=".5s";


card.style.opacity="1";


card.style.transform=
"translateY(0px)";



},index*120);



});


}



animateCards();








// =====================================================
// WELCOME MESSAGE
// =====================================================


const welcome =
document.getElementById(
"welcomeMessage"
);



if(welcome){


const hour =
new Date().getHours();



if(hour<12){


welcome.innerHTML =
"Good Morning, Administrator ☀️";


}

else if(hour<17){


welcome.innerHTML =
"Good Afternoon, Administrator 🌤️";


}

else{


welcome.innerHTML =
"Good Evening, Administrator 🌙";


}


}








// =====================================================
// AUTO REFRESH
// =====================================================


setInterval(()=>{


loadDashboard();

loadStudents();

loadAttendance();

loadResults();


},30000);








// =====================================================
// LOGOUT
// =====================================================


const logout =
document.getElementById(
"logout"
);



if(logout){


logout.addEventListener(
"click",
function(e){


e.preventDefault();



if(confirm(
"Are you sure you want to logout?"
)){


localStorage.clear();

sessionStorage.clear();


window.location.href =
"login.html";


}



});


}







console.log(
"======================================"
);

console.log(
"Student Management Dashboard Loaded"
);

console.log(
"======================================"
);