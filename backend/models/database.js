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

// ECE
["Naveen","ECE006","ECE","III","naveen@gmail.com","9876500006","1234"],
["Pooja","ECE007","ECE","IV","pooja@gmail.com","9876500007","1234"],
["Vamsi","ECE008","ECE","IV","vamsi@gmail.com","9876500008","1234"],
["Sneha","ECE009","ECE","IV","sneha@gmail.com","9876500009","1234"],
["Akhil","ECE010","ECE","IV","akhil@gmail.com","9876500010","1234"],

// EEE
["Rakesh","EEE001","EEE","I","rakesh@gmail.com","9876510001","1234"],
["Swathi","EEE002","EEE","I","swathi@gmail.com","9876510002","1234"],
["Vinay","EEE003","EEE","II","vinay@gmail.com","9876510003","1234"],
["Lavanya","EEE004","EEE","II","lavanya@gmail.com","9876510004","1234"],
["Sai Krishna","EEE005","EEE","III","saikrishna@gmail.com","9876510005","1234"],
["Deepthi","EEE006","EEE","III","deepthi@gmail.com","9876510006","1234"],
["Mahesh","EEE007","EEE","IV","mahesh@gmail.com","9876510007","1234"],
["Sravani","EEE008","EEE","IV","sravani@gmail.com","9876510008","1234"],
["Tarun","EEE009","EEE","IV","tarun@gmail.com","9876510009","1234"],
["Pavan","EEE010","EEE","IV","pavan@gmail.com","9876510010","1234"],

// Civil
["Ravi","CIV001","Civil","I","ravi.civil@gmail.com","9876520001","1234"],
["Sowmya","CIV002","Civil","I","sowmya@gmail.com","9876520002","1234"],
["Manoj","CIV003","Civil","II","manoj@gmail.com","9876520003","1234"],
["Kavya","CIV004","Civil","II","kavya@gmail.com","9876520004","1234"],
["Arun","CIV005","Civil","III","arun@gmail.com","9876520005","1234"],
["Divya","CIV006","Civil","III","divya.civil@gmail.com","9876520006","1234"],
["Ramesh","CIV007","Civil","IV","ramesh@gmail.com","9876520007","1234"],
["Bhavya","CIV008","Civil","IV","bhavya@gmail.com","9876520008","1234"],
["Ganesh","CIV009","Civil","IV","ganesh@gmail.com","9876520009","1234"],
["Pavani","CIV010","Civil","IV","pavani@gmail.com","9876520010","1234"],

// Mechanical
["Pradeep","MEC001","Mechanical","I","pradeep@gmail.com","9876530001","1234"],
["Suresh","MEC002","Mechanical","I","suresh.mech@gmail.com","9876530002","1234"],
["Vijay","MEC003","Mechanical","II","vijay@gmail.com","9876530003","1234"],
["Rohini","MEC004","Mechanical","II","rohini@gmail.com","9876530004","1234"],
["Kishore","MEC005","Mechanical","III","kishore@gmail.com","9876530005","1234"],
["Harini","MEC006","Mechanical","III","harini@gmail.com","9876530006","1234"],
["Naresh","MEC007","Mechanical","IV","naresh@gmail.com","9876530007","1234"],
["Snehal","MEC008","Mechanical","IV","snehal@gmail.com","9876530008","1234"],
["Lokesh","MEC009","Mechanical","IV","lokesh@gmail.com","9876530009","1234"],
["Aishwarya","MEC010","Mechanical","IV","aishwarya@gmail.com","9876530010","1234"]

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