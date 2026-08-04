// =====================================================
// DASHBOARD ROUTES - PART 1
// =====================================================

const express = require("express");
const router = express.Router();

const db = require("../models/database");

// =====================================================
// ADMIN DASHBOARD
// GET /dashboard
// =====================================================

router.get("/", (req, res) => {

    // =====================================
    // TOTAL STUDENTS
    // =====================================

    const studentQuery = `
        SELECT
            COUNT(*) AS totalStudents,
            COUNT(DISTINCT department) AS totalDepartments
        FROM students
    `;

    // =====================================
    // TOTAL TEACHERS
    // =====================================

    const teacherQuery = `
        SELECT
            COUNT(*) AS totalTeachers
        FROM teachers
    `;

    // =====================================
    // LATEST ATTENDANCE
    // =====================================

    const attendanceQuery = `
        SELECT
            COUNT(CASE WHEN status='Present' THEN 1 END) AS presentStudents,
            COUNT(CASE WHEN status='Absent' THEN 1 END) AS absentStudents,
            COUNT(*) AS totalAttendance
        FROM attendance
        WHERE date = (
            SELECT MAX(date)
            FROM attendance
        )
    `;

    // =====================================
    // RESULTS
    // =====================================

    const resultQuery = `
        SELECT
            ROUND(AVG(marks),2) AS averageMarks,
            COUNT(*) AS resultsCount,
            SUM(
                CASE
                    WHEN marks >= 40 THEN 1
                    ELSE 0
                END
            ) AS passCount
        FROM results
    `;

    // =====================================
    // LATEST STUDENT
    // =====================================

    const latestStudentQuery = `
        SELECT name
        FROM students
        ORDER BY id DESC
        LIMIT 1
    `;

    // =====================================
    // STUDENTS
    // =====================================

    db.get(studentQuery, [], (err, studentData) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        // =====================================
        // TEACHERS
        // =====================================

        db.get(teacherQuery, [], (err, teacherData) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            // =====================================
            // ATTENDANCE
            // =====================================

            db.get(attendanceQuery, [], (err, attendanceData) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }

                // =====================================
                // RESULTS
                // =====================================

                db.get(resultQuery, [], (err, resultData) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    // =====================================
                    // LATEST STUDENT
                    // =====================================

                    db.get(latestStudentQuery, [], (err, latestStudent) => {

                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err.message
                            });
                        }

                        // =====================================
                        // CALCULATIONS
                        // =====================================

                        const attendancePercentage =
                            attendanceData.totalAttendance > 0
                                ? Number(
                                      (
                                          attendanceData.presentStudents *
                                          100 /
                                          attendanceData.totalAttendance
                                      ).toFixed(2)
                                  )
                                : 0;

                        const passPercentage =
                            resultData.resultsCount > 0
                                ? Number(
                                      (
                                          resultData.passCount *
                                          100 /
                                          resultData.resultsCount
                                      ).toFixed(2)
                                  )
                                : 0;

                        // =====================================
                        // DEPARTMENT QUERY
                        // =====================================

                        const departmentQuery = `
                            SELECT

                                s.department,

                                COUNT(DISTINCT s.roll) AS totalStudents,

                                COUNT(
                                    DISTINCT CASE
                                        WHEN a.status='Present'
                                        THEN a.roll
                                    END
                                ) AS presentStudents,

                                COUNT(
                                    DISTINCT CASE
                                        WHEN a.status='Absent'
                                        THEN a.roll
                                    END
                                ) AS absentStudents,

                                ROUND(AVG(r.marks),2) AS averageMarks

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
                                                db.all(departmentQuery, [], (err, departmentData) => {

                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: err.message
                                });
                            }

                            const departments = departmentData.map(dep => ({

                                department: dep.department,

                                totalStudents: dep.totalStudents || 0,

                                presentStudents: dep.presentStudents || 0,

                                absentStudents: dep.absentStudents || 0,

                                averageMarks: dep.averageMarks || 0,

                                attendancePercentage:
                                    dep.totalStudents > 0
                                        ? Number(
                                            (
                                                dep.presentStudents *
                                                100 /
                                                dep.totalStudents
                                            ).toFixed(2)
                                        )
                                        : 0

                            }));

                            // =====================================
                            // FINAL RESPONSE
                            // =====================================

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
                                    attendancePercentage,

                                averageMarks:
                                    resultData.averageMarks || 0,

                                resultsCount:
                                    resultData.resultsCount || 0,

                                passPercentage:
                                    passPercentage,

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

// =====================================================
// DEPARTMENT DETAILS API
// GET /dashboard/department
// =====================================================

router.get("/department", (req, res) => {

    const query = `

        SELECT

            s.department,

            COUNT(DISTINCT s.roll) AS totalStudents,

            COUNT(
                DISTINCT CASE
                    WHEN a.status = 'Present'
                    THEN a.roll
                END
            ) AS presentStudents,

            COUNT(
                DISTINCT CASE
                    WHEN a.status = 'Absent'
                    THEN a.roll
                END
            ) AS absentStudents,

            ROUND(AVG(r.marks),2) AS averageMarks

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

    db.all(query, [], (err, rows) => {

        if (err) {

            return res.status(500).json({

                success: false,

                message: err.message

            });

        }

        const departments = rows.map(row => ({

            department: row.department,

            totalStudents: row.totalStudents || 0,

            presentStudents: row.presentStudents || 0,

            absentStudents: row.absentStudents || 0,

            averageMarks: row.averageMarks || 0,

            attendancePercentage:
                row.totalStudents > 0
                    ? Number(
                        (
                            row.presentStudents *
                            100 /
                            row.totalStudents
                        ).toFixed(2)
                    )
                    : 0

        }));

        res.json({

            success: true,

            departments

        });

    });

});

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;