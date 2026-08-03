const API = window.API_BASE || window.location.origin;

const STUDENT_API = `${API}/students`;

const id =
new URLSearchParams(window.location.search).get("id");

const form =
document.getElementById("editForm");

const message =
document.getElementById("message");

async function loadStudent(){

    const response =
    await fetch(`${STUDENT_API}/${id}`);

    const data =
    await response.json();

    if(!data.success || !data.student){
        message.style.color = "red";
        message.innerHTML = "Student not found";
        return;
    }

    const student =
    data.student;

    document.getElementById("name").value = student.name;

    document.getElementById("roll").value = student.roll;

    document.getElementById("department").value = student.department;

    document.getElementById("year").value = student.year;

    document.getElementById("email").value = student.email;

    document.getElementById("phone").value = student.phone;

}

loadStudent();

form.addEventListener("submit", async(e)=>{

    e.preventDefault();

    const student={

        name:document.getElementById("name").value,

        roll:document.getElementById("roll").value,

        department:document.getElementById("department").value,

        year:document.getElementById("year").value,

        email:document.getElementById("email").value,

        phone:document.getElementById("phone").value

    };

    const response=await fetch(`${STUDENT_API}/${id}`,{

        method:"PUT",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(student)

    });

    const data=await response.json();

    if(data.success){

        message.style.color="green";

        message.innerHTML="Student Updated Successfully";

        setTimeout(()=>{

            window.location.href="/html/student-list.html";

        },1000);

    }

});
