const express = require("express");
const router = express.Router();

const db = require("../models/database");


// ==========================================
// GET ATTENDANCE
// ==========================================

router.get("/", (req, res) => {

    const {
        department,
        year,
        subject,
        teacherId,
        date
    } = req.query;


    let query = `

    SELECT

    students.roll,
    students.name,
    students.department,
    students.year,

    attendance.subject,
    attendance.teacherId,
    attendance.date,
    attendance.status


    FROM students


    LEFT JOIN attendance

    ON students.roll = attendance.roll


    WHERE 1=1

    `;


    let params = [];


    if(department){

        query += " AND students.department=? ";
        params.push(department);

    }


    if(year){

        query += " AND students.year=? ";
        params.push(year);

    }


    if(subject){

        query += " AND attendance.subject=? ";
        params.push(subject);

    }


    if(teacherId){

        query += " AND attendance.teacherId=? ";
        params.push(teacherId);

    }


    if(date){

        query += " AND attendance.date=? ";
        params.push(date);

    }



    db.all(
        query,
        params,
        (err,rows)=>{


            if(err){

                return res.status(500).json({

                    success:false,

                    message:err.message

                });

            }



            res.json({

                success:true,

                attendance:rows

            });



        }

    );


});





// ==========================================
// SAVE / UPDATE ATTENDANCE
// ==========================================


router.post("/",(req,res)=>{


const {

roll,

subject,

teacherId,

date,

status


}=req.body;



if(
!roll ||
!subject ||
!teacherId ||
!date ||
!status

){

return res.status(400).json({

success:false,

message:"Missing Attendance Details"

});


}




db.get(

`

SELECT *

FROM attendance

WHERE roll=?

AND subject=?

AND teacherId=?

AND date=?

`,

[
roll,
subject,
teacherId,
date
],


(err,row)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});


}




// UPDATE EXISTING


if(row){


db.run(

`

UPDATE attendance

SET status=?

WHERE roll=?

AND subject=?

AND teacherId=?

AND date=?

`,

[

status,

roll,

subject,

teacherId,

date

],


(err)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});


}



res.json({

success:true,

message:"Attendance Updated"

});


}



);



}





// INSERT NEW


else{


db.run(

`

INSERT INTO attendance

(

roll,

subject,

teacherId,

date,

status

)

VALUES(?,?,?,?,?)

`,

[

roll,

subject,

teacherId,

date,

status

],


(err)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});


}



res.json({

success:true,

message:"Attendance Saved"

});



}


);



}




}



);



});




// ==========================================
// STUDENT ATTENDANCE REPORT
// ==========================================


router.get("/student/:roll",(req,res)=>{


const roll=req.params.roll;



db.all(

`

SELECT *

FROM attendance

WHERE roll=?

ORDER BY date DESC

`,

[roll],


(err,rows)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});

}



const total =
rows.length;



const present =
rows.filter(
a=>a.status==="Present"
).length;



const absent =
rows.filter(
a=>a.status==="Absent"
).length;



const percentage =
total>0
?
Math.round(
(present/total)*100
)
:
0;



res.json({

success:true,

attendance:rows,


summary:{


totalDays:total,

present,

absent,

percentage


}



});



}



);



});





module.exports = router;