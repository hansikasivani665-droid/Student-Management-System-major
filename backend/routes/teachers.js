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
// ONE TIME SUBJECT UPDATE
// ==========================================

router.get("/fix-subjects",(req,res)=>{


    db.serialize(()=>{


        db.run(
            `
            UPDATE teachers
            SET subject='DBMS'
            WHERE teacherId='T001'
            `
        );


        db.run(
            `
            UPDATE teachers
            SET subject='Computer Networks'
            WHERE teacherId='T002'
            `
        );


        db.run(
            `
            UPDATE teachers
            SET subject='Operating Systems'
            WHERE teacherId='T003'
            `
        );


        db.run(
            `
            UPDATE teachers
            SET subject='Java Programming'
            WHERE teacherId='T004'
            `
        );


        db.run(
            `
            UPDATE teachers
            SET subject='Machine Learning'
            WHERE teacherId='T005'
            `
        );


    });


    res.json({

        success:true,

        message:"Subjects updated successfully"

    });


});





// ==========================================
// GET SINGLE TEACHER
// KEEP THIS AFTER FIX-SUBJECTS
// ==========================================

router.get("/:id",(req,res)=>{


    db.get(

        `
        SELECT *
        FROM teachers
        WHERE id=?
        `,

        [
            req.params.id
        ],


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
// ADD TEACHER
// ==========================================

router.post("/",(req,res)=>{


const {

name,
teacherId,
department,
subject,
email,
phone,
qualification,
experience

}=req.body;



if(
!name ||
!teacherId ||
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
WHERE teacherId=? OR email=?
`,

[
teacherId,
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
teacherId,
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
teacherId,
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

id:this.lastID

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
teacherId,
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
teacherId=?,
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
teacherId,
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

[
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




module.exports = router;