const express = require("express");
const router = express.Router();

const db = require("../models/database");


// ==========================================
// GET ATTENDANCE (ADMIN + TEACHER)
// ==========================================

router.get("/", (req,res)=>{


const {
    department,
    subject,
    teacherId,
    date
}=req.query;



let selectedDate =
date || new Date().toISOString().split("T")[0];



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

AND attendance.date = ?

`;



let params=[
    selectedDate
];



let conditions=[];



if(department){


conditions.push(
"LOWER(students.department)=LOWER(?)"
);


params.push(department);


}



if(subject){


conditions.push(
"LOWER(attendance.subject)=LOWER(?)"
);


params.push(subject);


}



if(teacherId){


conditions.push(
"attendance.teacherId=?"
);


params.push(teacherId);


}



if(conditions.length){


query +=
" WHERE " +
conditions.join(" AND ");


}



query += `

ORDER BY students.id ASC

`;




db.all(

query,

params,

(err,rows)=>{


if(err){

console.log(
"Attendance GET Error:",
err.message
);


return res.status(500).json({

success:false,

message:err.message

});


}




rows.forEach(row=>{


if(!row.status){

row.status="Not Marked";

}


});



res.json({

success:true,

attendance:rows

});



});


});




// ==========================================
// GET STUDENT ATTENDANCE
// ==========================================


router.get("/student/:roll",(req,res)=>{


const roll=req.params.roll;



db.all(

`

SELECT

date,
subject,
teacherId,
status

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



let totalDays=rows.length;


let present =
rows.filter(
x=>x.status==="Present"
).length;



let absent =
rows.filter(
x=>x.status==="Absent"
).length;



let percentage =
totalDays
?
Math.round(
(present/totalDays)*100
)
:
0;



res.json({

success:true,

attendance:rows,

summary:{

totalDays,
present,
absent,
percentage

}


});


});


});




// ==========================================
// SAVE / UPDATE ATTENDANCE
// TEACHER + ADMIN
// ==========================================


router.post("/",(req,res)=>{


let {

roll,
subject,
teacherId,
date,
status

}=req.body;



if(
!roll ||
!date ||
!status
){


return res.status(400).json({

success:false,

message:"Missing Attendance Details"

});


}




// Default values for ADMIN

subject =
subject || "Admin";


teacherId =
teacherId || "ADMIN";





db.get(

`

SELECT id

FROM attendance

WHERE roll=?

AND subject=?

AND date=?

AND teacherId=?

`,

[

roll,
subject,
date,
teacherId

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

WHERE id=?

`,

[

status,
row.id

],



function(error){



if(error){

return res.status(500).json({

success:false,
message:error.message

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
date,status

],



function(error){



if(error){


return res.status(500).json({

success:false,
message:error.message

});


}




res.json({

success:true,

message:"Attendance Saved",

id:this.lastID


});



}



);



}



}



);



});




// ==========================================
// DELETE ATTENDANCE
// ==========================================


router.delete("/:id",(req,res)=>{


db.run(

`

DELETE FROM attendance

WHERE id=?

`,

[req.params.id],


function(err){


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