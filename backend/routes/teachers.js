const express = require("express");
const router = express.Router();

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
// IMPORTANT: KEEP ABOVE /:id
// ==========================================

router.get("/email/:email", (req,res)=>{


    const email = req.params.email;


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
// ADD TEACHER (ADMIN)
// ==========================================


router.post("/",(req,res)=>{


const {


name,
employeeId,
department,
email,
phone,
qualification


}=req.body;




if(
!name ||
!employeeId ||
!department ||
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
email,
phone,
qualification

)

VALUES(?,?,?,?,?,?)

`,

[

name,
employeeId,
department,
email,
phone,
qualification


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
email,
phone,
qualification


}=req.body;



db.run(

`

UPDATE teachers

SET

name=?,

employeeId=?,

department=?,

email=?,

phone=?,

qualification=?


WHERE id=?

`,

[

name,
employeeId,
department,
email,
phone,
qualification,
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




module.exports = router;