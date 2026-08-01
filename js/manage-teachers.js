if(localStorage.getItem("loggedIn")!=="true")
{

location.href="index.html";

}



const API = "https://student-management-system-693o.onrender.com/";



const form =
document.getElementById("teacherForm");


const table =
document.getElementById("teacherTable");





document.addEventListener(
"DOMContentLoaded",
loadTeachers
);






form.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const teacher={


name:
document.getElementById("teacherName").value,


email:
document.getElementById("teacherEmail").value,


department:
document.getElementById("teacherDepartment").value,


subject:
document.getElementById("teacherSubject").value,


phone:
document.getElementById("teacherPhone").value


};




await fetch(API,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:
JSON.stringify(teacher)


});



alert(
"Teacher Added Successfully"
);



form.reset();


loadTeachers();


});








async function loadTeachers(){



try{


let response =
await fetch(API);


let data =
await response.json();



table.innerHTML="";



if(data.success){


data.teachers.forEach(t=>{


table.innerHTML += `


<tr>


<td>${t.id}</td>

<td>${t.name}</td>

<td>${t.email}</td>

<td>${t.department}</td>

<td>${t.subject}</td>

<td>${t.phone}</td>


<td>

<button class="delete"
onclick="deleteTeacher(${t.id})">

Delete

</button>

</td>


</tr>


`;



});



}



}

catch(error){

console.log(error);

}


}








async function deleteTeacher(id){


if(
confirm("Delete Teacher?")
)
{


await fetch(
`${API}/${id}`,
{

method:"DELETE"

});


loadTeachers();


}


}





document
.getElementById("searchTeacher")
.addEventListener(
"keyup",
function(){


let value=this.value.toLowerCase();


document
.querySelectorAll("#teacherTable tr")
.forEach(row=>{


row.style.display =
row.innerText
.toLowerCase()
.includes(value)
?
""
:
"none";



});


});