const express = require("express");
const router = express.Router();
const db = require("../models/database");


// ====================================
// GET ALL STUDENTS / FILTER STUDENTS
// ====================================

router.get("/", (req, res) => {


    const department = req.query.department;
    const year = req.query.year;


    let query = `
        SELECT *
        FROM students
    `;


    let conditions = [];
    let params = [];



    if(department){

        conditions.push(
            "LOWER(department)=LOWER(?)"
        );

        params.push(department);

    }



    if(year){

        conditions.push(
            "LOWER(year)=LOWER(?)"
        );

        params.push(year);

    }



    if(conditions.length > 0){

        query += 
        " WHERE " + conditions.join(" AND ");

    }



    query += " ORDER BY id DESC";




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

                students:rows

            });


        }

    );


});





// ======================================
// GET STUDENT BY EMAIL
// ======================================

router.get("/email/:email", (req,res)=>{

    const email = req.params.email;


    db.get(

        `SELECT *
         FROM students
         WHERE email = ?`,

        [email],

        (err,row)=>{


            if(err){

                console.log(
                    "Student Email Error:",
                    err.message
                );


                return res.status(500).json({

                    success:false,
                    message:err.message

                });

            }



            if(!row){

                return res.status(404).json({

                    success:false,
                    message:"Student Not Found"

                });

            }



            res.json({

                success:true,
                student:row

            });


        }

    );


});



// ====================================
// GET STUDENT BY ID
// ====================================


router.get("/:id",(req,res)=>{


db.get(

"SELECT * FROM students WHERE id=?",

[req.params.id],


(err,student)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});

}



if(!student){

return res.status(404).json({

success:false,

message:"Student not found"

});

}



res.json({

success:true,

student

});


}


);


});






// ====================================
// ADD STUDENT
// ====================================


router.post("/",(req,res)=>{


const {

name,
roll,
department,
year,
email,
phone,
password


}=req.body;




if(
!name ||
!roll ||
!department ||
!year ||
!email ||
!phone
){

return res.status(400).json({

success:false,

message:"All fields are required"

});

}




db.run(

`

INSERT INTO students

(
name,
roll,
department,
year,
email,
phone,
password
)

VALUES(?,?,?,?,?,?,?)

`,

[

name,
roll,
department.toUpperCase(),
year,
email,
phone,
password || "1234"

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

message:"Student Added Successfully",

studentId:this.lastID

});


}


);


});







// ====================================
// UPDATE STUDENT
// ====================================


router.put("/:id",(req,res)=>{


const {

name,
roll,
department,
year,
email,
phone


}=req.body;



db.run(

`

UPDATE students SET

name=?,
roll=?,
department=?,
year=?,
email=?,
phone=?

WHERE id=?

`,

[

name,
roll,
department.toUpperCase(),
year,
email,
phone,
req.params.id

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

message:"Student Updated Successfully"

});


}


);


});






// ====================================
// DELETE STUDENT
// ====================================


router.delete("/:id",(req,res)=>{


db.run(

"DELETE FROM students WHERE id=?",

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

message:"Student Deleted Successfully"

});


}


);


});




module.exports = router;