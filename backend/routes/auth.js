const express = require("express");
const router = express.Router();

const db = require("../models/database");

// ====================================
// LOGIN API
// ====================================
router.post("/login", (req, res) => {

    console.log("==================================");
    console.log("LOGIN REQUEST RECEIVED");
    console.log(req.body);
    console.log("==================================");

    const { email, password, role } = req.body;

    if (!email || !password || !role) {

        console.log("Missing Login Fields");

        return res.status(400).json({
            success: false,
            message: "Email, Password and Role are required"
        });

    }

    // ==========================
    // ADMIN LOGIN
    // ==========================

    if (role === "admin") {

        console.log("Admin Login");

        const adminEmail = "admin@gmail.com";
        const adminPassword = "Admin@123";

        if (email === adminEmail && password === adminPassword) {

            console.log("Admin Login Success");

            return res.json({
                success: true,
                role: "admin",
                message: "Admin Login Successful"
            });

        }

        console.log("Admin Login Failed");

        return res.status(401).json({
            success: false,
            message: "Invalid Admin Credentials"
        });

    }

    // ==========================
    // TEACHER LOGIN
    // ==========================

    if (role === "teacher") {

        console.log("Teacher Login");

        db.get(
            "SELECT * FROM teachers WHERE email=? AND password=?",
            [email, password],
            (err, teacher) => {

                console.log("Teacher Query Finished");

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                if (!teacher) {

                    return res.status(401).json({
                        success: false,
                        message: "Invalid Teacher Email or Password"
                    });

                }

                return res.json({
                    success: true,
                    role: "teacher",
                    teacher,
                    message: "Teacher Login Successful"
                });

            }
        );

        return;

    }

    // ==========================
    // STUDENT LOGIN
    // ==========================

    if (role === "student") {

        console.log("Student Login");

        db.get(
            "SELECT * FROM students WHERE email=? AND password=?",
            [email, password],
            (err, student) => {

                console.log("Student Query Finished");

                if (err) {

                    console.log(err);

                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });

                }

                if (!student) {

                    return res.status(401).json({
                        success: false,
                        message: "Invalid Student Email or Password"
                    });

                }

                return res.json({
                    success: true,
                    role: "student",
                    student,
                    message: "Student Login Successful"
                });

            }
        );

        return;

    }

    console.log("Invalid Role");

    return res.status(400).json({
        success: false,
        message: "Invalid Role"
    });

});

module.exports = router;