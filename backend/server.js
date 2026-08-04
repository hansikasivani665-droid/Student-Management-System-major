// =====================================================
// STUDENT MANAGEMENT SYSTEM BACKEND SERVER
// =====================================================


const express = require("express");
const cors = require("cors");
const path = require("path");


// =====================================================
// ROUTES
// =====================================================


const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance");
const resultsRoutes = require("./routes/results");
const dashboardRoutes = require("./routes/dashboard");
const authRoutes = require("./routes/auth");
const teacherRoutes = require("./routes/teachers");



// =====================================================
// DATABASE
// =====================================================


require("./models/database");



// =====================================================
// EXPRESS APP
// =====================================================


const app = express();



// =====================================================
// CORS CONFIGURATION
// =====================================================


const allowedOrigins = [

    "https://student-management-system-major-1.onrender.com",

    "http://127.0.0.1:5500",

    "http://localhost:5500",

    "http://localhost:5000",

    "http://127.0.0.1:5000"

];


app.use(cors({

    origin(origin, callback){

        if(!origin || allowedOrigins.includes(origin)){

            callback(null,true);

        }
        else{

            callback(new Error("Not allowed by CORS"));

        }

    },

    methods:[
        "GET",
        "POST",
        "PUT",
        "DELETE"
    ],

    credentials:true

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
    "/css",
    express.static(
        path.join(__dirname,"../css")
    )
);


app.use(
    "/js",
    express.static(
        path.join(__dirname,"../js")
    )
);


app.use(
    "/assets",
    express.static(
        path.join(__dirname,"../assets")
    )
);


app.use(
    "/html",
    express.static(
        path.join(__dirname,"../html")
    )
);



// =====================================================
// API ROUTES
// =====================================================


app.use(

    "/students",

    studentRoutes

);



app.use(

    "/attendance",

    attendanceRoutes

);



app.use(

    "/results",

    resultsRoutes

);



app.use(

    "/dashboard",

    dashboardRoutes

);



app.use(

    "/auth",

    authRoutes

);



app.use(

    "/teachers",

    teacherRoutes

);



// =====================================================
// HEALTH CHECK (RENDER)
// =====================================================


app.get("/health",(req,res)=>{

    res.json({

        success:true,

        status:"ok"

    });

});



// =====================================================
// HOME ROUTE
// =====================================================


app.get("/",(req,res)=>{

    res.redirect("/html/login.html");

});



// =====================================================
// 404 HANDLER
// =====================================================


app.use((req,res)=>{

    res.status(404).json({

        success:false,

        message:"API Route Not Found"

    });

});



// =====================================================
// SERVER START
// =====================================================


const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{

    console.log(
        `🚀 Server Running on Port ${PORT}`
    );

});