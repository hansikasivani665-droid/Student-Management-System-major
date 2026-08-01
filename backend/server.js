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
// Debug Middleware
// ===============================
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ===============================
// Static Files
// ===============================
app.use(express.static(path.join(__dirname, "..")));
app.use("/html", express.static(path.join(__dirname, "../html")));
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/js", express.static(path.join(__dirname, "../js")));
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// ===============================
// Home Page
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
// Health Check
// ===============================
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running"
    });
});

// ===============================
// 404 Handler
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
    console.error("Server Error:", err);

    res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("======================================");
    console.log("🚀 Student Management System");
    console.log("======================================");
    console.log(`Server Running on Port ${PORT}`);
    console.log("======================================");
});