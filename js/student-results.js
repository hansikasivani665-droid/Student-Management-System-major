// ===============================
// Check Login
// ===============================

if(localStorage.getItem("loggedIn") !== "true"){

    location.href="login.html";

}



const STUDENT_API =
"http://localhost:5000/students";


const RESULT_API =
"http://localhost:5000/results";



// ===============================
// Load Results
// ===============================

document.addEventListener(
"DOMContentLoaded",
()=>{

    loadResults();

});





async function loadResults(){


try{


const email =
localStorage.getItem("currentUser");



// Get student details

let studentResponse =
await fetch(
`${STUDENT_API}/email/${email}`
);



let studentData =
await studentResponse.json();



if(!studentData.success){

    alert("Student details not found");
    return;

}



const roll =
studentData.student.roll;




// Get results

let response =
await fetch(
`${RESULT_API}/student/${roll}`
);



let data =
await response.json();



const table =
document.getElementById("resultTable");



table.innerHTML="";



if(data.success && data.results.length>0){



data.results.forEach(result=>{


table.innerHTML += `

<tr>

<td>${result.subject}</td>

<td>${result.marks}</td>

<td>${result.grade}</td>

<td>${result.status}</td>

</tr>

`;



});


}

else{


table.innerHTML=`

<tr>

<td colspan="4">

No Results Found

</td>

</tr>

`;

}



}


catch(error){

console.log(error);

}


}