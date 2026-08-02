const express = require("express");
const router = express.Router();

const db = require("../models/database");



router.get("/",(req,res)=>{


const query = `

SELECT

students.department,

COUNT(DISTINCT students.roll) AS totalStudents,


ROUND(

(
SELECT COUNT(*)

FROM attendance a

JOIN students s2

ON a.roll=s2.roll

WHERE s2.department=students.department

AND a.status='Present'

)

/

NULLIF(

(
SELECT COUNT(*)

FROM attendance a2

JOIN students s3

ON a2.roll=s3.roll

WHERE s3.department=students.department

),0)

*100

) AS attendancePercentage,



ROUND(

AVG(results.marks)

) AS averageMarks,



ROUND(

(
SELECT COUNT(*)

FROM results r2

JOIN students s4

ON r2.roll=s4.roll

WHERE s4.department=students.department

AND r2.status='Pass'

)

/

NULLIF(

(
SELECT COUNT(*)

FROM results r3

JOIN students s5

ON r3.roll=s5.roll

WHERE s5.department=students.department

),0)

*100

) AS passPercentage



FROM students


GROUP BY students.department



`;



db.all(query,[],(err,rows)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});

}



res.json({

success:true,

departments:rows

});



});


});



module.exports=router;