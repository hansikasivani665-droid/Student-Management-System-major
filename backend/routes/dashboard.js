const express = require("express");
const router = express.Router();
const db = require("../models/database");

// ======================================
// ADMIN DASHBOARD
// ======================================

router.get("/", (req, res) => {

    // Total Students & Departments
    db.get(`
        SELECT
            COUNT(*) AS totalStudents,
            COUNT(DISTINCT department) AS totalDepartments
        FROM students
    `, (err, studentData) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        // Attendance
        db.get(`
            SELECT
                COUNT(*) AS totalAttendance,
                SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) AS presentStudents,
                SUM(CASE WHEN status='Absent' THEN 1 ELSE 0 END) AS absentStudents
            FROM attendance
        `, (err, attendanceData) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            // Results
            db.get(`
                SELECT
                    COUNT(*) AS resultsCount,
                    AVG(marks) AS averageMarks,
                    SUM(CASE WHEN status='Pass' THEN 1 ELSE 0 END) AS passStudents
                FROM results
            `, (err, resultData) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                // Latest Student
                db.get(`
                    SELECT name
                    FROM students
                    ORDER BY id DESC
                    LIMIT 1
                `, (err, latestStudent) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    // Department Statistics
                    db.all(`
                        SELECT
                            department,
                            COUNT(*) AS totalStudents
                        FROM students
                        GROUP BY department
                        ORDER BY department
                    `, (err, departmentStudents) => {

                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err.message
                            });
                        }

                        db.all(`
                            SELECT
                                s.department,
                                ROUND(
                                    100.0 *
                                    SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END)
                                    / COUNT(a.id),2
                                ) AS attendancePercentage
                            FROM students s
                            LEFT JOIN attendance a
                            ON s.roll=a.roll
                            GROUP BY s.department
                        `, (err, attendanceDept) => {

                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: err.message
                                });
                            }

                            db.all(`
                                SELECT
                                    s.department,
                                    ROUND(AVG(r.marks),2) AS averageMarks,
                                    ROUND(
                                        100.0 *
                                        SUM(CASE WHEN r.status='Pass' THEN 1 ELSE 0 END)
                                        / COUNT(r.id),2
                                    ) AS passPercentage
                                FROM students s
                                LEFT JOIN results r
                                ON s.roll=r.roll
                                GROUP BY s.department
                            `, (err, resultDept) => {

                                if (err) {
                                    return res.status(500).json({
                                        success: false,
                                        message: err.message
                                    });
                                }

                                const departments = departmentStudents.map(d => {

                                    const attendance =
                                        attendanceDept.find(
                                            a => a.department === d.department
                                        );

                                    const result =
                                        resultDept.find(
                                            r => r.department === d.department
                                        );

                                    return {
                                        department: d.department,
                                        totalStudents: d.totalStudents,
                                        attendancePercentage:
                                            attendance?.attendancePercentage || 0,
                                        averageMarks:
                                            result?.averageMarks || 0,
                                        passPercentage:
                                            result?.passPercentage || 0
                                    };

                                });

                                res.json({

                                    success: true,

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
                                            ? Math.round(
                                                attendanceData.presentStudents * 100 /
                                                attendanceData.totalAttendance
                                            )
                                            : 0,

                                    averageMarks:
                                        resultData.averageMarks
                                            ? Number(resultData.averageMarks).toFixed(2)
                                            : 0,

                                    passPercentage:
                                        resultData.resultsCount
                                            ? Math.round(
                                                resultData.passStudents * 100 /
                                                resultData.resultsCount
                                            )
                                            : 0,

                                    resultsCount:
                                        resultData.resultsCount,

                                    latestStudent:
                                        latestStudent
                                            ? latestStudent.name
                                            : "-",

                                    departments

                                });

                            });

                        });

                    });

                });

            });

        });

    });

});

router.get("/department",(req,res)=>{


db.all(`

SELECT

s.department,

COUNT(DISTINCT s.roll) AS totalStudents,


ROUND(
100.0 *
SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END)
/
COUNT(a.id),
2
)
AS attendancePercentage,


ROUND(
AVG(r.marks),
2
)
AS averageMarks,


ROUND(
100.0 *
SUM(CASE WHEN r.status='Pass' THEN 1 ELSE 0 END)
/
COUNT(r.id),
2
)
AS passPercentage,


SUM(CASE WHEN a.status='Present'
THEN 1 ELSE 0 END)
AS presentStudents,


SUM(CASE WHEN a.status='Absent'
THEN 1 ELSE 0 END)
AS absentStudents,


COUNT(r.id)
AS resultsCount



FROM students s


LEFT JOIN attendance a

ON s.roll=a.roll



LEFT JOIN results r

ON s.roll=r.roll



GROUP BY s.department



ORDER BY s.department


`,


(err,rows)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});

}



res.json({

success:true,

departments:rows

});



});


});

module.exports = router;