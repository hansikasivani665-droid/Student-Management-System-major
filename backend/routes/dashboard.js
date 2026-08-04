// =====================================================
// DASHBOARD ROUTES - PART 1
// =====================================================

const express = require("express");
const router = express.Router();

const db = require("../models/database");



// =====================================================
// ADMIN DASHBOARD DATA
// GET /dashboard
// =====================================================

router.get("/", (req,res)=>{


// =====================================================
// TOTAL STUDENTS
// =====================================================

const studentQuery = `

SELECT

COUNT(*) AS totalStudents,

COUNT(DISTINCT department) AS totalDepartments

FROM students

`;




// =====================================================
// TOTAL TEACHERS
// =====================================================

const teacherQuery = `

SELECT

COUNT(*) AS totalTeachers

FROM teachers

`;




// =====================================================
// LATEST DATE ATTENDANCE
// UNIQUE STUDENT COUNT
// =====================================================

const attendanceQuery = `


SELECT


COUNT(
DISTINCT
CASE

WHEN status='Present'

THEN roll

END
)

AS presentStudents,



COUNT(
DISTINCT
CASE

WHEN status='Absent'

THEN roll

END
)

AS absentStudents,



COUNT(
DISTINCT roll
)

AS totalAttendance



FROM attendance



WHERE date=(

SELECT MAX(date)

FROM attendance

)


`;




// =====================================================
// RESULTS
// =====================================================


const resultQuery = `


SELECT


AVG(marks) AS averageMarks,


COUNT(*) AS resultsCount,



SUM(

CASE

WHEN marks>=40

THEN 1

ELSE 0

END

)

AS passCount



FROM results


`;




// =====================================================
// LATEST STUDENT
// =====================================================


const latestStudentQuery = `


SELECT

name

FROM students

ORDER BY id DESC

LIMIT 1


`;





// =====================================================
// EXECUTE QUERIES
// =====================================================


db.get(studentQuery,[],(err,studentData)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});

}




db.get(teacherQuery,[],(err,teacherData)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});

}





db.get(attendanceQuery,[],(err,attendanceData)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});

}





db.get(resultQuery,[],(err,resultData)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});

}





db.get(
latestStudentQuery,
[],
(err,latestStudent)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});

}





// =====================================================
// CALCULATIONS
// =====================================================


let attendancePercentage=0;


if(
attendanceData &&
attendanceData.totalAttendance>0
){


attendancePercentage =

(
attendanceData.presentStudents /

attendanceData.totalAttendance

)

*100;


}





let passPercentage=0;


if(
resultData &&
resultData.resultsCount>0
){


passPercentage =

(
resultData.passCount /

resultData.resultsCount

)

*100;


}

// =====================================================
// PART 2
// DEPARTMENT PERFORMANCE
// =====================================================


const departmentQuery = `


SELECT


s.department,



COUNT(DISTINCT s.roll)

AS totalStudents,



COUNT(DISTINCT

CASE

WHEN a.status='Present'

THEN a.roll

END

)

AS presentStudents,



COUNT(DISTINCT

CASE

WHEN a.status='Absent'

THEN a.roll

END

)

AS absentStudents,



ROUND(

AVG(r.marks),

2

)

AS averageMarks



FROM students s



LEFT JOIN attendance a


ON s.roll=a.roll


AND a.date=(

SELECT MAX(date)

FROM attendance

)



LEFT JOIN results r


ON s.roll=r.roll



GROUP BY s.department



ORDER BY s.department



`;





db.all(

departmentQuery,

[],

(err,departmentData)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});

}





const departments = departmentData.map(dep=>{


return {


department:

dep.department || "-",



totalStudents:

dep.totalStudents || 0,



presentStudents:

dep.presentStudents || 0,



absentStudents:

dep.absentStudents || 0,



averageMarks:

dep.averageMarks || 0,



attendancePercentage:0



};


});






// =====================================================
// DEPARTMENT ATTENDANCE PERCENTAGE
// =====================================================


const departmentAttendanceQuery = `


SELECT



s.department,



ROUND(



COUNT(

DISTINCT

CASE

WHEN a.status='Present'

THEN a.roll

END

)



*

100.0



/



COUNT(

DISTINCT a.roll

)



,2)



AS attendancePercentage



FROM students s



LEFT JOIN attendance a



ON s.roll=a.roll



AND a.date=(

SELECT MAX(date)

FROM attendance

)



GROUP BY s.department



`;





db.all(

departmentAttendanceQuery,

[],

(err,attendanceDepartments)=>{


if(err){

return res.status(500).json({

success:false,

message:err.message

});

}





departments.forEach(dep=>{


const attendance =

attendanceDepartments.find(item=>

item.department===dep.department

);



if(attendance){

dep.attendancePercentage =

attendance.attendancePercentage || 0;

}


});





// =====================================================
// FINAL RESPONSE
// =====================================================


res.json({


success:true,



totalStudents:

studentData.totalStudents || 0,



totalTeachers:

teacherData.totalTeachers || 0,



totalDepartments:

studentData.totalDepartments || 0,



presentStudents:

attendanceData.presentStudents || 0,



absentStudents:

attendanceData.absentStudents || 0,



attendancePercentage:

Number(

attendancePercentage.toFixed(2)

),



averageMarks:

Number(

resultData.averageMarks || 0

),



resultsCount:

resultData.resultsCount || 0,



passPercentage:

Number(

passPercentage.toFixed(2)

),



latestStudent:

latestStudent

?

latestStudent.name

:

"-",



departments:departments



});



});



});





});



});



});



});



});

// =====================================================
// PART 3
// DEPARTMENT DETAILS API
// GET /dashboard/department
// =====================================================


router.get("/department",(req,res)=>{


const query = `


SELECT


s.department,



COUNT(DISTINCT s.roll)

AS totalStudents,



COUNT(DISTINCT

CASE

WHEN a.status='Present'

THEN a.roll

END

)

AS presentStudents,



COUNT(DISTINCT

CASE

WHEN a.status='Absent'

THEN a.roll

END

)

AS absentStudents,



ROUND(

AVG(r.marks),

2

)

AS averageMarks



FROM students s



LEFT JOIN attendance a


ON s.roll=a.roll


AND a.date=(

SELECT MAX(date)

FROM attendance

)



LEFT JOIN results r


ON s.roll=r.roll



GROUP BY s.department



ORDER BY s.department



`;





db.all(

query,

[],

(err,rows)=>{


if(err){


return res.status(500).json({


success:false,


message:err.message


});


}





const departments = rows.map(row=>{


return {


department:

row.department || "-",



totalStudents:

row.totalStudents || 0,



presentStudents:

row.presentStudents || 0,



absentStudents:

row.absentStudents || 0,



averageMarks:

row.averageMarks || 0



};


});





res.json({


success:true,


departments:departments



});



});



});





// =====================================================
// EXPORT ROUTER
// =====================================================


module.exports = router;