const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// ===============================
// Database Connection
// ===============================
require("./models/database");

// ===============================
// Import Routes
// ===============================
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance");
const resultRoutes = require("./routes/results");
const adminRoutes = require("./routes/admin");
const dashboardRoutes = require("./routes/dashboard");
const teacherRoutes = require("./routes/teachers");

const app = express();

// ===============================
// Middlewares
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Static Folder
// ===============================
app.use(express.static(path.join(__dirname, "..")));

// ===============================
// HTML
// ===============================
app.use("/html", express.static(path.join(__dirname, "../html")));

// CSS
app.use("/css", express.static(path.join(__dirname, "../css")));

// JavaScript
app.use("/js", express.static(path.join(__dirname, "../js")));

// Assets
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// ===============================
// HOME PAGE
// Opens login.html
// ===============================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../html/login.html"));
});

// ===============================
// API Routes
// ===============================
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/results", resultRoutes);
app.use("/admin", adminRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/teachers", teacherRoutes);

// ===============================
// 404
// ===============================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Route Not Found"
    });
});

// ===============================
// Error Handler
// ===============================
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

// ===============================
// Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("======================================");
    console.log("🚀 Student Management System");
    console.log("======================================");
    console.log(`Server Running on Port ${PORT}`);
    console.log("======================================");
});