// =====================================
// Teacher Results Module
// =====================================

console.log("Teacher Results Module Loaded");


// =====================================
// API
// =====================================

const API =
"https://student-management-system-major-1.onrender.com";


// =====================================
// DOM
// =====================================

const teacherIdInput =
document.getElementById("teacherId");

const subjectInput =
document.getElementById("subject");

const department =
document.getElementById("department");

const year =
document.getElementById("year");

const loadButton =
document.getElementById("loadStudents");

const studentTable =
document.getElementById("studentTable");

const saveButton =
document.getElementById("saveResults");

const message =
document.getElementById("message");




// =====================================
// LOAD STUDENTS
// =====================================

loadButton.addEventListener(
"click",
loadStudents
);



async function loadStudents(){


const dept =
department.value;


const yr =
year.value;



if(
!teacherIdInput.value ||
!subjectInput.value ||
!dept ||
!yr
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

<td colspan="3">

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

<input 

type="number"

class="marks"

data-roll="${student.roll}"

placeholder="Enter Marks"

min="0"

max="100">

</td>


</tr>


`;



});


}






// =====================================
// SAVE RESULTS
// =====================================


saveButton.addEventListener(

"click",

async()=>{


const marksInputs =
document.querySelectorAll(".marks");



if(marksInputs.length===0){

alert(
"Load Students First"
);

return;

}



let count = 0;



for(
const input of marksInputs
){



const marks =
Number(input.value);



if(
isNaN(marks)
){

continue;

}



let grade = "";



if(marks >= 90){

grade = "A+";

}
else if(marks >= 80){

grade = "A";

}
else if(marks >= 70){

grade = "B+";

}
else if(marks >= 60){

grade = "B";

}
else if(marks >= 50){

grade = "C";

}
else{

grade = "F";

}



const status =
marks >= 35
?
"Pass"
:
"Fail";





const result = {


roll:
input.dataset.roll,


subject:
subjectInput.value,


teacherId:
teacherIdInput.value,


marks,

grade,

status


};




try{


const response =
await fetch(

`${API}/results`,

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:
JSON.stringify(result)

}

);



const data =
await response.json();



console.log(data);



if(data.success){

count++;

}



}

catch(error){


console.log(error);


}



}




if(count === marksInputs.length){


message.style.color =
"green";


message.innerHTML =

`✅ Results Saved For ${count} Students`;


}

else{


message.style.color =
"red";


message.innerHTML =

"❌ Some Results Failed";


}



}

);