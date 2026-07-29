const express = require("express");
const router = express.Router();

const db = require("../models/database");



// ===============================
// GET RESULTS
// ===============================

router.get("/", (req,res)=>{


db.all(`

SELECT

results.id,
results.roll,

students.name,
students.department,
students.year,

results.subject,
results.marks,
results.grade,
results.status


FROM results


LEFT JOIN students

ON results.roll = students.roll


ORDER BY results.id DESC


`,
[],


(err,rows)=>{


if(err){

return res.status(500).json({

success:false,
message:err.message

});

}



res.json({

success:true,

results:rows

});


});


});







// ===============================
// ADD RESULT
// ===============================


router.post("/",(req,res)=>{


const {

roll,
subject,
marks,
grade,
status


}=req.body;




db.run(`

INSERT INTO results

(
roll,
subject,
marks,
grade,
status
)

VALUES(?,?,?,?,?)

`,

[

roll,
subject,
marks,
grade,
status

],


function(err){


if(err){

return res.status(500).json({

success:false,
message:err.message

});

}



res.json({

success:true,

message:"Result Saved Successfully",

id:this.lastID

});



});



});







// ===============================
// DELETE RESULT
// ===============================


router.delete("/:id",(req,res)=>{


db.run(

`
DELETE FROM results

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

message:"Deleted Successfully"

});


});



});





module.exports=router;