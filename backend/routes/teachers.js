// =====================================================
// TEACHER ROUTES
// =====================================================

const express = require("express");
const router = express.Router();

const db = require("../models/database");

console.log("teachers.js Loaded");



// =====================================================
// GET ALL TEACHERS
// GET /teachers
// =====================================================

router.get("/", (req, res) => {


    db.all(

        `
        SELECT *
        FROM teachers
        ORDER BY id DESC
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

                teachers:rows

            });



        }

    );


});






// =====================================================
// GET TEACHER BY EMAIL
// GET /teachers/email/:email
// =====================================================

router.get("/email/:email",(req,res)=>{


    const email = req.params.email;



    db.get(

        `
        SELECT *
        FROM teachers
        WHERE email=?
        `,

        [

            email

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






// =====================================================
// GET STUDENTS OF TEACHER
// GET /teachers/:teacherId/students
// =====================================================

router.get("/:teacherId/students",(req,res)=>{


    const teacherId = req.params.teacherId;



    db.get(

        `
        SELECT
            department,
            subject,
            teacherId
        FROM teachers
        WHERE teacherId=?
        `,

        [

            teacherId

        ],

        (err,teacher)=>{


            if(err){

                return res.status(500).json({

                    success:false,

                    message:err.message

                });

            }



            if(!teacher){

                return res.status(404).json({

                    success:false,

                    message:"Teacher not found"

                });

            }



            db.all(

                `
                SELECT *
                FROM students
                WHERE LOWER(department)=LOWER(?)
                ORDER BY roll
                `,

                [

                    teacher.department

                ],

                (err,students)=>{


                    if(err){

                        return res.status(500).json({

                            success:false,

                            message:err.message

                        });

                    }



                    res.json({

                        success:true,

                        teacher:teacher,

                        students:students

                    });



                }

            );



        }

    );


});

// =====================================================
// FIX DEFAULT TEACHER DATA
// GET /teachers/fix-subjects
// =====================================================

router.get("/fix-subjects",(req,res)=>{


    db.serialize(()=>{


        db.run(`

            UPDATE teachers

            SET
                subject='DBMS',
                department='CSE'

            WHERE teacherId='T001'

        `);



        db.run(`

            UPDATE teachers

            SET
                subject='Computer Networks',
                department='ECE'

            WHERE teacherId='T002'

        `);



        db.run(`

            UPDATE teachers

            SET
                subject='Operating Systems',
                department='EEE'

            WHERE teacherId='T003'

        `);



        db.run(`

            UPDATE teachers

            SET
                subject='Thermodynamics',
                department='Mechanical'

            WHERE teacherId='T004'

        `);



        db.run(`

            UPDATE teachers

            SET
                subject='Structural Engineering',
                department='Civil'

            WHERE teacherId='T005'

        `);



    });



    res.json({

        success:true,

        message:"Teacher details updated successfully"

    });



});






// =====================================================
// GET SINGLE TEACHER
// GET /teachers/:id
// =====================================================

router.get("/:id",(req,res)=>{


    const id = req.params.id;



    db.get(

        `
        SELECT *
        FROM teachers
        WHERE id=?
        `,

        [

            id

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








// =====================================================
// ADD TEACHER
// POST /teachers
// =====================================================

router.post("/",(req,res)=>{


    const {


        name,

        teacherId,

        department,

        subject,

        email,

        phone,

        qualification,

        experience,

        password


    } = req.body;






    if(

        !name ||

        !teacherId ||

        !department ||

        !email ||

        !phone

    ){

        return res.status(400).json({

            success:false,

            message:"Required fields missing"

        });

    }






    db.get(

        `
        SELECT id
        FROM teachers
        WHERE teacherId=?
        OR email=?
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
                    teacherId,
                    name,
                    department,
                    subject,
                    email,
                    phone,
                    qualification,
                    experience,
                    password
                )

                VALUES (?,?,?,?,?,?,?,?,?)

                `,


                [

                    teacherId,

                    name,

                    department,

                    subject || "",

                    email,

                    phone,

                    qualification || "",

                    experience || "",

                    password || "Teacher@123"


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



                }

            );



        }

    );


});

// =====================================================
// UPDATE TEACHER
// PUT /teachers/:id
// =====================================================

router.put("/:id",(req,res)=>{


    const {


        name,

        teacherId,

        department,

        subject,

        email,

        phone,

        qualification,

        experience,

        password


    } = req.body;






    db.run(

        `

        UPDATE teachers

        SET

            teacherId=?,

            name=?,

            department=?,

            subject=?,

            email=?,

            phone=?,

            qualification=?,

            experience=?,

            password=?


        WHERE id=?

        `,


        [

            teacherId,

            name,

            department,

            subject,

            email,

            phone,

            qualification || "",

            experience || "",

            password || "Teacher@123",

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

                message:"Teacher Updated Successfully"

            });



        }

    );


});








// =====================================================
// DELETE TEACHER
// DELETE /teachers/:id
// =====================================================

router.delete("/:id",(req,res)=>{


    const id = req.params.id;



    db.run(

        `
        DELETE FROM teachers
        WHERE id=?
        `,

        [

            id

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

                message:"Teacher Deleted Successfully"

            });



        }

    );


});








// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;