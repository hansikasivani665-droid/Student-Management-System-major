const express = require("express");
const cors = require("cors");
require("dotenv").config();


// Database Connection
require("./models/database");


// Routes
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance");
const resultRoutes = require("./routes/results");
const adminRoutes = require("./routes/admin");



const app = express();


// Middleware

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));




// Test API

app.get("/",(req,res)=>{

    res.json({

        success:true,
        message:"🎓 Student Management System Backend Running"

    });

});




// API Routes

app.use("/auth",authRoutes);

app.use("/students",studentRoutes);

app.use("/attendance",attendanceRoutes);

app.use("/results",resultRoutes);

app.use("/admin",adminRoutes);





// Server Port

const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{


    console.log("--------------------------------");

    console.log("🚀 Student Management System");

    console.log("Server Running : http://localhost:"+PORT);

    console.log("--------------------------------");


});