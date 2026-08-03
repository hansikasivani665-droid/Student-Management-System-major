const express = require("express");
const router = express.Router();
const db = require("../models/database");


// ======================================
// ADMIN DASHBOARD
// ======================================

router.get("/", (req, res) => {

    db.get(`
        SELECT
            COUNT(*) AS totalStudents,
            COUNT(DISTINCT department) AS totalDepartments
        FROM students
    `, (err, studentData) => {

        if (err)
            return res.status(500).json({
                success:false,
                message:err.message
            });


        // ================================
        // ATTENDANCE
        // ================================

        db.get(`

            SELECT

                COUNT(DISTINCT roll) AS totalAttendance,

                COUNT(
                    DISTINCT CASE
                    WHEN status='Present'
                    THEN roll END
                ) AS presentStudents,


                COUNT(
                    DISTINCT CASE
                    WHEN status='Absent'
                    THEN roll END
                ) AS absentStudents


            FROM attendance


            WHERE date = (
                SELECT MAX(date)
                FROM attendance
            )

        `,(attErr,attendanceData)=>{


            if(attErr)
                return res.status(500).json({
                    success:false,
                    message:attErr.message
                });



            // ================================
            // RESULTS
            // ================================


            db.get(`

                SELECT

                    COUNT(*) AS resultsCount,

                    AVG(marks) AS averageMarks,


                    SUM(
                        CASE
                        WHEN status='Pass'
                        THEN 1 ELSE 0 END
                    ) AS passStudents


                FROM results


            `,(resErr,resultData)=>{


                if(resErr)
                    return res.status(500).json({
                        success:false,
                        message:resErr.message
                    });



                db.get(`

                    SELECT name
                    FROM students
                    ORDER BY id DESC
                    LIMIT 1

                `,(latestErr,latestStudent)=>{


                    if(latestErr)
                        return res.status(500).json({
                            success:false,
                            message:latestErr.message
                        });



                    // ================================
                    // DEPARTMENT PERFORMANCE
                    // ================================


                    db.all(`


                    SELECT

                        s.department,


                        COUNT(DISTINCT s.roll)
                        AS totalStudents,


                        COALESCE(
                            att.attendancePercentage,
                            0
                        )
                        AS attendancePercentage,


                        COALESCE(
                            res.averageMarks,
                            0
                        )
                        AS averageMarks,


                        COALESCE(
                            res.passPercentage,
                            0
                        )
                        AS passPercentage



                    FROM students s



                    LEFT JOIN (


                        SELECT


                            st.department,


                            ROUND(

                                100.0 *

                                COUNT(
                                    DISTINCT CASE
                                    WHEN a.status='Present'
                                    THEN a.roll END
                                )

                                /

                                NULLIF(
                                    COUNT(DISTINCT a.roll),
                                    0
                                ),

                                2

                            )

                            AS attendancePercentage



                        FROM attendance a



                        INNER JOIN students st

                        ON st.roll=a.roll



                        WHERE a.date = (

                            SELECT MAX(date)
                            FROM attendance

                        )



                        GROUP BY st.department



                    ) att



                    ON LOWER(att.department)
                    =
                    LOWER(s.department)




                    LEFT JOIN (


                        SELECT


                            st.department,


                            ROUND(
                                AVG(r.marks),
                                2
                            )
                            AS averageMarks,



                            ROUND(

                                100.0 *

                                SUM(
                                    CASE
                                    WHEN r.status='Pass'
                                    THEN 1 ELSE 0 END
                                )

                                /

                                NULLIF(
                                    COUNT(r.id),
                                    0
                                ),

                                2

                            )
                            AS passPercentage



                        FROM results r



                        INNER JOIN students st

                        ON st.roll=r.roll



                        GROUP BY st.department



                    ) res



                    ON LOWER(res.department)
                    =
                    LOWER(s.department)



                    GROUP BY s.department



                    ORDER BY s.department



                    `,(deptErr,departments)=>{


                        if(deptErr)
                            return res.status(500).json({
                                success:false,
                                message:deptErr.message
                            });



                        res.json({

                            success:true,


                            totalStudents:
                            studentData.totalStudents,


                            totalDepartments:
                            studentData.totalDepartments,


                            presentStudents:
                            attendanceData.presentStudents || 0,


                            absentStudents:
                            attendanceData.absentStudents || 0,


                            attendancePercentage:

                            attendanceData.totalAttendance

                            ?

                            Math.round(

                                attendanceData.presentStudents *
                                100 /
                                attendanceData.totalAttendance

                            )

                            :
                            0,



                            averageMarks:

                            resultData.averageMarks

                            ?

                            Number(
                                resultData.averageMarks
                            ).toFixed(2)

                            :
                            0,



                            passPercentage:

                            resultData.resultsCount

                            ?

                            Math.round(

                                resultData.passStudents *
                                100 /
                                resultData.resultsCount

                            )

                            :
                            0,



                            resultsCount:
                            resultData.resultsCount,


                            latestStudent:

                            latestStudent
                            ?
                            latestStudent.name
                            :
                            "-",



                            departments:
                            departments.map(d=>({

                                department:d.department,

                                totalStudents:d.totalStudents,

                                attendancePercentage:
                                d.attendancePercentage || 0,


                                averageMarks:
                                d.averageMarks || 0,


                                passPercentage:
                                d.passPercentage || 0

                            }))

                        });


                    });



                });



            });



        });



    });



});




// ======================================
// DEPARTMENT DASHBOARD
// ======================================

router.get("/department",(req,res)=>{


db.all(`

SELECT

s.department,

COUNT(DISTINCT s.roll)
AS totalStudents,


COALESCE(att.presentStudents,0)
AS presentStudents,


COALESCE(att.absentStudents,0)
AS absentStudents,


COALESCE(att.attendancePercentage,0)
AS attendancePercentage



FROM students s



LEFT JOIN (

SELECT


st.department,


COUNT(
DISTINCT CASE
WHEN a.status='Present'
THEN a.roll END
)
AS presentStudents,


COUNT(
DISTINCT CASE
WHEN a.status='Absent'
THEN a.roll END
)
AS absentStudents,


ROUND(

100.0 *

COUNT(
DISTINCT CASE
WHEN a.status='Present'
THEN a.roll END
)

/

NULLIF(
COUNT(DISTINCT a.roll),
0
),

2

)

AS attendancePercentage



FROM attendance a



INNER JOIN students st

ON st.roll=a.roll



WHERE a.date=(

SELECT MAX(date)
FROM attendance

)



GROUP BY st.department



) att



ON LOWER(att.department)
=
LOWER(s.department)



GROUP BY s.department



ORDER BY s.department



`,(err,rows)=>{


if(err)
return res.status(500).json({

success:false,
message:err.message

});


res.json({

success:true,

departments:rows

});


});


});



module.exports = router;