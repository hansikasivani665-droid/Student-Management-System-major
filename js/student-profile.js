// ===============================
// Check Login
// ===============================

if (localStorage.getItem("loggedIn") !== "true") {

    location.href = "login.html";

}


const STUDENT_API =
 "https://onrender.com";



// ===============================
// Load Profile
// ===============================

document.addEventListener(
"DOMContentLoaded",
()=>{

    loadProfile();

});





async function loadProfile(){


try{


const email =
localStorage.getItem("currentUser");



const response =
await fetch(
`${STUDENT_API}/email/${email}`
);



const data =
await response.json();



if(data.success){


const student =
data.student;



document.getElementById("studentName")
.innerHTML =
student.name;



document.getElementById("roll")
.innerHTML =
student.roll;



document.getElementById("department")
.innerHTML =
student.department;



document.getElementById("year")
.innerHTML =
student.year;



document.getElementById("email")
.innerHTML =
student.email;



document.getElementById("phone")
.innerHTML =
student.phone;



}

else{


alert("Student details not found");


}



}


catch(error){

console.log(error);

}


}