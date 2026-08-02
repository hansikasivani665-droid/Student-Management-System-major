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

const loadButton =
document.getElementById("loadStudents");


// =====================================
// GET TEACHER DATA
// =====================================

const teacher =
JSON.parse(localStorage.getItem("teacher"));


let teacherId = "";
let teacherDepartment = "";
let teacherSubject = "";


if(teacher){

    teacherId =
    teacher.teacherId || "T001";

    teacherDepartment =
    teacher.department;

    teacherSubject =
    teacher.subject;

}



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
// LOAD SUBJECT
// =====================================

function loadTeacherSubject(){

    if(!teacher){
        return;
    }


    subject.innerHTML = `

    <option value="${teacherSubject}">
        ${teacherSubject}
    </option>

    `;

}


loadTeacherSubject();



// =====================================
// LOAD TEACHER DEPARTMENT
// =====================================

function loadTeacherDepartment(){

    if(!teacher){
        return;
    }


    department.value =
    teacherDepartment;


    department.disabled = true;

}


loadTeacherDepartment();




// =====================================
// LOAD STUDENTS
// =====================================

async function loadStudents(){


const dept =
teacherDepartment;


const yr =
year.value;



if(!dept || !yr || !subject.value){

    alert(
    "Select Year and Subject"
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



console.log("Students:",data);



if(data.success){

    displayStudents(
    data.students
    );

}

else{


studentTable.innerHTML = `

<tr>

<td colspan="5">

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


studentTable.innerHTML = "";



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

<select 
class="status"
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

if(loadButton){

loadButton.addEventListener(
"click",
loadStudents
);

}




// =====================================
// SAVE ATTENDANCE
// =====================================

if(saveButton){


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



let count = 0;



for(
const item of statusList
){



const attendanceData = {


roll:
item.dataset.roll,


subject:
subject.value,


teacherId:
teacherId || "T001",


date:
attendanceDate.value,


status:
item.value


};



console.log(
"Sending Attendance:",
attendanceData
);



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
JSON.stringify(attendanceData)

}

);



const result =
await response.json();



console.log(
"Server Response:",
result
);



if(result.success){

count++;

}



}

catch(error){

console.log(
"Attendance Error:",
error
);

}



}




if(count === statusList.length){


message.style.color =
"green";


message.innerHTML =

`✅ Attendance Saved For ${count} Students`;



}

else{


message.style.color =
"red";


message.innerHTML =

"❌ Some attendance records failed";


}



}

);


}