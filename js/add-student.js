const API = "http://localhost:5000/students";


document.addEventListener("DOMContentLoaded", function(){


const form = document.getElementById("majorAddStudentForm");


if(!form){

    console.log("Form not found");
    return;

}



form.addEventListener("submit", async function(e){


e.preventDefault();



let yearElement = document.querySelector(
'input[name="year"]:checked'
);



if(!yearElement){

alert("Select year");

return;

}



let student = {


name: document.getElementById("studentName").value,

roll: document.getElementById("rollNumber").value,

department: document.getElementById("department").value,

year: yearElement.value,

email: document.getElementById("emailAddress").value,

phone: document.getElementById("phone").value


};



console.log(student);



try{


let res = await fetch(API,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(student)

});



let data = await res.json();



console.log(data);



if(data.success){


alert("Student Added Successfully");


window.location.href="student-list.html";


}

else{


alert(data.message);


}


}

catch(err){


console.log(err);

alert("Backend not connected");


}



});



});