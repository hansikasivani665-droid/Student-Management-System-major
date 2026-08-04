const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");


// ======================================
// DATABASE PATH (RENDER SAFE)
// ======================================

const dbDir = path.join(__dirname, "../database");
const dbPath = path.join(dbDir, "student.db");


if (!fs.existsSync(dbDir)) {

    console.log("📁 Creating database directory...");

    fs.mkdirSync(dbDir, {
        recursive:true
    });

}


console.log(
    "Initializing SQLite Database:",
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
                "❌ SQLite Connection Failed"
            );

            console.log(err.message);

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


console.log(
    "📦 Creating Database Tables..."
);



// ======================================
// STUDENTS TABLE
// YEAR REQUIRED
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
// YEAR REMOVED
// ======================================


db.run(`

CREATE TABLE IF NOT EXISTS teachers(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    teacherId TEXT,

    name TEXT,

    department TEXT,

    subject TEXT,

    email TEXT,

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
// RESULTS MIGRATION
// ======================================


db.all(

`PRAGMA table_info(results)`,

(err,columns)=>{


if(err){

    console.log(
        "❌ Results migration error",
        err.message
    );

    return;

}



const subjectExists =
columns.some(
    column=>column.name==="subject"
);



if(!subjectExists){


db.run(

`ALTER TABLE results ADD COLUMN subject TEXT`,

(err)=>{

if(err){

console.log(
    "Results migration:",
    err.message
);

}

else{

console.log(
    "✅ Subject column added to results"
);

}


}

);


}



}

);






// ======================================
// ATTENDANCE MIGRATION
// ======================================


db.all(

`PRAGMA table_info(attendance)`,

(err,columns)=>{


if(err){

console.log(
    "❌ Attendance migration error",
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

`ALTER TABLE attendance ADD COLUMN subject TEXT`,

(err)=>{

if(err){

console.log(err.message);

}

else{

console.log(
"✅ Subject column added to attendance"
);

}

}

);


}






if(!teacherExists){


db.run(

`ALTER TABLE attendance ADD COLUMN teacherId TEXT`,

(err)=>{


if(err){

console.log(err.message);

}

else{

console.log(
"✅ TeacherId column added to attendance"
);

}


}

);


}




}

);



});

// ======================================
// INSERT SAMPLE STUDENTS
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
                "📥 Adding Sample Students..."
            );


           const students = [

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

student,


(err)=>{

if(err){

console.log(
"Student Insert Error:",
err.message
);

}


}


);



            });



            console.log(
                "✅ Sample Students Inserted"
            );


        }



    }

);







// ======================================
// INSERT SAMPLE TEACHERS
// YEAR REMOVED
// ======================================


db.get(

"SELECT COUNT(*) AS count FROM teachers",

(err,row)=>{


if(err){

    console.log(err);
    return;

}




if(row.count === 0){



console.log(
    "📥 Adding Sample Teachers..."
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
"Teacher Insert Error:",
err.message
);

}



}


);



});





console.log(
"✅ Sample Teachers Inserted"
);



}




}



);

// ======================================
// INSERT SAMPLE ATTENDANCE
// ======================================


db.get(

    "SELECT COUNT(*) AS count FROM attendance",

    (err,row)=>{


        if(err){

            console.log(err);
            return;

        }



        if(row.count === 0){


            console.log(
                "📥 Adding Sample Attendance..."
            );



            const today =
                new Date()
                .toISOString()
                .split("T")[0];



            const attendance = [



                [
                    "CSE001",
                    "DBMS",
                    "T001",
                    today,
                    "Present"
                ],


                [
                    "CSE002",
                    "DBMS",
                    "T001",
                    today,
                    "Present"
                ],


                [
                    "CSE003",
                    "DBMS",
                    "T001",
                    today,
                    "Absent"
                ],


                [
                    "CSE004",
                    "DBMS",
                    "T001",
                    today,
                    "Present"
                ],


                [
                    "ECE001",
                    "Digital Electronics",
                    "T002",
                    today,
                    "Present"
                ],


                [
                    "EEE001",
                    "Electrical Machines",
                    "T003",
                    today,
                    "Present"
                ],


                [
                    "CIV001",
                    "Structural Engineering",
                    "T005",
                    today,
                    "Absent"
                ],


                [
                    "MEC001",
                    "Thermodynamics",
                    "T004",
                    today,
                    "Present"
                ]


            ];





            attendance.forEach(record=>{


                db.run(

`

INSERT INTO attendance

(

roll,
subject,
teacherId,
date,
status

)

VALUES(?,?,?,?,?)

`,

record,


(err)=>{


if(err){

console.log(
"Attendance Insert Error:",
err.message
);

}


}


);



            });





            console.log(
                "✅ Sample Attendance Inserted"
            );


        }



    }

);








// ======================================
// INSERT SAMPLE RESULTS
// ======================================


db.get(

"SELECT COUNT(*) AS count FROM results",

(err,row)=>{


if(err){

    console.log(err);
    return;

}



if(row.count === 0){



console.log(
    "📥 Adding Sample Results..."
);




const results = [

    ('CSE001','Rahul Kumar','CSE','DBMS',85,'A','Pass'),
('CSE002','Anjali Sharma','CSE','DBMS',92,'A+','Pass'),
('CSE003','Priya Reddy','CSE','DBMS',78,'B+','Pass'),
('CSE004','Sai Teja','CSE','DBMS',88,'A','Pass'),
('CSE005','Kiran Kumar','CSE','DBMS',91,'A+','Pass'),
('CSE006','Harsha Vardhan','CSE','DBMS',74,'B','Pass'),
('CSE007','Nikhil Reddy','CSE','DBMS',95,'A+','Pass'),
('CSE008','Keerthana','CSE','DBMS',82,'A','Pass'),
('CSE009','Bhavana','CSE','DBMS',89,'A','Pass'),
('CSE010','Sandeep','CSE','DBMS',90,'A+','Pass'),

('ECE001','Rohit','ECE','Digital Electronics',86,'A','Pass'),
('ECE002','Divya','ECE','Digital Electronics',80,'A','Pass'),
('ECE003','Karthik','ECE','Digital Electronics',77,'B+','Pass'),
('ECE004','Meghana','ECE','Digital Electronics',93,'A+','Pass'),
('ECE005','Ajay','ECE','Digital Electronics',88,'A','Pass'),
('ECE006','Naveen','ECE','Digital Electronics',84,'A','Pass'),
('ECE007','Pooja','ECE','Digital Electronics',91,'A+','Pass'),
('ECE008','Vamsi','ECE','Digital Electronics',76,'B+','Pass'),
('ECE009','Sneha','ECE','Digital Electronics',83,'A','Pass'),
('ECE010','Akhil','ECE','Digital Electronics',89,'A','Pass'),

('EEE001','Rakesh','EEE','Electrical Machines',81,'A','Pass'),
('EEE002','Swathi','EEE','Electrical Machines',75,'B+','Pass'),
('EEE003','Vinay','EEE','Electrical Machines',87,'A','Pass'),
('EEE004','Lavanya','EEE','Electrical Machines',90,'A+','Pass'),
('EEE005','Sai Krishna','EEE','Electrical Machines',86,'A','Pass'),
('EEE006','Deepthi','EEE','Electrical Machines',79,'B+','Pass'),
('EEE007','Mahesh','EEE','Electrical Machines',84,'A','Pass'),
('EEE008','Sravani','EEE','Electrical Machines',92,'A+','Pass'),
('EEE009','Tarun','EEE','Electrical Machines',88,'A','Pass'),
('EEE010','Pavan','EEE','Electrical Machines',80,'A','Pass'),

('CIV001','Ravi','Civil','Surveying',82,'A','Pass'),
('CIV002','Sowmya','Civil','Surveying',76,'B+','Pass'),
('CIV003','Manoj','Civil','Surveying',89,'A','Pass'),
('CIV004','Kavya','Civil','Surveying',91,'A+','Pass'),
('CIV005','Arun','Civil','Surveying',83,'A','Pass'),
('CIV006','Divya','Civil','Surveying',87,'A','Pass'),
('CIV007','Ramesh','Civil','Surveying',78,'B+','Pass'),
('CIV008','Bhavya','Civil','Surveying',85,'A','Pass'),
('CIV009','Ganesh','Civil','Surveying',90,'A+','Pass'),
('CIV010','Pavani','Civil','Surveying',84,'A','Pass'),

('MEC001','Pradeep','Mechanical','Thermodynamics',88,'A','Pass'),
('MEC002','Suresh','Mechanical','Thermodynamics',79,'B+','Pass'),
('MEC003','Vijay','Mechanical','Thermodynamics',81,'A','Pass'),
('MEC004','Rohini','Mechanical','Thermodynamics',86,'A','Pass'),
('MEC005','Kishore','Mechanical','Thermodynamics',92,'A+','Pass'),
('MEC006','Harini','Mechanical','Thermodynamics',84,'A','Pass'),
('MEC007','Naresh','Mechanical','Thermodynamics',77,'B+','Pass'),
('MEC008','Snehal','Mechanical','Thermodynamics',89,'A','Pass'),
('MEC009','Lokesh','Mechanical','Thermodynamics',90,'A+','Pass'),
('MEC010','Aishwarya','Mechanical','Thermodynamics',85,'A','Pass')
];

results.forEach(result=>{



db.run(

`

INSERT INTO results

(

roll,
name,
department,
subject,
marks,
grade,
status

)

VALUES(?,?,?,?,?,?,?)

`,

result,


(err)=>{


if(err){

console.log(
"Result Insert Error:",
err.message
);

}



}


);



});





console.log(
"✅ Sample Results Inserted"
);



}



}



);






// ======================================
// DATABASE EXPORT
// ======================================


module.exports = db;