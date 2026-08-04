const express = require("express");
const router = express.Router();

console.log("✅ results.js loaded");

const db = require("../models/database");



// =====================================
// GET ALL RESULTS
// =====================================

router.get("/", (req, res) => {


    db.all(`

    SELECT

    results.id,
    results.roll,

    students.name,
    students.department,
    students.year,

    results.teacherId,
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


    (err, rows) => {


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





// =====================================
// ADD RESULT
// =====================================


router.post("/", (req,res)=>{


const {


    roll,

    teacherId,

    subject,

    marks,

    grade,

    status


}=req.body;





if(!roll || !subject || !marks){


    return res.status(400).json({

        success:false,

        message:"Required fields missing"

    });


}




// Get student details automatically

db.get(

"SELECT name, department FROM students WHERE roll=?",

[roll],


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





    db.run(`


    INSERT INTO results

    (

    roll,

    teacherId,

    name,

    department,

    subject,

    marks,

    grade,

    status

    )


    VALUES(?,?,?,?,?,?,?,?)


    `,


    [


    roll,

    teacherId,

    student.name,

    student.department,

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



});





// =====================================
// DELETE RESULT
// =====================================


router.delete("/:id",(req,res)=>{


db.run(

`

DELETE FROM results

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

        message:"Result Deleted Successfully"

    });



});


});





module.exports = router;