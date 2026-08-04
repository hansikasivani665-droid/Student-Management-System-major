const express = require("express");
const router = express.Router();

const db = require("../models/database");



// ==========================================
// GET ATTENDANCE
// ==========================================

router.get("/", (req, res) => {


    const {
        department,
        subject,
        teacherId,
        date
    } = req.query;



    let query = `

        SELECT

            students.roll,

            students.name,

            students.department,

            attendance.subject,

            attendance.teacherId,

            attendance.date,

            attendance.status


        FROM students


        LEFT JOIN attendance

        ON students.roll = attendance.roll

    `;



    let params = [];

    const conditions = ["1=1"];




    if (department) {

        conditions.push(
            "LOWER(students.department)=LOWER(?)"
        );

        params.push(department);

    }




    if (subject) {

        conditions.push(
            "LOWER(attendance.subject)=LOWER(?)"
        );

        params.push(subject);

    }




    if (teacherId) {

        conditions.push(
            "attendance.teacherId=?"
        );

        params.push(teacherId);

    }




    if (date) {

        conditions.push(
            "attendance.date=?"
        );

        params.push(date);

    }



    query += " WHERE " + conditions.join(" AND ");

    query += " ORDER BY students.id DESC";





    db.all(

        query,

        params,

        (err, rows) => {



            if (err) {

                console.log(
                    "ATTENDANCE GET ERROR:",
                    err.message
                );


                return res.status(500).json({

                    success:false,

                    message:err.message

                });


            }





            rows.forEach(student => {


                if (!student.status) {

                    student.status = "Not Marked";

                }


            });





            res.json({

                success:true,

                attendance:rows

            });



        }

    );


});








// ==========================================
// GET STUDENT ATTENDANCE BY ROLL
// ==========================================


router.get("/student/:roll", (req,res)=>{


    const roll = req.params.roll;



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


        [

            roll

        ],


        (err,rows)=>{



            if(err){


                return res.status(500).json({

                    success:false,

                    message:err.message

                });


            }





            const totalDays = rows.length;


            const present = rows.filter(

                r => r.status === "Present"

            ).length;



            const absent = rows.filter(

                r => r.status === "Absent"

            ).length;




            const percentage = totalDays

                ? Math.round((present / totalDays) * 100)

                : 0;





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



        }


    );



});

// ==========================================
// SAVE / UPDATE ATTENDANCE
// ==========================================

router.post("/", (req, res) => {


    const {

        roll,

        subject,

        teacherId,

        date,

        status


    } = req.body;





    if (
        !roll ||
        !subject ||
        !teacherId ||
        !date ||
        !status
    ) {


        return res.status(400).json({

            success:false,

            message:"Missing Attendance Details"

        });


    }






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


                console.log(
                    "CHECK ATTENDANCE ERROR:",
                    err.message
                );


                return res.status(500).json({

                    success:false,

                    message:err.message

                });


            }







            // ===============================
            // UPDATE EXISTING ATTENDANCE
            // ===============================


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


                    (updateErr)=>{



                        if(updateErr){


                            console.log(
                                "UPDATE ATTENDANCE ERROR:",
                                updateErr.message
                            );


                            return res.status(500).json({

                                success:false,

                                message:updateErr.message

                            });


                        }





                        res.json({

                            success:true,

                            message:"Attendance Updated"

                        });




                    }


                );



            }





            // ===============================
            // INSERT NEW ATTENDANCE
            // ===============================


            else {



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


                    (insertErr)=>{





                        if(insertErr){


                            console.log(

                                "INSERT ATTENDANCE ERROR:",

                                insertErr.message

                            );



                            return res.status(500).json({

                                success:false,

                                message:insertErr.message

                            });



                        }





                        res.json({

                            success:true,

                            message:"Attendance Saved"

                        });




                    }


                );



            }




        }


    );



});







// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;