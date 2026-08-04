// =====================================================
// AUTH ROUTES
// =====================================================

const express = require("express");
const router = express.Router();

const db = require("../models/database");



// =====================================================
// LOGIN API
// POST /auth/login
// =====================================================

router.post("/login", (req, res) => {


    const { email, password, role } = req.body;



    // ==========================================
    // VALIDATION
    // ==========================================

    if (!email || !password || !role) {

        return res.status(400).json({

            success:false,

            message:"Email, Password and Role are required"

        });

    }



    // ==========================================
    // ADMIN LOGIN
    // ==========================================

    if(role === "admin"){


        const adminEmail = "admin@gmail.com";

        const adminPassword = "Admin@123";



        if(
            email === adminEmail &&
            password === adminPassword
        ){


            return res.json({

                success:true,

                role:"admin",


                admin:{

                    name:"Administrator",

                    email:adminEmail

                },


                message:"Admin Login Successful"


            });


        }



        return res.status(401).json({

            success:false,

            message:"Invalid Admin Credentials"

        });



    }




    // ==========================================
    // STUDENT LOGIN
    // ==========================================

    if(role === "student"){


        db.get(

            `
            SELECT *
            FROM students
            WHERE email=? AND password=?
            `,


            [

                email,

                password

            ],



            (err, student)=>{


                if(err){


                    return res.status(500).json({

                        success:false,

                        message:err.message

                    });


                }



                if(!student){


                    return res.status(401).json({

                        success:false,

                        message:"Invalid Student Email or Password"

                    });


                }



                return res.json({

                    success:true,

                    role:"student",

                    student:student,

                    message:"Student Login Successful"


                });



            }


        );



        return;


    }





    // ==========================================
    // TEACHER LOGIN
    // ==========================================

    if(role === "teacher"){


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



            (err, teacher)=>{


                if(err){


                    return res.status(500).json({

                        success:false,

                        message:err.message

                    });


                }




                if(!teacher){


                    return res.status(401).json({

                        success:false,

                        message:"Invalid Teacher Email or Password"

                    });


                }




                return res.json({

                    success:true,

                    role:"teacher",

                    teacher:teacher,

                    message:"Teacher Login Successful"


                });



            }


        );



        return;


    }





    // ==========================================
    // INVALID ROLE
    // ==========================================

    return res.status(400).json({

        success:false,

        message:"Invalid Role"

    });



});




// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;