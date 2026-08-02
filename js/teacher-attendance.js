// =====================================
// GET TEACHER DATA
// =====================================


const teacher =
JSON.parse(
localStorage.getItem("teacher")
);



let teacherId = "";

let teacherDepartment = "";

let teacherSubject = "";



const teacherIdInput =
document.getElementById("teacherId");



if(teacher){


teacherId =
teacher.teacherId;


teacherDepartment =
teacher.department;


teacherSubject =
teacher.subject;



if(teacherIdInput){

teacherIdInput.value =
teacherId;

}



}