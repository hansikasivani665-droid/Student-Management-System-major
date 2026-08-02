const express = require("express");
const router = express.Router();

const db = require("../models/database");


// =====================================================
// ADMIN DASHBOARD API
// =====================================================

router.get("/", (req, res) => {


    // ======================================
    // TOTAL STUDENTS
    // ======================================

    db.get(
        `
        SELECT COUNT(*) AS totalStudents
        FROM students
        `,
        [],
        (err, studentData) => {


            if (err) {

                return res.status(500).json({
                    success:false,
                    message:err.message
                });

            }



            // ======================================
            // ATTENDANCE PRESENT
            // ======================================

            db.get(
                `
                SELECT COUNT(*) AS presentStudents
                FROM attendance
                WHERE status='Present'
                `,
                [],
                (err, presentData)=>{


                    if(err){

                        return res.status(500).json({
                            success:false,
                            message:err.message
                        });

                    }




                    // ======================================
                    // ATTENDANCE ABSENT
                    // ======================================

                    db.get(
                        `
                        SELECT COUNT(*) AS absentStudents
                        FROM attendance
                        WHERE status='Absent'
                        `,
                        [],
                        (err, absentData)=>{


                            if(err){

                                return res.status(500).json({
                                    success:false,
                                    message:err.message
                                });

                            }





                            // ======================================
                            // RESULTS DATA
                            // ======================================

                            db.get(
                                `
                                SELECT 
                                COUNT(*) AS resultsCount,
                                AVG(marks) AS averageMarks
                                FROM results
                                `,
                                [],
                                (err,resultData)=>{


                                    if(err){

                                        return res.status(500).json({
                                            success:false,
                                            message:err.message
                                        });

                                    }





                                    // ======================================
                                    // PASS COUNT
                                    // ======================================


                                    db.get(
                                        `
                                        SELECT COUNT(*) AS passCount
                                        FROM results
                                        WHERE status='Pass'
                                        `,
                                        [],
                                        (err,passData)=>{


                                            if(err){

                                                return res.status(500).json({
                                                    success:false,
                                                    message:err.message
                                                });

                                            }





                                            // ======================================
                                            // LATEST STUDENT
                                            // ======================================


                                            db.get(
                                                `
                                                SELECT name
                                                FROM students
                                                ORDER BY id DESC
                                                LIMIT 1
                                                `,
                                                [],
                                                (err,latestStudent)=>{


                                                    if(err){

                                                        return res.status(500).json({
                                                            success:false,
                                                            message:err.message
                                                        });

                                                    }





                                                    // ======================================
                                                    // TOTAL DEPARTMENTS
                                                    // STUDENTS + TEACHERS
                                                    // ======================================


                                                    db.get(
                                                        `
                                                        SELECT COUNT(DISTINCT department)
                                                        AS totalDepartments
                                                        FROM
                                                        (
                                                            SELECT department
                                                            FROM students

                                                            UNION

                                                            SELECT department
                                                            FROM teachers
                                                        )
                                                        `,
                                                        [],
                                                        (err,deptData)=>{


                                                            if(err){

                                                                return res.status(500).json({
                                                                    success:false,
                                                                    message:err.message
                                                                });

                                                            }





                                                            const totalStudents =
                                                            studentData.totalStudents || 0;



                                                            const presentStudents =
                                                            presentData.presentStudents || 0;



                                                            const absentStudents =
                                                            absentData.absentStudents || 0;



                                                            const resultsCount =
                                                            resultData.resultsCount || 0;



                                                            const averageMarks =
                                                            resultData.averageMarks
                                                            ?
                                                            Math.round(resultData.averageMarks)
                                                            :
                                                            0;



                                                            const passCount =
                                                            passData.passCount || 0;



                                                            const passPercentage =
                                                            resultsCount > 0
                                                            ?
                                                            Math.round(
                                                                (passCount/resultsCount)*100
                                                            )
                                                            :
                                                            0;




                                                            res.json({

                                                                success:true,


                                                                totalStudents,


                                                                presentStudents,


                                                                absentStudents,


                                                                attendancePercentage:
                                                                totalStudents > 0
                                                                ?
                                                                Math.round(
                                                                    (presentStudents /
                                                                    (presentStudents+absentStudents))
                                                                    *100
                                                                )
                                                                :
                                                                0,



                                                                averageMarks,


                                                                passPercentage,


                                                                resultsCount,


                                                                totalDepartments:
                                                                deptData.totalDepartments || 0,



                                                                latestStudent:
                                                                latestStudent
                                                                ?
                                                                latestStudent.name
                                                                :
                                                                "-"

                                                            });



                                                        }
                                                    );



                                                }
                                            );



                                        }
                                    );



                                }
                            );



                        }
                    );



                }
            );



        }
    );


});



module.exports = router;