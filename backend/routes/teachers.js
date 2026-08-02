const express = require("express");
const router = express.Router();

console.log("teachers.js Loaded");

const db = require("../models/database");


// ==========================================
// GET ALL TEACHERS
// ==========================================

router.get("/", (req,res)=>{

    db.all(
        `
        SELECT *
        FROM teachers
        ORDER BY id DESC
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
                teachers:rows
            });

        }
    );

});



// ==========================================
// GET TEACHER BY EMAIL
// ==========================================

router.get("/email/:email",(req,res)=>{

    const email=req.params.email;

    db.get(
        `
        SELECT *
        FROM teachers
        WHERE email=?
        `,
        [email],

        (err,row)=>{

            if(err){
                return res.status(500).json({
                    success:false,
                    message:err.message
                });
            }


            if(!row){
                return res.status(404).json({
                    success:false,
                    message:"Teacher not found"
                });
            }


            res.json({
                success:true,
                teacher:row
            });

        }
    );

});



// ==========================================
// GET SINGLE TEACHER
// ==========================================

router.get("/:id",(req,res)=>{

    db.get(
        `
        SELECT *
        FROM teachers
        WHERE id=?
        `,
        [req.params.id],

        (err,row)=>{

            if(err){
                return res.status(500).json({
                    success:false,
                    message:err.message
                });
            }


            if(!row){
                return res.status(404).json({
                    success:false,
                    message:"Teacher not found"
                });
            }


            res.json({
                success:true,
                teacher:row
            });

        }
    );

});




// ==========================================
// ADD TEACHER (ADMIN)
// ==========================================

router.post("/",(req,res)=>{


const {

name,
employeeId,
department,
subject,
email,
phone,
qualification,
experience

}=req.body;



if(
!name ||
!employeeId ||
!department ||
!subject ||
!email ||
!phone
){

return res.status(400).json({

success:false,

message:"All required fields must be filled"

});

}




db.get(

`
SELECT *
FROM teachers
WHERE employeeId=? OR email=?
`,

[
employeeId,
email
],

(err,row)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});

}



if(row){

return res.status(400).json({

success:false,

message:"Teacher already exists"

});

}



db.run(

`

INSERT INTO teachers

(
name,
employeeId,
department,
subject,
email,
phone,
qualification,
experience

)

VALUES(?,?,?,?,?,?,?,?)

`,

[

name,
employeeId,
department,
subject,
email,
phone,
qualification,
experience

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

message:"Teacher Added Successfully",

teacherId:this.lastID

});


});


});


});






// ==========================================
// UPDATE TEACHER
// ==========================================

router.put("/:id",(req,res)=>{


const {

name,
employeeId,
department,
subject,
email,
phone,
qualification,
experience

}=req.body;



db.run(

`

UPDATE teachers

SET

name=?,
employeeId=?,
department=?,
subject=?,
email=?,
phone=?,
qualification=?,
experience=?

WHERE id=?

`,

[

name,
employeeId,
department,
subject,
email,
phone,
qualification,
experience,
req.params.id

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

message:"Teacher Updated Successfully"

});


});


});






// ==========================================
// DELETE TEACHER
// ==========================================

router.delete("/:id",(req,res)=>{


db.run(

`

DELETE FROM teachers

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

message:"Teacher Deleted Successfully"

});


});


});






// ==========================================
// TEACHER LOGIN
// ==========================================

router.post("/login",(req,res)=>{


const {

email,
password

}=req.body;



db.get(

`

SELECT *

FROM teachers

WHERE email=? AND password=?

`,

[
email,
password
],


(err,row)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});

}



if(!row){

return res.status(401).json({

success:false,

message:"Invalid Teacher Login"

});

}



res.json({

success:true,

teacher:row

});


});


});
router.put("/update-subjects", (req,res)=>{

    const subjects = [
        ["DBMS","T001"],
        ["Computer Networks","T002"],
        ["Operating Systems","T003"],
        ["Java Programming","T004"],
        ["Machine Learning","T005"]
    ];


    subjects.forEach(item=>{

        db.run(
            `
            UPDATE teachers
            SET subject=?
            WHERE teacherId=?
            `,
            item
        );

    });


    res.json({
        success:true,
        message:"Subjects Updated"
    });

});
// ==========================================
// UPDATE TEACHER SUBJECTS (ONE TIME USE)
// ==========================================

router.put("/update-subjects", (req,res)=>{


    const subjects = [

        ["DBMS","T001"],

        ["Computer Networks","T002"],

        ["Operating Systems","T003"],

        ["Java Programming","T004"],

        ["Machine Learning","T005"]

    ];


    let count = 0;


    subjects.forEach(data=>{


        db.run(

            `
            UPDATE teachers
            SET subject=?
            WHERE teacherId=?
            `,

            data,


            (err)=>{


                if(err){

                    return res.status(500).json({

                        success:false,

                        message:err.message

                    });

                }


                count++;


                if(count === subjects.length){


                    res.json({

                        success:true,

                        message:"Subjects Updated Successfully"

                    });


                }


            }

        );


    });


});

module.exports = router;