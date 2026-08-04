// =====================================================
// DASHBOARD ROUTES
// =====================================================

const express = require("express");
const router = express.Router();

const db = require("../models/database");




// =====================================================
// ADMIN DASHBOARD DATA
// GET /dashboard
// =====================================================

router.get("/", (req, res) => {



    // ======================================
    // TOTAL STUDENTS QUERY
    // ======================================

    const studentQuery = `

        SELECT

            COUNT(*) AS totalStudents,

            COUNT(DISTINCT department) AS totalDepartments

        FROM students

    `;




    // ======================================
    // TOTAL TEACHERS QUERY
    // ======================================

    const teacherQuery = `

        SELECT

            COUNT(*) AS totalTeachers

        FROM teachers

    `;




    // ======================================
    // LATEST ATTENDANCE QUERY
    // ======================================

    const attendanceQuery = `

        SELECT


            SUM(

                CASE

                    WHEN status = 'Present'

                    THEN 1

                    ELSE 0

                END

            ) AS presentStudents,



            SUM(

                CASE

                    WHEN status = 'Absent'

                    THEN 1

                    ELSE 0

                END

            ) AS absentStudents,



            COUNT(*) AS totalAttendance



        FROM attendance



        WHERE date = (

            SELECT MAX(date)

            FROM attendance

        )

    `;




    // ======================================
    // RESULTS QUERY
    // ======================================

    const resultQuery = `

        SELECT


            AVG(marks) AS averageMarks,


            COUNT(*) AS resultsCount,



            SUM(

                CASE

                    WHEN marks >= 40

                    THEN 1

                    ELSE 0

                END

            ) AS passCount



        FROM results

    `;




    // ======================================
    // LATEST STUDENT QUERY
    // ======================================

    const latestStudentQuery = `

        SELECT

            name

        FROM students

        ORDER BY id DESC

        LIMIT 1

    `;





    // ======================================
    // STUDENT DATA
    // ======================================

    db.get(studentQuery, [], (err, studentData) => {



        if (err) {

            return res.status(500).json({

                success: false,

                message: err.message

            });

        }




        // ======================================
        // TEACHER DATA
        // ======================================

        db.get(teacherQuery, [], (err, teacherData) => {



            if (err) {

                return res.status(500).json({

                    success: false,

                    message: err.message

                });

            }





            // ======================================
            // ATTENDANCE DATA
            // ======================================

            db.get(attendanceQuery, [], (err, attendanceData) => {



                if (err) {

                    return res.status(500).json({

                        success: false,

                        message: err.message

                    });

                }





                // ======================================
                // RESULTS DATA
                // ======================================

                db.get(resultQuery, [], (err, resultData) => {



                    if (err) {

                        return res.status(500).json({

                            success: false,

                            message: err.message

                        });

                    }





                    // ======================================
                    // LATEST STUDENT DATA
                    // ======================================

                    db.get(
                        latestStudentQuery,
                        [],
                        (err, latestStudent) => {


                            if (err) {

                                return res.status(500).json({

                                    success: false,

                                    message: err.message

                                });

                            }




                            // ======================================
                            // ATTENDANCE PERCENTAGE
                            // ======================================

                            let attendancePercentage = 0;



                            if (
                                attendanceData &&
                                attendanceData.totalAttendance > 0
                            ) {

                                attendancePercentage =

                                    (

                                        attendanceData.presentStudents /

                                        attendanceData.totalAttendance

                                    ) * 100;

                            }





                            // ======================================
                            // PASS PERCENTAGE
                            // ======================================

                            let passPercentage = 0;



                            if (
                                resultData &&
                                resultData.resultsCount > 0
                            ) {

                                passPercentage =

                                    (

                                        resultData.passCount /

                                        resultData.resultsCount

                                    ) * 100;

                            }





                            // ======================================
                            // DEPARTMENT PERFORMANCE QUERY
                            // ======================================

                            const departmentQuery = `


                                SELECT


                                    s.department,


                                    COUNT(DISTINCT s.roll) AS totalStudents,



                                    SUM(

                                        CASE

                                            WHEN a.status = 'Present'

                                            THEN 1

                                            ELSE 0

                                        END

                                    ) AS presentStudents,



                                    SUM(

                                        CASE

                                            WHEN a.status = 'Absent'

                                            THEN 1

                                            ELSE 0

                                        END

                                    ) AS absentStudents,



                                    ROUND(

                                        AVG(r.marks),

                                        2

                                    ) AS averageMarks



                                FROM students s



                                LEFT JOIN attendance a


                                ON s.roll = a.roll



                                AND a.date = (

                                    SELECT MAX(date)

                                    FROM attendance

                                )



                                LEFT JOIN results r


                                ON s.roll = r.roll



                                GROUP BY s.department



                                ORDER BY s.department



                            `;




                            // ======================================
                            // GET DEPARTMENT DATA
                            // ======================================

                            db.all(

                                departmentQuery,

                                [],

                                (err, departmentData) => {


                                    if (err) {


                                        return res.status(500).json({

                                            success: false,

                                            message: err.message

                                        });


                                    }





                                    const departments = departmentData.map(dep => {


                                        return {


                                            department:

                                                dep.department || "-",



                                            totalStudents:

                                                dep.totalStudents || 0,



                                            presentStudents:

                                                dep.presentStudents || 0,



                                            absentStudents:

                                                dep.absentStudents || 0,



                                            averageMarks:

                                                dep.averageMarks || 0



                                        };


                                    });







                                    // ======================================
                                    // DEPARTMENT ATTENDANCE %
                                    // ======================================


                                    const departmentAttendanceQuery = `


                                        SELECT


                                            s.department,



                                            ROUND(

                                                (

                                                    SUM(

                                                        CASE

                                                            WHEN a.status='Present'

                                                            THEN 1

                                                            ELSE 0

                                                        END

                                                    )

                                                    /

                                                    COUNT(a.id)

                                                ) * 100,

                                                2

                                            ) AS attendancePercentage



                                        FROM students s



                                        LEFT JOIN attendance a



                                        ON s.roll = a.roll



                                        AND a.date=(

                                            SELECT MAX(date)

                                            FROM attendance

                                        )



                                        GROUP BY s.department



                                    `;





                                    db.all(

                                        departmentAttendanceQuery,

                                        [],

                                        (err, attendanceDepartments) => {


                                            if (err) {


                                                return res.status(500).json({

                                                    success: false,

                                                    message: err.message

                                                });


                                            }





                                            // ======================================
                                            // MERGE ATTENDANCE PERCENTAGE
                                            // ======================================


                                            departments.forEach(dep => {


                                                const attendance =

                                                    attendanceDepartments.find(item =>

                                                        item.department === dep.department

                                                    );



                                                dep.attendancePercentage =


                                                    attendance

                                                        ?

                                                        attendance.attendancePercentage || 0

                                                        :

                                                        0;



                                            });


                                            // ======================================
                                            // FINAL DASHBOARD RESPONSE
                                            // ======================================


                                            res.json({


                                                success: true,


                                                totalStudents:

                                                    studentData.totalStudents || 0,



                                                totalTeachers:

                                                    teacherData.totalTeachers || 0,



                                                totalDepartments:

                                                    studentData.totalDepartments || 0,



                                                presentStudents:

                                                    attendanceData.presentStudents || 0,



                                                absentStudents:

                                                    attendanceData.absentStudents || 0,



                                                attendancePercentage:

                                                    Number(

                                                        attendancePercentage.toFixed(2)

                                                    ),



                                                averageMarks:

                                                    Number(

                                                        resultData.averageMarks || 0

                                                    ),



                                                resultsCount:

                                                    resultData.resultsCount || 0,



                                                passPercentage:

                                                    Number(

                                                        passPercentage.toFixed(2)

                                                    ),



                                                latestStudent:


                                                    latestStudent

                                                        ?

                                                        latestStudent.name

                                                        :

                                                        "-",



                                                departments: departments



                                            });



                                        }



                                    );



                                }



                            );



                        }



                    );



                }



                );



            });



        });



    });







    // =====================================================
    // DEPARTMENT DETAILS API
    // GET /dashboard/department
    // =====================================================


    router.get("/department", (req, res) => {


        const query = `


        SELECT


            s.department,


            COUNT(DISTINCT s.roll) AS totalStudents,



            SUM(

                CASE

                    WHEN a.status='Present'

                    THEN 1

                    ELSE 0

                END

            ) AS presentStudents,



            SUM(

                CASE

                    WHEN a.status='Absent'

                    THEN 1

                    ELSE 0

                END

            ) AS absentStudents,



            ROUND(

                AVG(r.marks),

                2

            ) AS averageMarks



        FROM students s



        LEFT JOIN attendance a



        ON s.roll = a.roll



        AND a.date=(

            SELECT MAX(date)

            FROM attendance

        )



        LEFT JOIN results r



        ON s.roll = r.roll



        GROUP BY s.department



        ORDER BY s.department



    `;




        db.all(query, [], (err, rows) => {


            if (err) {


                return res.status(500).json({

                    success: false,

                    message: err.message

                });


            }




            res.json({


                success: true,


                departments: rows.map(row => ({


                    department:

                        row.department || "-",



                    totalStudents:

                        row.totalStudents || 0,



                    presentStudents:

                        row.presentStudents || 0,



                    absentStudents:

                        row.absentStudents || 0,



                    averageMarks:

                        row.averageMarks || 0



                }))


            });



        });



    });






    // =====================================================
    // EXPORT ROUTER
    // =====================================================


    module.exports = router;
