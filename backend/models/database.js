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
        recursive: true
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

            console.log(
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


console.log(
    "📦 Creating Database Tables..."
);




// ===============================
// STUDENTS TABLE
// ===============================


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





// ===============================
// ATTENDANCE TABLE
// ===============================


db.run(`

CREATE TABLE IF NOT EXISTS attendance(

id INTEGER PRIMARY KEY AUTOINCREMENT,

roll TEXT NOT NULL,

subject TEXT,

teacherId TEXT,

date TEXT NOT NULL,

status TEXT NOT NULL,

UNIQUE(roll,subject,date,teacherId)

)

`);





// ===============================
// RESULTS TABLE
// ===============================


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





// ===============================
// TEACHERS TABLE
// ===============================


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





// ===============================
// USERS TABLE
// ===============================


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
// DATABASE MIGRATIONS
// ======================================

db.serialize(()=>{

// ===============================
// RESULTS MIGRATION
// ===============================


db.all(
`
PRAGMA table_info(results)
`,
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
"✅ Subject column added to results"
);

}

});


}



});


// ===============================
// ATTENDANCE MIGRATION
// ===============================


db.all(
`
PRAGMA table_info(attendance)
`,
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
`
ALTER TABLE attendance
ADD COLUMN subject TEXT
`,
(err)=>{

if(err){

console.log(
err.message
);

}

else{

console.log(
"✅ Subject column added to attendance"
);

}

});


}




if(!teacherExists){


db.run(
`
ALTER TABLE attendance
ADD COLUMN teacherId TEXT
`,
(err)=>{

if(err){

console.log(
err.message
);

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


                [
                    "Rahul Kumar",
                    "CSE001",
                    "CSE",
                    "I",
                    "rahul@gmail.com",
                    "9876543201",
                    "1234"
                ],


                [
                    "Anjali Sharma",
                    "CSE002",
                    "CSE",
                    "I",
                    "anjali@gmail.com",
                    "9876543202",
                    "1234"
                ],


                [
                    "Priya Reddy",
                    "CSE003",
                    "CSE",
                    "I",
                    "priya@gmail.com",
                    "9876543203",
                    "1234"
                ],


                [
                    "Sai Teja",
                    "CSE004",
                    "CSE",
                    "II",
                    "sai@gmail.com",
                    "9876543204",
                    "1234"
                ],


                [
                    "Kiran Kumar",
                    "CSE005",
                    "CSE",
                    "II",
                    "kiran@gmail.com",
                    "9876543205",
                    "1234"
                ],


                [
                    "Harsha Vardhan",
                    "CSE006",
                    "CSE",
                    "II",
                    "harsha@gmail.com",
                    "9876543206",
                    "1234"
                ],


                [
                    "Nikhil Reddy",
                    "CSE007",
                    "CSE",
                    "III",
                    "nikhil@gmail.com",
                    "9876543207",
                    "1234"
                ],


                [
                    "Keerthana",
                    "CSE008",
                    "CSE",
                    "III",
                    "keerthana@gmail.com",
                    "9876543208",
                    "1234"
                ],


                [
                    "Bhavana",
                    "CSE009",
                    "CSE",
                    "IV",
                    "bhavana@gmail.com",
                    "9876543209",
                    "1234"
                ],


                [
                    "Sandeep",
                    "CSE010",
                    "CSE",
                    "IV",
                    "sandeep@gmail.com",
                    "9876543210",
                    "1234"
                ]

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
                    "Computer Networks",
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
                    "Operating Systems",
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
                    "Java Programming",
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
                    "Machine Learning",
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
                    "Present"
                ],


                [
                    "CSE004",
                    "DBMS",
                    "T001",
                    today,
                    "Present"
                ],


                [
                    "CSE005",
                    "DBMS",
                    "T001",
                    today,
                    "Absent"
                ],


                [
                    "CSE006",
                    "DBMS",
                    "T001",
                    today,
                    "Present"
                ],


                [
                    "CSE007",
                    "DBMS",
                    "T001",
                    today,
                    "Present"
                ],


                [
                    "CSE008",
                    "DBMS",
                    "T001",
                    today,
                    "Absent"
                ],


                [
                    "CSE009",
                    "DBMS",
                    "T001",
                    today,
                    "Present"
                ],


                [
                    "CSE010",
                    "DBMS",
                    "T001",
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


                [
                    "CSE001",
                    "Rahul Kumar",
                    "CSE",
                    "DBMS",
                    92,
                    "A+",
                    "Pass"
                ],


                [
                    "CSE002",
                    "Anjali Sharma",
                    "CSE",
                    "DBMS",
                    88,
                    "A",
                    "Pass"
                ],


                [
                    "CSE003",
                    "Priya Reddy",
                    "CSE",
                    "DBMS",
                    81,
                    "A",
                    "Pass"
                ],


                [
                    "CSE004",
                    "Sai Teja",
                    "CSE",
                    "DBMS",
                    76,
                    "B+",
                    "Pass"
                ],


                [
                    "CSE005",
                    "Kiran Kumar",
                    "CSE",
                    "DBMS",
                    69,
                    "B",
                    "Pass"
                ],


                [
                    "CSE006",
                    "Harsha Vardhan",
                    "CSE",
                    "DBMS",
                    58,
                    "C",
                    "Pass"
                ],


                [
                    "CSE007",
                    "Nikhil Reddy",
                    "CSE",
                    "DBMS",
                    45,
                    "D",
                    "Fail"
                ],


                [
                    "CSE008",
                    "Keerthana",
                    "CSE",
                    "DBMS",
                    84,
                    "A",
                    "Pass"
                ],


                [
                    "CSE009",
                    "Bhavana",
                    "CSE",
                    "DBMS",
                    91,
                    "A+",
                    "Pass"
                ],


                [
                    "CSE010",
                    "Sandeep",
                    "CSE",
                    "DBMS",
                    73,
                    "B+",
                    "Pass"
                ]


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