// =====================================
// Student List Module
// =====================================


const STUDENT_API =  "https://onrender.com";

let allStudents = [];




// =====================================
// LOGIN CHECK
// =====================================

if(localStorage.getItem("loggedIn") !== "true"){

    window.location.href = "login.html";

}






// =====================================
// PAGE LOAD
// =====================================

document.addEventListener("DOMContentLoaded",()=>{


    console.log("Student List Loaded");


    loadStudents();



    const search =
    document.getElementById("searchStudent");


    if(search){

        search.addEventListener(
            "input",
            filterStudents
        );

    }




    const department =
    document.getElementById("departmentFilter");


    if(department){

        department.addEventListener(
            "change",
            filterStudents
        );

    }





    const year =
    document.getElementById("yearFilter");


    if(year){

        year.addEventListener(
            "change",
            filterStudents
        );

    }


});









// =====================================
// LOAD STUDENTS
// =====================================


async function loadStudents(){


    try{


        const response =
        await fetch(STUDENT_API);



        const data =
        await response.json();



        console.log(
            "Student API:",
            data
        );





        if(data.success){


            allStudents = data.students;


            displayStudents(allStudents);


        }
        else{


            displayStudents([]);


        }



    }


    catch(error){


        console.error(
            "Fetch Error:",
            error
        );


        displayStudents([]);


    }



}









// =====================================
// DISPLAY STUDENTS
// =====================================


function displayStudents(students){



    const table =
    document.getElementById("studentTableBody");



    if(!table){

        console.error(
            "studentTableBody not found"
        );

        return;

    }






    let rows = "";






    if(students.length === 0){


        table.innerHTML = `

        <tr>

            <td colspan="10" class="loading">

                No Students Found

            </td>

        </tr>

        `;


        return;


    }







    students.forEach((student,index)=>{



        rows += `

        <tr>


            <td>
                ${index+1}
            </td>




            <td>

                <div class="student-avatar">

                    <i class="fa-solid fa-user"></i>

                </div>

            </td>





            <td>
                ${student.name || "-"}
            </td>





            <td>
                ${student.roll || "-"}
            </td>





            <td>
                ${student.department || "-"}
            </td>





            <td>
                ${student.year || "-"}
            </td>





            <td>
                ${student.email || "-"}
            </td>





            <td>
                ${student.phone || "-"}
            </td>





            <td>

                <span class="status-active">

                    Active

                </span>


            </td>





            <td>


                <button
                class="edit-btn"
                onclick="editStudent(${student.id})">


                    <i class="fa-solid fa-pen"></i>


                </button>





                <button
                class="delete-btn"
                onclick="deleteStudent(${student.id})">


                    <i class="fa-solid fa-trash"></i>


                </button>



            </td>




        </tr>


        `;



    });







    table.innerHTML = rows;



}









// =====================================
// SEARCH + FILTER
// =====================================


function filterStudents(){



    let search =

    document
    .getElementById("searchStudent")
    .value
    .toLowerCase();




    let department =

    document
    .getElementById("departmentFilter")
    .value;





    let year =

    document
    .getElementById("yearFilter")
    .value;








    let filtered =

    allStudents.filter(student=>{





        let name =

        (student.name || "")
        .toLowerCase();





        let roll =

        (student.roll || "")
        .toLowerCase();







        let searchMatch =

        name.includes(search)

        ||

        roll.includes(search);








        let departmentMatch =


        department === ""

        ||

        student.department === department;








        let yearMatch =


        year === ""

        ||

        student.year === year;








        return (

            searchMatch

            &&

            departmentMatch

            &&

            yearMatch

        );



    });






    displayStudents(filtered);



}









// =====================================
// DELETE STUDENT
// =====================================


async function deleteStudent(id){



    const confirmDelete =

    confirm(
        "Are you sure you want to delete this student?"
    );



    if(!confirmDelete){

        return;

    }





    try{


        await fetch(

            `${STUDENT_API}/${id}`,

            {

                method:"DELETE"

            }

        );




        loadStudents();



    }


    catch(error){


        console.error(
            "Delete Error:",
            error
        );


    }



}









// =====================================
// EDIT STUDENT
// =====================================


function editStudent(id){

    window.location.href = `edit-student.html?id=${id}`;

}