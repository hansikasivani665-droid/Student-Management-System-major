const express = require("express");
const router = express.Router();

const db = require("../models/database");


// ==========================================
// GET ATTENDANCE
// ==========================================

router.get("/", (req,res)=>{


const {
department,
year,
subject,
teacherId,
date

}=req.query;



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



let params=[];



if(department){

query += " AND LOWER(students.department)=LOWER(?) ";

params.push(department);

}



if(year){

query += " AND LOWER(students.year)=LOWER(?) ";

params.push(year);

}



if(subject){

query += " AND LOWER(attendance.subject)=LOWER(?) ";

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



query += " ORDER BY students.id DESC";




db.all(

query,

params,

(err,rows)=>{


if(err){

console.log("ATTENDANCE ERROR:",err.message);


return res.status(500).json({

success:false,

message:err.message

});

}




rows.forEach(student=>{


if(!student.status){

student.status="Not Marked";

}


});




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


function(err){


if(err){

console.log("SAVE ATTENDANCE ERROR:",err.message);


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


});



module.exports = router;