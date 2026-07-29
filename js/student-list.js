const STUDENT_API = "http://localhost:5000/students";

let allStudents = [];


// ===============================
// LOGIN CHECK
// ===============================

if(localStorage.getItem("loggedIn") !== "true"){

    location.href = "login.html";

}



// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded",()=>{


    loadStudents();



    // Search

    const search =
    document.getElementById("searchStudent");


    if(search){

        search.addEventListener("keyup",()=>{

            filterStudents();

        });

    }



    // Department Filter

    const dept =
    document.getElementById("departmentFilter");


    if(dept){

        dept.addEventListener("change",()=>{

            filterStudents();

        });

    }



    // Year Filter

    const year =
    document.getElementById("yearFilter");


    if(year){

        year.addEventListener("change",()=>{

            filterStudents();

        });

    }


});




// ===============================
// LOAD STUDENTS
// ===============================

async function loadStudents(){


try{


const response =
await fetch(STUDENT_API);



const data =
await response.json();



if(data.success){


    allStudents = data.students;


    displayStudents(allStudents);



}
else{


    showEmpty();


}



}

catch(error){


console.log(error);


showEmpty();


}



}




// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents(students){


const table =
document.getElementById("studentTableBody");



const loading =
document.getElementById("loading");



const empty =
document.getElementById("emptyState");



if(loading){

    loading.style.display="none";

}



if(students.length===0){


    table.innerHTML="";


    if(empty){

        empty.style.display="block";

    }


    return;

}



if(empty){

    empty.style.display="none";

}



let rows="";



students.forEach((student,index)=>{


rows += `

<tr>

<td>${index+1}</td>


<td>

<i class="fa-solid fa-user"></i>

</td>


<td>${student.roll}</td>


<td>${student.name}</td>


<td>${student.department}</td>


<td>${student.year}</td>


<td>${student.phone}</td>


<td>${student.email}</td>


<td>

<span class="active">

Active

</span>

</td>


<td>

<button onclick="editStudent(${student.id})">

<i class="fa-solid fa-pen"></i>

</button>

</td>


<td>

<button onclick="deleteStudent(${student.id})">

<i class="fa-solid fa-trash"></i>

</button>

</td>


</tr>

`;



});



table.innerHTML = rows;



document.getElementById("studentCount").innerHTML =
students.length;



}





// ===============================
// SEARCH + FILTER
// ===============================

function filterStudents(){


let search =
document.getElementById("searchStudent").value
.toLowerCase();



let department =
document.getElementById("departmentFilter").value;



let year =
document.getElementById("yearFilter").value;




let filtered =
allStudents.filter(student=>{


let matchSearch =
student.name.toLowerCase().includes(search)
||
student.roll.includes(search);



let matchDept =
department==="All"
||
student.department===department;



let matchYear =
year==="All"
||
student.year===year;



return matchSearch && matchDept && matchYear;



});



displayStudents(filtered);



}





// ===============================
// DELETE STUDENT
// ===============================

async function deleteStudent(id){


let confirmDelete =
confirm("Delete this student?");



if(!confirmDelete){

return;

}



await fetch(
`${STUDENT_API}/${id}`,
{
method:"DELETE"
}
);



loadStudents();


}





// ===============================
// EDIT STUDENT
// ===============================

function editStudent(id){


alert(
"Edit student feature coming soon. ID : "+id
);


}




// ===============================
// EMPTY STATE
// ===============================

function showEmpty(){


let loading =
document.getElementById("loading");


if(loading){

loading.style.display="none";

}



let empty =
document.getElementById("emptyState");


if(empty){

empty.style.display="block";

}



}