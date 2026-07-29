const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Database Connection Handshake
require("./models/database");

// Routing Modules
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance");
const resultRoutes = require("./routes/results");
const adminRoutes = require("./routes/admin");

const app = express();

// Global Network Resource Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Frontend Static Web Assets Directly via Node Cluster System
app.use(express.static(path.join(__dirname, "../frontend")));

// API Endpoints Routing Mapping
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/results", resultRoutes);
app.use("/admin", adminRoutes);

// ============================================================================
// CHANGED SECTION: SAFE PRODUCTION PATH FALLBACK ENGINE
// ============================================================================
app.use((req, res) => {
    // 1. Try to serve dashboard.html from the primary directory
    let primaryPath = path.join(__dirname, "../frontend/html/dashboard.html");
    
    // 2. Secondary fallback case to check if file sits directly under frontend/
    let secondaryPath = path.join(__dirname, "../frontend/dashboard.html");

    res.sendFile(primaryPath, (err) => {
        if (err) {
            res.sendFile(secondaryPath, (innerErr) => {
                if (innerErr) {
                    res.status(404).send("<h2>System Routing Error: File dashboard.html not found in repository directories. Check your folder nesting paths!</h2>");
                }
            });
        }
    });
});

// Production Dynamic Viewport Environment Port Hook
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("==========================================");
    console.log("🚀 SMS PRODUCTION ENGINE OPERATIONAL");
    console.log(`Cluster Port: ${PORT}`);
    console.log("==========================================");
});
