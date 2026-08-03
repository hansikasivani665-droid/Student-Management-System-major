// ===============================
// SAVE ATTENDANCE
// ===============================

async function saveAttendance(e){

    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];

    try{

        let success = 0;

        for(const student of attendanceData){

            const response = await fetch(ATTENDANCE_API,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({

                    roll:student.roll,
                    status:student.status,

                    subject:"ADMIN_ATTENDANCE",

                    teacherId:"ADMIN",

                    date:today

                })
            });

            const result = await response.json();

            if(result.success){
                success++;
            }else{
                console.log(result.message);
            }

        }

        alert(`Attendance Saved Successfully (${success}/${attendanceData.length})`);

        await loadAttendance();

    }
    catch(error){

        console.log(error);

        alert("Attendance Save Failed");

    }

}