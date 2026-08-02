// =====================================================
// STUDENT MANAGEMENT SYSTEM BACKEND SERVER
// =====================================================


const express = require("express");
const cors = require("cors");
const path = require("path");


// Routes

const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance");
const resultsRoutes = require("./routes/results");
const dashboardRoutes = require("./routes/dashboard");
const authRoutes = require("./routes/auth");



// Database

require("./models/database");



const app = express();




// =====================================================
// CORS CONFIGURATION
// =====================================================

app.use(cors({
    origin: "https://student-management-system-major-1.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// =====================================================
// MIDDLEWARE
// =====================================================


app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));





// =====================================================
// STATIC FILES
// =====================================================


app.use(
express.static(
path.join(__dirname,"../")
)
);





// =====================================================
// API ROUTES
// =====================================================


app.use("/students",studentRoutes);

app.use("/attendance",attendanceRoutes);

app.use("/results",resultsRoutes);

app.use("/dashboard",dashboardRoutes);

app.use("/auth",authRoutes);





// =====================================================
// HOME TEST
// =====================================================


app.get("/",(req,res)=>{

    res.send(
        "Student Management System Backend Running"
    );

});





// =====================================================
// SERVER START
// =====================================================


const PORT =
process.env.PORT || 5000;



app.listen(PORT,()=>{

console.log(
`🚀 Server Running on Port ${PORT}`
);


});