// =====================================
// Results Route
// =====================================

const express = require("express");
const router = express.Router();

const db = require("../models/database");


// =====================================
// Add Result
// =====================================

router.post("/", (req, res) => {

    const {
        roll,
        subject,
        marks,
        grade,
        status
    } = req.body;


    if(!roll || !subject || marks === undefined){

        return res.status(400).json({

            success:false,
            message:"All fields are required"

        });

    }



    const sql = `

    INSERT INTO results
    (
        roll,
        subject,
        marks,
        grade,
        status
    )

    VALUES (?,?,?,?,?)

    `;



    db.run(
        sql,

        [
            roll,
            subject,
            marks,
            grade,
            status
        ],

        function(error){


            if(error){

                console.error(error);


                return res.status(500).json({

                    success:false,
                    message:error.message

                });


            }



            res.json({

                success:true,

                message:"Result added successfully",

                id:this.lastID

            });



        }

    );


});




// =====================================
// Get All Results
// =====================================

router.get("/", (req,res)=>{


    const sql = `

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


    `;



    db.all(sql, [], (error, rows)=>{


        if(error){


            console.error(error);


            return res.status(500).json({

                success:false,

                message:error.message

            });


        }



        res.json({

            success:true,

            results:rows

        });



    });



});



// =====================================
// Get Results By Roll Number
// =====================================

router.get("/:roll",(req,res)=>{


    const roll=req.params.roll;



    const sql = `

    SELECT

    results.*,

    students.name,

    students.department,

    students.year


    FROM results


    LEFT JOIN students

    ON results.roll = students.roll


    WHERE results.roll=?


    `;



    db.all(sql,[roll],(error,rows)=>{


        if(error){


            return res.status(500).json({

                success:false,

                message:error.message

            });


        }



        res.json({

            success:true,

            results:rows

        });


    });


});



module.exports = router;