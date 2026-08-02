const express = require("express");
const router = express.Router();
const db = require("../models/database");

// ==========================================
// GET TODAY ATTENDANCE
// ==========================================

router.get("/", (req, res) => {

    const today = new Date().toISOString().split("T")[0];

    const query = `
        SELECT
            students.id,
            students.roll,
            students.name,
            students.department,
            students.year,
            attendance.date,
            attendance.status
        FROM students
        LEFT JOIN attendance
            ON students.roll = attendance.roll
            AND attendance.date = ?
        ORDER BY students.id ASC
    `;

    db.all(query, [today], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        let present = 0;
        let absent = 0;

        rows.forEach(row => {

            if (row.status === "Present") {
                present++;
            } else if (row.status === "Absent") {
                absent++;
            }

        });

        res.json({
            success: true,
            attendance: rows,
            summary: {
                total: rows.length,
                present,
                absent
            }
        });

    });

});


// ==========================================
// SAVE / UPDATE ATTENDANCE
// ==========================================

router.post("/", (req, res) => {

    const { roll, status } = req.body;

    const date = new Date().toISOString().split("T")[0];

    db.get(
        "SELECT * FROM attendance WHERE roll=? AND date=?",
        [roll, date],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (row) {

                db.run(
                    "UPDATE attendance SET status=? WHERE roll=? AND date=?",
                    [status, roll, date],
                    function (err) {

                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err.message
                            });
                        }

                        res.json({
                            success: true,
                            message: "Attendance Updated Successfully"
                        });

                    }
                );

            } else {

                db.run(
                    "INSERT INTO attendance(roll,date,status) VALUES(?,?,?)",
                    [roll, date, status],
                    function (err) {

                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err.message
                            });
                        }

                        res.json({
                            success: true,
                            message: "Attendance Saved Successfully"
                        });

                    }
                );

            }

        }

    );

});


// ==========================================
// STUDENT ATTENDANCE REPORT
// ==========================================

router.get("/student/:roll", (req, res) => {

    const roll = req.params.roll;

    db.all(
        `
        SELECT *
        FROM attendance
        WHERE roll=?
        ORDER BY date DESC
        `,
        [roll],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            const total = rows.length;

            const present = rows.filter(
                row => row.status === "Present"
            ).length;

            const absent = rows.filter(
                row => row.status === "Absent"
            ).length;

            const percentage =
                total > 0
                    ? Math.round((present / total) * 100)
                    : 0;

            res.json({

                success: true,

                attendance: rows,

                summary: {
                    totalDays: total,
                    present,
                    absent,
                    percentage
                }

            });

        }

    );

});


// ==========================================
// DELETE ATTENDANCE
// ==========================================

router.delete("/:id", (req, res) => {

    db.run(
        "DELETE FROM attendance WHERE id=?",
        [req.params.id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Attendance Deleted Successfully"
            });

        }
    );

});

module.exports = router;