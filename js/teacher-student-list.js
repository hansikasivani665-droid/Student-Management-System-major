const API="https://student-management-system-major.onrender.com/students";

const table=document.getElementById("studentTable");

const search=document.getElementById("search");

let students=[];

async function loadStudents(){

    const response=await fetch(`${API}/students`);

    const data=await response.json();

    students=data.students;

    displayStudents(students);

}

function displayStudents(list){

    table.innerHTML="";

    list.forEach(student=>{

        table.innerHTML+=`

        <tr>

        <td>${student.roll}</td>

        <td>${student.name}</td>

        <td>${student.department}</td>

        <td>${student.year}</td>

        <td>${student.email}</td>

        <td>${student.phone}</td>

        </tr>

        `;

    });

}

search.addEventListener("keyup",()=>{

    const value=search.value.toLowerCase();

    const filtered=students.filter(student=>

        student.name.toLowerCase().includes(value) ||

        student.roll.toLowerCase().includes(value)

    );

    displayStudents(filtered);

});

loadStudents();