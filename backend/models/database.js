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
        recursive: true
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
// ======================================


db.run(`

CREATE TABLE IF NOT EXISTS attendance(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    roll TEXT NOT NULL,

    subject TEXT,

    teacherId TEXT,

    date TEXT NOT NULL,

    status TEXT NOT NULL,

    UNIQUE(
        roll,
        subject,
        date,
        teacherId
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

    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP

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


// RESULTS SUBJECT MIGRATION

db.all(

`PRAGMA table_info(results)`,

(err,columns)=>{


if(err)
return;



const subjectExists =
columns.some(
column=>column.name==="subject"
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
"Results migration:",
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



}

);






// ATTENDANCE MIGRATION


db.all(

`PRAGMA table_info(attendance)`,

(err,columns)=>{


if(err)
return;



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
ALTER TABLE attendance
ADD COLUMN subject TEXT
`

);


}





if(!teacherExists){


db.run(

`
ALTER TABLE attendance
ADD COLUMN teacherId TEXT
`

);


}



}

);



});

 
// ======================================
// INSERT DEFAULT STUDENTS
// ======================================


db.get(

"SELECT COUNT(*) AS count FROM students",

(err,row)=>{


if(err){

console.log(err);
return;

}



if(row.count === 0){


console.log(
"📥 Adding Default Students..."
);



const students = [


// CSE

["Rahul Kumar","CSE001","CSE","III","rahul@gmail.com","9876543201","1234"],
["Anjali Sharma","CSE002","CSE","III","anjali@gmail.com","9876543202","1234"],
["Priya Reddy","CSE003","CSE","III","priya@gmail.com","9876543203","1234"],
["Sai Teja","CSE004","CSE","III","sai@gmail.com","9876543204","1234"],
["Kiran Kumar","CSE005","CSE","III","kiran@gmail.com","9876543205","1234"],
["Harsha Vardhan","CSE006","CSE","III","harsha@gmail.com","9876543206","1234"],
["Nikhil Reddy","CSE007","CSE","III","nikhil@gmail.com","9876543207","1234"],
["Keerthana","CSE008","CSE","III","keerthana@gmail.com","9876543208","1234"],
["Bhavana","CSE009","CSE","III","bhavana@gmail.com","9876543209","1234"],
["Sandeep","CSE010","CSE","III","sandeep@gmail.com","9876543210","1234"],


// ECE

["Rohit","ECE001","ECE","III","rohit.ece@gmail.com","9876500001","1234"],
["Divya","ECE002","ECE","III","divya.ece@gmail.com","9876500002","1234"],
["Karthik","ECE003","ECE","III","karthik.ece@gmail.com","9876500003","1234"],
["Meghana","ECE004","ECE","III","meghana.ece@gmail.com","9876500004","1234"],
["Ajay","ECE005","ECE","III","ajay.ece@gmail.com","9876500005","1234"],
["Naveen","ECE006","ECE","III","naveen.ece@gmail.com","9876500006","1234"],
["Pooja","ECE007","ECE","III","pooja.ece@gmail.com","9876500007","1234"],
["Vamsi","ECE008","ECE","III","vamsi.ece@gmail.com","9876500008","1234"],
["Sneha","ECE009","ECE","III","sneha.ece@gmail.com","9876500009","1234"],
["Akhil","ECE010","ECE","III","akhil.ece@gmail.com","9876500010","1234"],


// EEE

["Rakesh","EEE001","EEE","III","rakesh.eee@gmail.com","9876510001","1234"],
["Swathi","EEE002","EEE","III","swathi.eee@gmail.com","9876510002","1234"],
["Vinay","EEE003","EEE","III","vinay.eee@gmail.com","9876510003","1234"],
["Lavanya","EEE004","EEE","III","lavanya.eee@gmail.com","9876510004","1234"],
["Sai Krishna","EEE005","EEE","III","saikrishna.eee@gmail.com","9876510005","1234"],
["Deepthi","EEE006","EEE","III","deepthi.eee@gmail.com","9876510006","1234"],
["Mahesh","EEE007","EEE","III","mahesh.eee@gmail.com","9876510007","1234"],
["Sravani","EEE008","EEE","III","sravani.eee@gmail.com","9876510008","1234"],
["Tarun","EEE009","EEE","III","tarun.eee@gmail.com","9876510009","1234"],
["Pavan","EEE010","EEE","III","pavan.eee@gmail.com","9876510010","1234"],


// Civil

["Ravi","CIV001","Civil","III","ravi.civil@gmail.com","9876520001","1234"],
["Sowmya","CIV002","Civil","III","sowmya.civil@gmail.com","9876520002","1234"],
["Manoj","CIV003","Civil","III","manoj.civil@gmail.com","9876520003","1234"],
["Kavya","CIV004","Civil","III","kavya.civil@gmail.com","9876520004","1234"],
["Arun","CIV005","Civil","III","arun.civil@gmail.com","9876520005","1234"],
["Divya","CIV006","Civil","III","divya.civil2@gmail.com","9876520006","1234"],
["Ramesh","CIV007","Civil","III","ramesh.civil@gmail.com","9876520007","1234"],
["Bhavya","CIV008","Civil","III","bhavya.civil@gmail.com","9876520008","1234"],
["Ganesh","CIV009","Civil","III","ganesh.civil@gmail.com","9876520009","1234"],
["Pavani","CIV010","Civil","III","pavani.civil@gmail.com","9876520010","1234"],


// Mechanical

["Pradeep","MEC001","Mechanical","III","pradeep.mech@gmail.com","9876530001","1234"],
["Suresh","MEC002","Mechanical","III","suresh.mech@gmail.com","9876530002","1234"],
["Vijay","MEC003","Mechanical","III","vijay.mech@gmail.com","9876530003","1234"],
["Rohini","MEC004","Mechanical","III","rohini.mech@gmail.com","9876530004","1234"],
["Kishore","MEC005","Mechanical","III","kishore.mech@gmail.com","9876530005","1234"],
["Harini","MEC006","Mechanical","III","harini.mech@gmail.com","9876530006","1234"],
["Naresh","MEC007","Mechanical","III","naresh.mech@gmail.com","9876530007","1234"],
["Snehal","MEC008","Mechanical","III","snehal.mech@gmail.com","9876530008","1234"],
["Lokesh","MEC009","Mechanical","III","lokesh.mech@gmail.com","9876530009","1234"],
["Aishwarya","MEC010","Mechanical","III","aishwarya.mech@gmail.com","9876530010","1234"]

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

student

);


});


console.log(
"✅ 50 Students Added"
);



}



});





// ======================================
// INSERT DEFAULT TEACHERS
// ======================================


db.get(

"SELECT COUNT(*) AS count FROM teachers",

(err,row)=>{


if(err)
return;



if(row.count===0){


console.log(
"📥 Adding Teachers..."
);



const teachers=[


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

teacher

);


});



console.log(
"✅ 5 Teachers Added"
);



}


});





// ======================================
// EXPORT DATABASE
// ======================================


module.exports = db;