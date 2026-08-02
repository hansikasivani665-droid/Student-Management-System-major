// =====================================
// Teacher Result Module
// =====================================


const API =
"https://student-management-system-major-1.onrender.com/results";



// =====================================
// DOM
// =====================================


const form =
document.getElementById("resultForm");


const message =
document.getElementById("message");



// =====================================
// GET LOGGED TEACHER DATA
// =====================================


const teacher =
JSON.parse(
localStorage.getItem("teacher")
);



let teacherId = "";

let teacherSubject = "";



if(teacher){

    teacherId =
    teacher.teacherId;


    teacherSubject =
    teacher.subject;

}



// =====================================
// LOAD SUBJECT AUTOMATICALLY
// =====================================


const subjectInput =
document.getElementById("subject");



if(subjectInput && teacherSubject){

    subjectInput.value =
    teacherSubject;


    subjectInput.readOnly =
    true;

}



// =====================================
// SUBMIT RESULT
// =====================================


form.addEventListener(

"submit",

async(e)=>{


e.preventDefault();



// =====================================
// GET INPUT VALUES
// =====================================


const roll =
document.getElementById("roll")
.value
.trim();



const subject =
subjectInput.value
.trim();



const marks =
Number(
document.getElementById("marks")
.value
);




// =====================================
// VALIDATION
// =====================================


if(!roll || !subject || isNaN(marks)){


    message.style.color="red";


    message.innerHTML =
    "❌ Please fill all fields.";


    return;

}




if(marks < 0 || marks > 100){


    message.style.color="red";


    message.innerHTML =
    "❌ Marks should be between 0 and 100";


    return;

}





// =====================================
// GRADE CALCULATION
// =====================================


let grade="";


if(marks >= 90){

    grade="A+";

}

else if(marks >= 80){

    grade="A";

}

else if(marks >= 70){

    grade="B+";

}

else if(marks >= 60){

    grade="B";

}

else if(marks >= 50){

    grade="C";

}

else{

    grade="F";

}




const status =
marks >= 35
?
"Pass"
:
"Fail";




// =====================================
// SEND RESULT DATA
// =====================================


const result = {


    roll,


    teacherId,


    subject,


    marks,


    grade,


    status


};





try{


const response =
await fetch(

API,

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





if(data.success){


    message.style.color="green";


    message.innerHTML =
    "✅ Result Saved Successfully";



    form.reset();



    // restore teacher subject after reset

    if(subjectInput && teacherSubject){


        subjectInput.value =
        teacherSubject;


        subjectInput.readOnly =
        true;


    }



}

else{


    message.style.color="red";


    message.innerHTML =
    data.message ||
    "❌ Failed to save result";


}



}



catch(error){


console.error(error);



message.style.color="red";


message.innerHTML =
"❌ Server Connection Failed";


}



}

);