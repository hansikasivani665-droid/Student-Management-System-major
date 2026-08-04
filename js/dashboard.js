// =====================================================
// ADMIN DASHBOARD FRONTEND JAVASCRIPT
// =====================================================


const API = window.location.origin;


// =====================================================
// LOAD DASHBOARD DATA
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

    loadDepartmentDetails();

    loadRecentStudents();

    loadDateTime();

});



// =====================================================
// LOAD MAIN DASHBOARD
// =====================================================


async function loadDashboard(){


    try{


        const response = await fetch(
            `${API}/dashboard`
        );


        const data = await response.json();


        console.log("Dashboard Data:", data);



        if(!data.success){

            console.log("Dashboard API Failed");

            return;

        }



        // ===============================
        // TOP CARDS
        // ===============================


        document.getElementById("totalStudents").innerText =
            data.totalStudents || 0;



        document.getElementById("attendancePercentage").innerText =
            (data.attendancePercentage || 0) + "%";



        document.getElementById("averageMarks").innerText =
            data.averageMarks || 0;



        document.getElementById("passPercentage").innerText =
            (data.passPercentage || 0) + "%";



        document.getElementById("totalDepartments").innerText =
            data.totalDepartments || 0;



        document.getElementById("resultsCount").innerText =
            data.resultsCount || 0;



        document.getElementById("presentStudents").innerText =
            data.presentStudents || 0;



        // ===============================
        // DEPARTMENT PERFORMANCE
        // ===============================


        if(data.departments){

            data.departments.forEach(dep=>{


                let department =
                    dep.department.toLowerCase();



                if(department==="cse"){

                    setDepartment(
                        "cse",
                        dep
                    );

                }


                if(department==="ece"){

                    setDepartment(
                        "ece",
                        dep
                    );

                }


                if(department==="eee"){

                    setDepartment(
                        "eee",
                        dep
                    );

                }


                if(
                    department==="mechanical"
                    ||
                    department==="mech"
                ){

                    setDepartment(
                        "mech",
                        dep
                    );

                }


            });


        }



        createCharts(data);



    }
    catch(error){


        console.log(
            "Dashboard Loading Error:",
            error
        );


    }


}





// =====================================================
// SET DEPARTMENT CARDS
// =====================================================


function setDepartment(id,dep){


    const students =
    document.getElementById(id+"Students");


    const present =
    document.getElementById(id+"Present");


    const absent =
    document.getElementById(id+"Absent");


    const attendance =
    document.getElementById(id+"Attendance");


    const average =
    document.getElementById(id+"Average");



    if(students)
        students.innerText =
        dep.totalStudents || 0;



    if(present)
        present.innerText =
        dep.presentStudents || 0;



    if(absent)
        absent.innerText =
        dep.absentStudents || 0;



    if(attendance)
        attendance.innerText =
        (dep.attendancePercentage || 0)+"%";



    if(average)
        average.innerText =
        dep.averageMarks || 0;



}





// =====================================================
// LOAD DEPARTMENT OVERVIEW
// =====================================================


async function loadDepartmentDetails(){


    try{


        const response =
        await fetch(
            `${API}/dashboard/department`
        );


        const data =
        await response.json();



        console.log(
            "Department Data:",
            data
        );



        const container =
        document.getElementById(
            "departmentCards"
        );



        if(!container)
            return;



        container.innerHTML="";



        data.departments.forEach(dep=>{


            container.innerHTML += `

            <div class="card">


                <h3>
                    ${dep.department}
                </h3>


                <p>
                    Students:
                    ${dep.totalStudents}
                </p>


                <p>
                    Present:
                    ${dep.presentStudents}
                </p>


                <p>
                    Absent:
                    ${dep.absentStudents}
                </p>


                <p>
                    Average Marks:
                    ${dep.averageMarks}
                </p>


            </div>

            `;



        });



    }
    catch(error){

        console.log(
            "Department Error:",
            error
        );

    }


}





// =====================================================
// LOAD RECENT STUDENTS
// =====================================================


async function loadRecentStudents(){


    try{


        const response =
        await fetch(
            `${API}/students`
        );


        const data =
        await response.json();



        const students =
        data.students || [];



        const table =
        document.getElementById(
            "recentStudentTable"
        );



        if(!table)
            return;



        table.innerHTML="";



        students
        .slice(0,5)
        .forEach(student=>{


            table.innerHTML += `

            <tr>

                <td>
                    ${student.name}
                </td>


                <td>
                    ${student.roll}
                </td>


                <td>
                    ${student.department}
                </td>


                <td>
                    ${student.year}
                </td>


                <td>
                    Active
                </td>


            </tr>

            `;


        });



    }
    catch(error){

        console.log(
            "Student Loading Error:",
            error
        );

    }


}





// =====================================================
// DATE AND TIME
// =====================================================


function loadDateTime(){


    setInterval(()=>{


        const now =
        new Date();



        const date =
        document.getElementById(
            "currentDate"
        );


        const time =
        document.getElementById(
            "currentTime"
        );



        if(date)

            date.innerText =
            now.toLocaleDateString();



        if(time)

            time.innerText =
            now.toLocaleTimeString();



    },1000);



}





// =====================================================
// CHARTS
// =====================================================


function createCharts(data){


    if(typeof Chart==="undefined")
        return;



    const resultCanvas =
    document.getElementById(
        "studentChart"
    );


    const attendanceCanvas =
    document.getElementById(
        "attendanceChart"
    );



    if(resultCanvas){


        new Chart(
            resultCanvas,
            {

                type:"bar",

                data:{

                    labels:[
                        "Average Marks",
                        "Pass Percentage"
                    ],

                    datasets:[{

                        label:"Statistics",

                        data:[

                            data.averageMarks || 0,

                            data.passPercentage || 0

                        ]

                    }]

                }

            }

        );


    }





    if(attendanceCanvas){


        new Chart(
            attendanceCanvas,
            {

                type:"pie",

                data:{

                    labels:[
                        "Present",
                        "Absent"
                    ],

                    datasets:[{

                        data:[

                            data.presentStudents || 0,

                            data.absentStudents || 0

                        ]

                    }]

                }


            }

        );


    }


}