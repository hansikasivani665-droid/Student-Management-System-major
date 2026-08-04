const express = require("express");
const router = express.Router();

console.log("teachers.js Loaded");

const db = require("../models/database");

// ==========================================
// GET ALL TEACHERS
// ==========================================

router.get("/", (req, res) => {

    db.all(
        `
        SELECT *
        FROM teachers
        ORDER BY id DESC
        `,
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                teachers: rows
            });

        }
    );

});

// ==========================================
// GET TEACHER BY EMAIL
// ==========================================

router.get("/email/:email", (req, res) => {

    const email = req.params.email;

    db.get(

        `
        SELECT *
        FROM teachers
        WHERE email=?
        `,

        [email],

        (err, row) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    success: false,
                    message: "Teacher not found"
                });
            }

            res.json({
                success: true,
                teacher: row
            });

        }

    );

});

// ==========================================
// GET SINGLE TEACHER
// ==========================================

router.get("/:id", (req, res) => {

    db.get(

        `
        SELECT *
        FROM teachers
        WHERE id=?
        `,

        [req.params.id],

        (err, row) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    success: false,
                    message: "Teacher not found"
                });
            }

            res.json({
                success: true,
                teacher: row
            });

        }

    );

});

// ==========================================
// ADD TEACHER
// ==========================================

router.post("/", (req, res) => {

    const {
        name,
        teacherId,
        department,
        year,
        subject,
        email,
        phone,
        qualification,
        experience,
        password
    } = req.body;

    if (
        !name ||
        !teacherId ||
        !department ||
        !year ||
        !subject ||
        !email ||
        !phone
    ) {
        return res.status(400).json({
            success: false,
            message: "All required fields are required"
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

        (err, row) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (row) {
                return res.status(400).json({
                    success: false,
                    message: "Teacher already exists"
                });
            }

            db.run(

                `
                INSERT INTO teachers
                (
                    teacherId,
                    name,
                    department,
                    year,
                    subject,
                    email,
                    phone,
                    qualification,
                    experience,
                    password
                )
                VALUES (?,?,?,?,?,?,?,?,?,?)
                `,

                [
                    teacherId,
                    name,
                    department,
                    year,
                    subject,
                    email,
                    phone,
                    qualification || "",
                    experience || "",
                    password || "Teacher@123"
                ],

                function (err) {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    res.json({
                        success: true,
                        message: "Teacher Added Successfully",
                        id: this.lastID
                    });

                }

            );

        }

    );

});

// ==========================================
// UPDATE TEACHER
// ==========================================

router.put("/:id", (req, res) => {

    const {
        name,
        teacherId,
        department,
        year,
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
            year=?,
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
            year,
            subject,
            email,
            phone,
            qualification,
            experience,
            password,
            req.params.id
        ],

        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Teacher Updated Successfully"
            });

        }

    );

});

// ==========================================
// DELETE TEACHER
// ==========================================

router.delete("/:id", (req, res) => {

    db.run(

        `
        DELETE FROM teachers
        WHERE id=?
        `,

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
                message: "Teacher Deleted Successfully"
            });

        }

    );

});

// ==========================================
// TEACHER LOGIN
// ==========================================

router.post("/login", (req, res) => {

    const {
        email,
        password
    } = req.body;

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

        (err, teacher) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (!teacher) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Teacher Login"
                });
            }

            res.json({
                success: true,
                teacher
            });

        }

    );

});

// ==========================================
// GET STUDENTS OF LOGGED-IN TEACHER
// ==========================================

router.get("/:teacherId/students", (req, res) => {

    const teacherId = req.params.teacherId;

    db.get(

        `
        SELECT department, year
        FROM teachers
        WHERE teacherId=?
        `,

        [teacherId],

        (err, teacher) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: "Teacher not found"
                });
            }

            db.all(

                `
                SELECT *
                FROM students
                WHERE department=?
                AND year=?
                ORDER BY roll
                `,

                [
                    teacher.department,
                    teacher.year
                ],

                (err, students) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    res.json({
                        success: true,
                        department: teacher.department,
                        year: teacher.year,
                        students
                    });

                }

            );

        }

    );

});


// ==========================================
// ONE TIME SUBJECT UPDATE
// ==========================================

router.get("/fix-subjects", (req, res) => {

    db.serialize(() => {

        db.run(`
            UPDATE teachers
            SET subject='DBMS',
                year='III'
            WHERE teacherId='T001'
        `);

        db.run(`
            UPDATE teachers
            SET subject='Computer Networks',
                year='II'
            WHERE teacherId='T002'
        `);

        db.run(`
            UPDATE teachers
            SET subject='Operating Systems',
                year='III'
            WHERE teacherId='T003'
        `);

        db.run(`
            UPDATE teachers
            SET subject='Thermodynamics',
                year='III'
            WHERE teacherId='T004'
        `);

        db.run(`
            UPDATE teachers
            SET subject='Structural Engineering',
                year='III'
            WHERE teacherId='T005'
        `);

    });

    res.json({

        success: true,
        message: "Teachers updated successfully"

    });

});


// ==========================================
// EXPORT
// ==========================================

module.exports = router;