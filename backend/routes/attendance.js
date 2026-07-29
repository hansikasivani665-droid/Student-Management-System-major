const express = require("express");
const router = express.Router();

const db = require("../models/database");


// ==========================================
// GET ALL ATTENDANCE (TODAY ONLY)
// ==========================================

router.get("/", (req,res)=>{


    const today = new Date().toISOString().split("T")[0];


    let query = `

    SELECT

    students.id,
    students.roll,
    students.name,
    students.department,
    students.year,

    attendance.date,
    attendance.status

    FROM students

    LEFT JOIN attendance

    ON students.roll = attendance.roll
    AND attendance.date = ?


    ORDER BY students.id DESC

    `;



    db.all(query,[today],(err,rows)=>{


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


    });


});





// ==========================================
// SAVE ATTENDANCE
// ==========================================

router.post("/",(req,res)=>{


const {

roll,
status

}=req.body;



const date =
new Date().toISOString().split("T")[0];





db.get(

`

SELECT *

FROM attendance

WHERE roll=? AND date=?

`,

[roll,date],

(err,row)=>{


if(err){

return res.status(500).json({

success:false,
message:err.message

});

}





// UPDATE

if(row){


db.run(

`

UPDATE attendance

SET status=?

WHERE roll=? AND date=?

`,

[

status,
roll,
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


});


}




// INSERT

else{


db.run(

`

INSERT INTO attendance

(
roll,
date,
status
)

VALUES(?,?,?)

`,

[

roll,
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


});


}



});


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



let total = rows.length;


let present =
rows.filter(
a=>a.status==="Present"
).length;



let percentage =
total===0
?
0
:
((present/total)*100).toFixed(2);



res.json({

success:true,

attendance:rows,

summary:{


totalDays:total,

present,

absent:total-present,

percentage


}


});



});


});






// ==========================================
// DELETE
// ==========================================

router.delete("/:id",(req,res)=>{


db.run(

`

DELETE FROM attendance

WHERE id=?

`,

[req.params.id],


(err)=>{


if(err){

return res.status(500).json({

success:false,
message:err.message

});

}



res.json({

success:true,
message:"Attendance Deleted"

});


});


});





module.exports = router;