const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");


// ======================================
// DATABASE PATH (RENDER SAFE)
// ======================================

const dbDir = path.join(__dirname, "../database");
const dbPath = path.join(dbDir, "student.db");


if (!fs.existsSync(dbDir)) {

    fs.mkdirSync(dbDir, {
        recursive:true
    });

}


console.log(
    "Initializing Database:",
    dbPath
);



// ======================================
// DATABASE CONNECTION
// ======================================

const db = new sqlite3.Database(

    dbPath,

    (err)=>{

        if(err){

            console.log(
                "❌ SQLite Connection Failed:",
                err.message
            );

        }
        else{

            console.log(
                "✅ SQLite Connected Successfully"
            );

        }

    }

);




// ======================================
// CREATE TABLES
// ======================================


db.serialize(()=>{



// ======================================
// STUDENTS TABLE
// ======================================


db.run(`

CREATE TABLE IF NOT EXISTS students(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    roll TEXT UNIQUE NOT NULL,

    department TEXT NOT NULL,

    year TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,

    phone TEXT NOT NULL,

    password TEXT,

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP

)

`);





// ======================================
// ATTENDANCE TABLE
// ADMIN CAN OVERWRITE TEACHER
// ======================================


db.run(`

CREATE TABLE IF NOT EXISTS attendance(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    roll TEXT NOT NULL,

    subject TEXT,

    teacherId TEXT,

    date TEXT NOT NULL,

    status TEXT NOT NULL,

    markedBy TEXT DEFAULT 'Teacher',

    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(
        roll,
        subject,
        date
    )

)

`);





// ======================================
// RESULTS TABLE
// ======================================


db.run(`

CREATE TABLE IF NOT EXISTS results(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    roll TEXT NOT NULL,

    teacherId TEXT,

    name TEXT,

    department TEXT,

    subject TEXT,

    marks INTEGER,

    grade TEXT,

    status TEXT,

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(
        roll,
        subject
    )

)

`);





// ======================================
// TEACHERS TABLE
// ======================================


db.run(`

CREATE TABLE IF NOT EXISTS teachers(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    teacherId TEXT UNIQUE,

    name TEXT,

    department TEXT,

    subject TEXT,

    email TEXT UNIQUE,

    phone TEXT,

    qualification TEXT,

    experience TEXT,

    password TEXT,

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP

)

`);






// ======================================
// USERS TABLE
// ======================================


db.run(`

CREATE TABLE IF NOT EXISTS users(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    email TEXT UNIQUE NOT NULL,

    password TEXT NOT NULL,

    role TEXT NOT NULL,

    studentRoll TEXT,

    teacherId TEXT,

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP

)

`);




console.log(
    "✅ Database Tables Ready"
);



});


// ======================================
// MIGRATIONS
// ======================================


db.serialize(()=>{



// ======================================
// RESULTS TABLE MIGRATION
// ======================================


db.all(

`PRAGMA table_info(results)`,

(err,columns)=>{


if(err){

    console.log(
        "Results migration error:",
        err.message
    );

    return;

}



const subjectExists =
columns.some(
    column=>column.name==="subject"
);



const teacherExists =
columns.some(
    column=>column.name==="teacherId"
);




if(!subjectExists){


db.run(

`
ALTER TABLE results
ADD COLUMN subject TEXT
`,

(err)=>{

if(err){

console.log(
"Results subject migration:",
err.message
);

}
else{

console.log(
"✅ Results subject column added"
);

}

}

);


}




if(!teacherExists){


db.run(

`
ALTER TABLE results
ADD COLUMN teacherId TEXT
`,

(err)=>{

if(err){

console.log(
"Results teacherId migration:",
err.message
);

}
else{

console.log(
"✅ Results teacherId column added"
);

}

}

);


}



});





// ======================================
// ATTENDANCE COLUMN MIGRATION
// ======================================


db.all(

`PRAGMA table_info(attendance)`,

(err,columns)=>{


if(err){

console.log(
"Attendance migration error:",
err.message
);

return;

}




const markedByExists =
columns.some(
    column=>column.name==="markedBy"
);



const updatedAtExists =
columns.some(
    column=>column.name==="updatedAt"
);






if(!markedByExists){


db.run(

`
ALTER TABLE attendance
ADD COLUMN markedBy TEXT DEFAULT 'Teacher'
`,

(err)=>{

if(err){

console.log(
"markedBy migration:",
err.message
);

}
else{

console.log(
"✅ markedBy column added"
);

}

}

);


}





if(!updatedAtExists){


db.run(

`
ALTER TABLE attendance
ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
`,

(err)=>{


if(err){

console.log(
"updatedAt migration:",
err.message
);

}
else{

console.log(
"✅ updatedAt column added"
);

}


}

);


}





});




});


 
// ======================================
// INSERT DEFAULT STUDENTS
// ======================================


db.get(

"SELECT COUNT(*) AS count FROM students",

(err,row)=>{


if(err){

    console.log(
        "Student count error:",
        err.message
    );

    return;

}




if(row.count === 0){


console.log(
    "📥 Adding Default Students..."
);





const students = [


// =====================
// CSE
// =====================


[
"Rahul Kumar",
"CSE001",
"CSE",
"III",
"rahul@gmail.com",
"9876543201",
"1234"
],

[
"Anjali Sharma",
"CSE002",
"CSE",
"III",
"anjali@gmail.com",
"9876543202",
"1234"
],

[
"Priya Reddy",
"CSE003",
"CSE",
"III",
"priya@gmail.com",
"9876543203",
"1234"
],

[
"Sai Teja",
"CSE004",
"CSE",
"III",
"sai@gmail.com",
"9876543204",
"1234"
],

[
"Kiran Kumar",
"CSE005",
"CSE",
"III",
"kiran@gmail.com",
"9876543205",
"1234"
],



// =====================
// ECE
// =====================


[
"Rohit",
"ECE001",
"ECE",
"III",
"rohit.ece@gmail.com",
"9876500001",
"1234"
],

[
"Divya",
"ECE002",
"ECE",
"III",
"divya.ece@gmail.com",
"9876500002",
"1234"
],

[
"Karthik",
"ECE003",
"ECE",
"III",
"karthik.ece@gmail.com",
"9876500003",
"1234"
],

[
"Meghana",
"ECE004",
"ECE",
"III",
"meghana.ece@gmail.com",
"9876500004",
"1234"
],

[
"Ajay",
"ECE005",
"ECE",
"III",
"ajay.ece@gmail.com",
"9876500005",
"1234"
],



// =====================
// Add remaining students
// =====================

// Keep your existing ECE006 - MEC010
// records here from your previous file



];





students.forEach(student=>{


db.run(

`
INSERT INTO students
(
name,
roll,
department,
year,
email,
phone,
password
)

VALUES(?,?,?,?,?,?,?)

`,

student,


(err)=>{

if(err){

console.log(
"Student insert error:",
err.message
);

}


}


);



});



console.log(
"✅ Default Students Inserted"
);



}



});

// ======================================
// INSERT DEFAULT TEACHERS
// ======================================


db.get(

"SELECT COUNT(*) AS count FROM teachers",

(err,row)=>{


if(err){

    console.log(
        "Teacher count error:",
        err.message
    );

    return;

}




if(row.count === 0){


console.log(
    "📥 Adding Default Teachers..."
);





const teachers = [


[
"T001",
"Ravi Kumar",
"CSE",
"DBMS",
"ravi.kumar@gmail.com",
"9876543210",
"M.Tech",
"5 Years",
"Ravi@123"
],



[
"T002",
"Suresh Reddy",
"ECE",
"Digital Electronics",
"suresh.reddy@gmail.com",
"9876543211",
"M.Tech",
"6 Years",
"Suresh@123"
],



[
"T003",
"Priya Sharma",
"EEE",
"Electrical Machines",
"priya.sharma@gmail.com",
"9876543212",
"M.Tech",
"4 Years",
"Priya@123"
],



[
"T004",
"Anil Kumar",
"Mechanical",
"Thermodynamics",
"anil.kumar@gmail.com",
"9876543213",
"M.Tech",
"5 Years",
"Anil@123"
],



[
"T005",
"Lakshmi Devi",
"Civil",
"Structural Engineering",
"lakshmi.devi@gmail.com",
"9876543214",
"Ph.D",
"8 Years",
"Lakshmi@123"
]


];





teachers.forEach(teacher=>{


db.run(

`

INSERT INTO teachers

(
teacherId,
name,
department,
subject,
email,
phone,
qualification,
experience,
password
)

VALUES(?,?,?,?,?,?,?,?,?)

`,

teacher,


(err)=>{


if(err){

console.log(
"Teacher insert error:",
err.message
);

}


}


);


});





console.log(
"✅ Default Teachers Inserted"
);



}



});






// ======================================
// EXPORT DATABASE
// ======================================


module.exports = db;