// =====================================
// Teacher Attendance Module
// =====================================

console.log("Teacher Attendance Module Loaded");


// =====================================
// API
// =====================================

const API =
"https://student-management-system-major-1.onrender.com";


// =====================================
// DOM ELEMENTS
// =====================================

const studentTable =
document.getElementById("studentTable");

const saveButton =
document.getElementById("saveAttendance");

const message =
document.getElementById("message");

const attendanceDate =
document.getElementById("attendanceDate");

const department =
document.getElementById("department");

const year =
document.getElementById("year");

const subject =
document.getElementById("subject");

const teacherIdInput =
document.getElementById("teacherId");

const loadButton =
document.getElementById("loadStudents");



// =====================================
// DATE
// =====================================

const today =
new Date()
.toISOString()
.split("T")[0];


if(attendanceDate){

    attendanceDate.value = today;
    attendanceDate.readOnly = true;

}



// =====================================
// LOAD STUDENTS
// =====================================


async function loadStudents(){


const dept =
department.value;


const yr =
year.value;


if(
!dept ||
!yr ||
!teacherIdInput.value ||
!subject.value
){

alert(
"Enter Teacher ID, Subject, Department and Year"
);

return;

}



try{


const response =
await fetch(

`${API}/students?department=${dept}&year=${yr}`

);



const data =
await response.json();



if(data.success){


displayStudents(
data.students
);


}

else{


studentTable.innerHTML = `

<tr>

<td colspan="6">

No Students Found

</td>

</tr>

`;

}



}

catch(error){


console.log(error);


message.innerHTML =
"❌ Unable to load students";


}



}



// =====================================
// DISPLAY STUDENTS
// =====================================


function displayStudents(students){


studentTable.innerHTML="";



students.forEach(student=>{


studentTable.innerHTML += `

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
${subject.value}
</td>


<td>

<select class="status"
data-roll="${student.roll}">

<option value="Present">
Present
</option>


<option value="Absent">
Absent
</option>


</select>


</td>


</tr>

`;



});


}



// =====================================
// LOAD BUTTON
// =====================================


loadButton.addEventListener(
"click",
loadStudents
);




// =====================================
// SAVE ATTENDANCE
// =====================================


saveButton.addEventListener(

"click",

async()=>{


const statusList =
document.querySelectorAll(".status");



if(statusList.length===0){


alert(
"Load students first"
);


return;


}



let successCount=0;



for(
const item of statusList
){



const attendanceData = {


roll:
item.dataset.roll,


subject:
subject.value,


teacherId:
teacherIdInput.value,


date:
attendanceDate.value,


status:
item.value


};




try{


const response =
await fetch(

`${API}/attendance`,

{

method:"POST",

headers:{


"Content-Type":
"application/json"


},

body:
JSON.stringify(
attendanceData
)

}

);



const result =
await response.json();



console.log(result);



if(result.success){

successCount++;

}



}

catch(error){


console.log(error);


}



}




if(
successCount === statusList.length
){


message.style.color="green";


message.innerHTML =

`✅ Attendance Saved For ${successCount} Students`;


}

else{


message.style.color="red";


message.innerHTML =

"❌ Some attendance records failed";


}



}

);