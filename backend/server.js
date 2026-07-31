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
const teacherRoutes = require("./routes/teachers");   // <-- ADDED

const app = express();

// ===============================
// Middlewares
// ===============================
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ===============================
// Static Files
// ===============================
app.use("/html", express.static(path.join(__dirname, "../html")));
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/js", express.static(path.join(__dirname, "../js")));
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// ===============================
// API Routes
// ===============================
app.use("/auth", authRoutes);

app.use("/students", studentRoutes);

app.use("/attendance", attendanceRoutes);

app.use("/results", resultRoutes);

app.use("/admin", adminRoutes);

app.use("/dashboard", dashboardRoutes);

app.use("/teachers", teacherRoutes);      // <-- ADDED

// ===============================
// Health Check
// ===============================
app.get("/", (req, res) => {

    res.json({

        success: true,

        application: "Student Management System",

        version: "2.0",

        database: "SQLite",

        status: "Running"

    });

});

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
    console.log("Server Running");
    console.log("Port :", PORT);
    console.log("Environment :", process.env.NODE_ENV || "development");
    console.log("======================================");

});