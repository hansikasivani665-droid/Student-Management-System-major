const express = require("express");
const router = express.Router();
const db = require("../models/database");

router.get("/", (req, res) => {

    const today = new Date().toISOString().split("T")[0];

    db.get(
        "SELECT COUNT(*) AS totalStudents FROM students",
        [],
        (err, studentData) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            db.get(
                `SELECT COUNT(*) AS presentStudents
                 FROM attendance
                 WHERE status='Present'
                 AND date=?`,
                [today],
                (err, presentData) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    db.get(
                        `SELECT COUNT(*) AS absentStudents
                         FROM attendance
                         WHERE status='Absent'
                         AND date=?`,
                        [today],
                        (err, absentData) => {

                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: err.message
                                });
                            }

                            db.get(
                                `SELECT COUNT(*) AS resultsCount,
                                        AVG(marks) AS averageMarks
                                 FROM results`,
                                [],
                                (err, resultData) => {

                                    if (err) {
                                        return res.status(500).json({
                                            success: false,
                                            message: err.message
                                        });
                                    }

                                    db.get(
                                        "SELECT COUNT(*) AS passCount FROM results WHERE status='Pass'",
                                        [],
                                        (err, passData) => {

                                            if (err) {
                                                return res.status(500).json({
                                                    success: false,
                                                    message: err.message
                                                });
                                            }

                                            db.get(
                                                "SELECT name FROM students ORDER BY id DESC LIMIT 1",
                                                [],
                                                (err, latestStudent) => {

                                                    if (err) {
                                                        return res.status(500).json({
                                                            success: false,
                                                            message: err.message
                                                        });
                                                    }

                                                    db.get(
                                                        "SELECT COUNT(DISTINCT department) AS totalDepartments FROM students",
                                                        [],
                                                        (err, deptData) => {

                                                            if (err) {
                                                                return res.status(500).json({
                                                                    success: false,
                                                                    message: err.message
                                                                });
                                                            }

                                                            const totalStudents = studentData.totalStudents || 0;

                                                            const presentStudents = presentData.presentStudents || 0;

                                                            const absentStudents = absentData.absentStudents || 0;

                                                            const resultsCount = resultData.resultsCount || 0;

                                                            const averageMarks =
                                                                resultData.averageMarks
                                                                    ? Math.round(resultData.averageMarks)
                                                                    : 0;

                                                            const passCount = passData.passCount || 0;

                                                            const passPercentage =
                                                                resultsCount > 0
                                                                    ? Math.round((passCount / resultsCount) * 100)
                                                                    : 0;

                                                            res.json({

                                                                success: true,

                                                                totalStudents,

                                                                presentStudents,

                                                                absentStudents,

                                                                averageMarks,

                                                                totalDepartments:
                                                                    deptData.totalDepartments || 0,

                                                                resultsCount,

                                                                passPercentage,

                                                                latestStudent:
                                                                    latestStudent
                                                                        ? latestStudent.name
                                                                        : "-"

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