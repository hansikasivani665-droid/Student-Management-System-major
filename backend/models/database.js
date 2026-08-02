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

    (err) => {

        if (err) {

            console.log("❌ SQLite Connection Failed");
            console.log(err.message);

        }

        else {

            console.log("✅ SQLite Connected Successfully");

        }

    }

);

// ======================================
// CREATE TABLES
// ======================================

db.serialize(() => {

    console.log("📦 Creating Database Tables...");

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

            UNIQUE(roll, subject, date, teacherId)

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

    console.log("✅ Database Tables Ready");

});

// ======================================
// DATABASE MIGRATIONS
// ======================================

db.serialize(() => {

    // ===============================
    // RESULTS MIGRATION
    // ===============================

    db.all(
        `PRAGMA table_info(results)`,
        (err, columns) => {

            if (err) {
                console.log("❌ Results migration error");
                console.log(err.message);
                return;
            }

            const subjectExists =
                columns.some(column => column.name === "subject");

            if (!subjectExists) {

                db.run(
                    `ALTER TABLE results ADD COLUMN subject TEXT`,
                    (err) => {

                        if (err) {
                            console.log("Results migration:", err.message);
                        } else {
                            console.log("✅ Subject column added to results");
                        }

                    }
                );

            }

        }
    );

    // ===============================
    // ATTENDANCE MIGRATION
    // ===============================

    db.all(
        `PRAGMA table_info(attendance)`,
        (err, columns) => {

            if (err) {
                console.log("❌ Attendance migration error");
                console.log(err.message);
                return;
            }

            const subjectExists =
                columns.some(column => column.name === "subject");

            const teacherExists =
                columns.some(column => column.name === "teacherId");

            if (!subjectExists) {

                db.run(
                    `ALTER TABLE attendance ADD COLUMN subject TEXT`,
                    (err) => {

                        if (err) {
                            console.log(err.message);
                        } else {
                            console.log("✅ Subject column added to attendance");
                        }

                    }
                );

            }

            if (!teacherExists) {

                db.run(
                    `ALTER TABLE attendance ADD COLUMN teacherId TEXT`,
                    (err) => {

                        if (err) {
                            console.log(err.message);
                        } else {
                            console.log("✅ TeacherId column added to attendance");
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
    (err, row) => {

        if (err) {
            console.log(err);
            return;
        }

        if (row.count === 0) {

            console.log("📥 Adding Sample Students...");

            const students = [

                // ================= CSE =================

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
                ],

                // ================= ECE =================

                [
                    "Rohit",
                    "ECE001",
                    "ECE",
                    "I",
                    "rohit.ece@gmail.com",
                    "9876500001",
                    "1234"
                ],

                [
                    "Divya",
                    "ECE002",
                    "ECE",
                    "I",
                    "divya.ece@gmail.com",
                    "9876500002",
                    "1234"
                ],

                [
                    "Karthik",
                    "ECE003",
                    "ECE",
                    "II",
                    "karthik.ece@gmail.com",
                    "9876500003",
                    "1234"
                ],

                [
                    "Meghana",
                    "ECE004",
                    "ECE",
                    "II",
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

                [
                    "Naveen",
                    "ECE006",
                    "ECE",
                    "III",
                    "naveen.ece@gmail.com",
                    "9876500006",
                    "1234"
                ],

                [
                    "Pooja",
                    "ECE007",
                    "ECE",
                    "IV",
                    "pooja.ece@gmail.com",
                    "9876500007",
                    "1234"
                ],

                [
                    "Vamsi",
                    "ECE008",
                    "ECE",
                    "IV",
                    "vamsi.ece@gmail.com",
                    "9876500008",
                    "1234"
                ],

                [
                    "Sneha",
                    "ECE009",
                    "ECE",
                    "IV",
                    "sneha.ece@gmail.com",
                    "9876500009",
                    "1234"
                ],

                [
                    "Akhil",
                    "ECE010",
                    "ECE",
                    "IV",
                    "akhil.ece@gmail.com",
                    "9876500010",
                    "1234"
                ],

                // ================= EEE =================

                [
                    "Rakesh",
                    "EEE001",
                    "EEE",
                    "I",
                    "rakesh.eee@gmail.com",
                    "9876510001",
                    "1234"
                ],

                [
                    "Swathi",
                    "EEE002",
                    "EEE",
                    "I",
                    "swathi.eee@gmail.com",
                    "9876510002",
                    "1234"
                ],

                [
                    "Vinay",
                    "EEE003",
                    "EEE",
                    "II",
                    "vinay.eee@gmail.com",
                    "9876510003",
                    "1234"
                ],

                [
                    "Lavanya",
                    "EEE004",
                    "EEE",
                    "II",
                    "lavanya.eee@gmail.com",
                    "9876510004",
                    "1234"
                ],

                [
                    "Sai Krishna",
                    "EEE005",
                    "EEE",
                    "III",
                    "saikrishna.eee@gmail.com",
                    "9876510005",
                    "1234"
                ],

                [
                    "Deepthi",
                    "EEE006",
                    "EEE",
                    "III",
                    "deepthi.eee@gmail.com",
                    "9876510006",
                    "1234"
                ],

                [
                    "Mahesh",
                    "EEE007",
                    "EEE",
                    "IV",
                    "mahesh.eee@gmail.com",
                    "9876510007",
                    "1234"
                ],

                [
                    "Sravani",
                    "EEE008",
                    "EEE",
                    "IV",
                    "sravani.eee@gmail.com",
                    "9876510008",
                    "1234"
                ],

                [
                    "Tarun",
                    "EEE009",
                    "EEE",
                    "IV",
                    "tarun.eee@gmail.com",
                    "9876510009",
                    "1234"
                ],

                [
                    "Pavan",
                    "EEE010",
                    "EEE",
                    "IV",
                    "pavan.eee@gmail.com",
                    "9876510010",
                    "1234"
                ],

                // ================= CIVIL =================

                [
                    "Ravi",
                    "CIV001",
                    "Civil",
                    "I",
                    "ravi.civil@gmail.com",
                    "9876520001",
                    "1234"
                ],

                [
                    "Sowmya",
                    "CIV002",
                    "Civil",
                    "I",
                    "sowmya.civil@gmail.com",
                    "9876520002",
                    "1234"
                ],

                [
                    "Manoj",
                    "CIV003",
                    "Civil",
                    "II",
                    "manoj.civil@gmail.com",
                    "9876520003",
                    "1234"
                ],

                [
                    "Kavya",
                    "CIV004",
                    "Civil",
                    "II",
                    "kavya.civil@gmail.com",
                    "9876520004",
                    "1234"
                ],

                [
                    "Arun",
                    "CIV005",
                    "Civil",
                    "III",
                    "arun.civil@gmail.com",
                    "9876520005",
                    "1234"
                ],

                [
                    "Divya",
                    "CIV006",
                    "Civil",
                    "III",
                    "divya.civil2@gmail.com",
                    "9876520006",
                    "1234"
                ],

                [
                    "Ramesh",
                    "CIV007",
                    "Civil",
                    "IV",
                    "ramesh.civil@gmail.com",
                    "9876520007",
                    "1234"
                ],

                [
                    "Bhavya",
                    "CIV008",
                    "Civil",
                    "IV",
                    "bhavya.civil@gmail.com",
                    "9876520008",
                    "1234"
                ],

                [
                    "Ganesh",
                    "CIV009",
                    "Civil",
                    "IV",
                    "ganesh.civil@gmail.com",
                    "9876520009",
                    "1234"
                ],

                [
                    "Pavani",
                    "CIV010",
                    "Civil",
                    "IV",
                    "pavani.civil@gmail.com",
                    "9876520010",
                    "1234"
                ],

                // ================= MECHANICAL =================

                [
                    "Pradeep",
                    "MEC001",
                    "Mechanical",
                    "I",
                    "pradeep.mech@gmail.com",
                    "9876530001",
                    "1234"
                ],

                [
                    "Suresh",
                    "MEC002",
                    "Mechanical",
                    "I",
                    "suresh.mech@gmail.com",
                    "9876530002",
                    "1234"
                ],

                [
                    "Vijay",
                    "MEC003",
                    "Mechanical",
                    "II",
                    "vijay.mech@gmail.com",
                    "9876530003",
                    "1234"
                ],

                [
                    "Rohini",
                    "MEC004",
                    "Mechanical",
                    "II",
                    "rohini.mech@gmail.com",
                    "9876530004",
                    "1234"
                ],

                [
                    "Kishore",
                    "MEC005",
                    "Mechanical",
                    "III",
                    "kishore.mech@gmail.com",
                    "9876530005",
                    "1234"
                ],

                [
                    "Harini",
                    "MEC006",
                    "Mechanical",
                    "III",
                    "harini.mech@gmail.com",
                    "9876530006",
                    "1234"
                ],

                [
                    "Naresh",
                    "MEC007",
                    "Mechanical",
                    "IV",
                    "naresh.mech@gmail.com",
                    "9876530007",
                    "1234"
                ],

                [
                    "Snehal",
                    "MEC008",
                    "Mechanical",
                    "IV",
                    "snehal.mech@gmail.com",
                    "9876530008",
                    "1234"
                ],

                [
                    "Lokesh",
                    "MEC009",
                    "Mechanical",
                    "IV",
                    "lokesh.mech@gmail.com",
                    "9876530009",
                    "1234"
                ],

                [
                    "Aishwarya",
                    "MEC010",
                    "Mechanical",
                    "IV",
                    "aishwarya.mech@gmail.com",
                    "9876530010",
                    "1234"
                ]

            ];

            students.forEach(student => {

                db.run(

                    `INSERT INTO students
                    (
                        name,
                        roll,
                        department,
                        year,
                        email,
                        phone,
                        password
                    )
                    VALUES (?,?,?,?,?,?,?)`,

                    student,

                    (err) => {

                        if (err) {
                            console.log(err.message);
                        }

                    }

                );

            });

            console.log("✅ Sample Students Inserted");

        }

    }

);

// ======================================
// INSERT SAMPLE TEACHERS
// ======================================

db.get(
    "SELECT COUNT(*) AS count FROM teachers",

    (err, row) => {

        if (err) {

            console.log(err);
            return;

        }

        if (row.count === 0) {

            console.log("📥 Adding Sample Teachers...");

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
                ],

                // ================= ECE =================

                [
                    "Arjun",
                    "ECE001",
                    "ECE",
                    "I",
                    "arjun.ece@gmail.com",
                    "9876501001",
                    "1234"
                ],

                [
                    "Kavya",
                    "ECE002",
                    "ECE",
                    "I",
                    "kavya.ece@gmail.com",
                    "9876501002",
                    "1234"
                ],

                [
                    "Rohit",
                    "ECE003",
                    "ECE",
                    "I",
                    "rohit.ece@gmail.com",
                    "9876501003",
                    "1234"
                ],

                [
                    "Sneha",
                    "ECE004",
                    "ECE",
                    "II",
                    "sneha.ece@gmail.com",
                    "9876501004",
                    "1234"
                ],

                [
                    "Vikram",
                    "ECE005",
                    "ECE",
                    "II",
                    "vikram.ece@gmail.com",
                    "9876501005",
                    "1234"
                ],

                [
                    "Deepika",
                    "ECE006",
                    "ECE",
                    "II",
                    "deepika.ece@gmail.com",
                    "9876501006",
                    "1234"
                ],

                [
                    "Ajay",
                    "ECE007",
                    "ECE",
                    "III",
                    "ajay.ece@gmail.com",
                    "9876501007",
                    "1234"
                ],

                [
                    "Nandini",
                    "ECE008",
                    "ECE",
                    "III",
                    "nandini.ece@gmail.com",
                    "9876501008",
                    "1234"
                ],

                [
                    "Manoj",
                    "ECE009",
                    "ECE",
                    "IV",
                    "manoj.ece@gmail.com",
                    "9876501009",
                    "1234"
                ],

                [
                    "Pooja",
                    "ECE010",
                    "ECE",
                    "IV",
                    "pooja.ece@gmail.com",
                    "9876501010",
                    "1234"
                ],

                // ================= EEE =================

                [
                    "Ramesh",
                    "EEE001",
                    "EEE",
                    "I",
                    "ramesh.eee@gmail.com",
                    "9876502001",
                    "1234"
                ],

                [
                    "Divya",
                    "EEE002",
                    "EEE",
                    "I",
                    "divya.eee@gmail.com",
                    "9876502002",
                    "1234"
                ],

                [
                    "Karthik",
                    "EEE003",
                    "EEE",
                    "I",
                    "karthik.eee@gmail.com",
                    "9876502003",
                    "1234"
                ],

                [
                    "Swathi",
                    "EEE004",
                    "EEE",
                    "II",
                    "swathi.eee@gmail.com",
                    "9876502004",
                    "1234"
                ],

                [
                    "Praveen",
                    "EEE005",
                    "EEE",
                    "II",
                    "praveen.eee@gmail.com",
                    "9876502005",
                    "1234"
                ],

                [
                    "Sravani",
                    "EEE006",
                    "EEE",
                    "II",
                    "sravani.eee@gmail.com",
                    "9876502006",
                    "1234"
                ],

                [
                    "Mahesh",
                    "EEE007",
                    "EEE",
                    "III",
                    "mahesh.eee@gmail.com",
                    "9876502007",
                    "1234"
                ],

                [
                    "Lavanya",
                    "EEE008",
                    "EEE",
                    "III",
                    "lavanya.eee@gmail.com",
                    "9876502008",
                    "1234"
                ],

                [
                    "Naresh",
                    "EEE009",
                    "EEE",
                    "IV",
                    "naresh.eee@gmail.com",
                    "9876502009",
                    "1234"
                ],

                [
                    "Sindhu",
                    "EEE010",
                    "EEE",
                    "IV",
                    "sindhu.eee@gmail.com",
                    "9876502010",
                    "1234"
                ],

                // ================= CIVIL =================

                [
                    "Ravi",
                    "CIV001",
                    "Civil",
                    "I",
                    "ravi.civil@gmail.com",
                    "9876503001",
                    "1234"
                ],

                [
                    "Anusha",
                    "CIV002",
                    "Civil",
                    "I",
                    "anusha.civil@gmail.com",
                    "9876503002",
                    "1234"
                ],

                [
                    "Ganesh",
                    "CIV003",
                    "Civil",
                    "I",
                    "ganesh.civil@gmail.com",
                    "9876503003",
                    "1234"
                ],

                [
                    "Meghana",
                    "CIV004",
                    "Civil",
                    "II",
                    "meghana.civil@gmail.com",
                    "9876503004",
                    "1234"
                ],

                [
                    "Srinivas",
                    "CIV005",
                    "Civil",
                    "II",
                    "srinivas.civil@gmail.com",
                    "9876503005",
                    "1234"
                ],

                [
                    "Harini",
                    "CIV006",
                    "Civil",
                    "II",
                    "harini.civil@gmail.com",
                    "9876503006",
                    "1234"
                ],

                [
                    "Kishore",
                    "CIV007",
                    "Civil",
                    "III",
                    "kishore.civil@gmail.com",
                    "9876503007",
                    "1234"
                ],

                [
                    "Navya",
                    "CIV008",
                    "Civil",
                    "III",
                    "navya.civil@gmail.com",
                    "9876503008",
                    "1234"
                ],

                [
                    "Venu",
                    "CIV009",
                    "Civil",
                    "IV",
                    "venu.civil@gmail.com",
                    "9876503009",
                    "1234"
                ],

                [
                    "Bhargavi",
                    "CIV010",
                    "Civil",
                    "IV",
                    "bhargavi.civil@gmail.com",
                    "9876503010",
                    "1234"
                ],

                // ================= MECHANICAL =================

                [
                    "Vamsi",
                    "MEC001",
                    "Mechanical",
                    "I",
                    "vamsi.mech@gmail.com",
                    "9876504001",
                    "1234"
                ],

                [
                    "Sowmya",
                    "MEC002",
                    "Mechanical",
                    "I",
                    "sowmya.mech@gmail.com",
                    "9876504002",
                    "1234"
                ],

                [
                    "Kiran",
                    "MEC003",
                    "Mechanical",
                    "I",
                    "kiran.mech@gmail.com",
                    "9876504003",
                    "1234"
                ],

                [
                    "Tejaswini",
                    "MEC004",
                    "Mechanical",
                    "II",
                    "tejaswini.mech@gmail.com",
                    "9876504004",
                    "1234"
                ],

                [
                    "Lokesh",
                    "MEC005",
                    "Mechanical",
                    "II",
                    "lokesh.mech@gmail.com",
                    "9876504005",
                    "1234"
                ],

                [
                    "Pavani",
                    "MEC006",
                    "Mechanical",
                    "II",
                    "pavani.mech@gmail.com",
                    "9876504006",
                    "1234"
                ],

                [
                    "Sairam",
                    "MEC007",
                    "Mechanical",
                    "III",
                    "sairam.mech@gmail.com",
                    "9876504007",
                    "1234"
                ],

                [
                    "Akhila",
                    "MEC008",
                    "Mechanical",
                    "III",
                    "akhila.mech@gmail.com",
                    "9876504008",
                    "1234"
                ],

                [
                    "Chandu",
                    "MEC009",
                    "Mechanical",
                    "IV",
                    "chandu.mech@gmail.com",
                    "9876504009",
                    "1234"
                ],

                [
                    "Likitha",
                    "MEC010",
                    "Mechanical",
                    "IV",
                    "likitha.mech@gmail.com",
                    "9876504010",
                    "1234"
                ]

            ];

            teachers.forEach(teacher => {

                db.run(

                    `INSERT INTO teachers
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

                    VALUES (?,?,?,?,?,?,?,?,?)`,

                    teacher,

                    (err) => {

                        if (err) {

                            console.log(err.message);

                        }

                    }

                );

            });

            console.log("✅ Sample Teachers Inserted");

        }

    }

);

// ======================================
// INSERT SAMPLE ATTENDANCE
// ======================================

db.get(

    "SELECT COUNT(*) AS count FROM attendance",

    (err, row) => {

        if (err) {

            console.log(err);
            return;

        }

        if (row.count === 0) {

            console.log("📥 Adding Sample Attendance...");

            const today = new Date()
                .toISOString()
                .split("T")[0];

            const attendance = [

                // ================= CSE =================

                ["CSE001", "DBMS", "T001", today, "Present"],
                ["CSE002", "DBMS", "T001", today, "Present"],
                ["CSE003", "DBMS", "T001", today, "Present"],
                ["CSE004", "DBMS", "T001", today, "Present"],
                ["CSE005", "DBMS", "T001", today, "Absent"],
                ["CSE006", "DBMS", "T001", today, "Present"],
                ["CSE007", "DBMS", "T001", today, "Present"],
                ["CSE008", "DBMS", "T001", today, "Absent"],
                ["CSE009", "DBMS", "T001", today, "Present"],
                ["CSE010", "DBMS", "T001", today, "Present"],

                // ================= ECE =================

                ["ECE001", "Digital Electronics", "T002", today, "Present"],
                ["ECE002", "Digital Electronics", "T002", today, "Present"],
                ["ECE003", "Digital Electronics", "T002", today, "Absent"],
                ["ECE004", "Digital Electronics", "T002", today, "Present"],
                ["ECE005", "Digital Electronics", "T002", today, "Present"],
                ["ECE006", "Digital Electronics", "T002", today, "Present"],
                ["ECE007", "Digital Electronics", "T002", today, "Absent"],
                ["ECE008", "Digital Electronics", "T002", today, "Present"],
                ["ECE009", "Digital Electronics", "T002", today, "Present"],
                ["ECE010", "Digital Electronics", "T002", today, "Present"],
                // ================= EEE =================

                ["EEE001", "Electrical Machines", "T003", today, "Present"],
                ["EEE002", "Electrical Machines", "T003", today, "Present"],
                ["EEE003", "Electrical Machines", "T003", today, "Absent"],
                ["EEE004", "Electrical Machines", "T003", today, "Present"],
                ["EEE005", "Electrical Machines", "T003", today, "Present"],
                ["EEE006", "Electrical Machines", "T003", today, "Present"],
                ["EEE007", "Electrical Machines", "T003", today, "Absent"],
                ["EEE008", "Electrical Machines", "T003", today, "Present"],
                ["EEE009", "Electrical Machines", "T003", today, "Present"],
                ["EEE010", "Electrical Machines", "T003", today, "Present"],

                // ================= CIVIL =================

                ["CIV001", "Structural Engineering", "T005", today, "Present"],
                ["CIV002", "Structural Engineering", "T005", today, "Present"],
                ["CIV003", "Structural Engineering", "T005", today, "Absent"],
                ["CIV004", "Structural Engineering", "T005", today, "Present"],
                ["CIV005", "Structural Engineering", "T005", today, "Present"],
                ["CIV006", "Structural Engineering", "T005", today, "Present"],
                ["CIV007", "Structural Engineering", "T005", today, "Absent"],
                ["CIV008", "Structural Engineering", "T005", today, "Present"],
                ["CIV009", "Structural Engineering", "T005", today, "Present"],
                ["CIV010", "Structural Engineering", "T005", today, "Present"],

                // ================= MECHANICAL =================

                ["MEC001", "Thermodynamics", "T004", today, "Present"],
                ["MEC002", "Thermodynamics", "T004", today, "Present"],
                ["MEC003", "Thermodynamics", "T004", today, "Absent"],
                ["MEC004", "Thermodynamics", "T004", today, "Present"],
                ["MEC005", "Thermodynamics", "T004", today, "Present"],
                ["MEC006", "Thermodynamics", "T004", today, "Present"],
                ["MEC007", "Thermodynamics", "T004", today, "Absent"],
                ["MEC008", "Thermodynamics", "T004", today, "Present"],
                ["MEC009", "Thermodynamics", "T004", today, "Present"],
                ["MEC010", "Thermodynamics", "T004", today, "Present"]

            ];

            attendance.forEach(record => {

                db.run(

                    `INSERT INTO attendance
                    (
                        roll,
                        subject,
                        teacherId,
                        date,
                        status
                    )

                    VALUES (?,?,?,?,?)`,

                    record,

                    (err) => {

                        if (err) {

                            console.log(err.message);

                        }

                    }

                );

            });

            console.log("✅ Sample Attendance Inserted");

        }

    }

);

// ======================================
// INSERT SAMPLE RESULTS
// ======================================

db.get(

    "SELECT COUNT(*) AS count FROM results",

    (err, row) => {

        if (err) {

            console.log(err);
            return;

        }

        if (row.count === 0) {

            console.log("📥 Adding Sample Results...");

            const results = [

                // ================= CSE =================

                ["CSE001", "Rahul Kumar", "CSE", "DBMS", 92, "A+", "Pass"],
                ["CSE002", "Anjali Sharma", "CSE", "DBMS", 88, "A", "Pass"],
                ["CSE003", "Priya Reddy", "CSE", "DBMS", 81, "A", "Pass"],
                ["CSE004", "Sai Teja", "CSE", "DBMS", 76, "B+", "Pass"],
                ["CSE005", "Kiran Kumar", "CSE", "DBMS", 69, "B", "Pass"],
                ["CSE006", "Harsha Vardhan", "CSE", "DBMS", 58, "C", "Pass"],
                ["CSE007", "Nikhil Reddy", "CSE", "DBMS", 45, "D", "Fail"],
                ["CSE008", "Keerthana", "CSE", "DBMS", 84, "A", "Pass"],
                ["CSE009", "Bhavana", "CSE", "DBMS", 91, "A+", "Pass"],
                ["CSE010", "Sandeep", "CSE", "DBMS", 73, "B+", "Pass"],



                // ================= ECE =================

                ["ECE001", "Arjun", "ECE", "Computer Networks", 90, "A+", "Pass"],
                ["ECE002", "Kavya", "ECE", "Computer Networks", 85, "A", "Pass"],
                ["ECE003", "Rohit", "ECE", "Computer Networks", 78, "B+", "Pass"],
                ["ECE004", "Sneha", "ECE", "Computer Networks", 72, "B", "Pass"],
                ["ECE005", "Vikram", "ECE", "Computer Networks", 66, "B", "Pass"],
                ["ECE006", "Deepika", "ECE", "Computer Networks", 81, "A", "Pass"],
                ["ECE007", "Ajay", "ECE", "Computer Networks", 59, "C", "Pass"],
                ["ECE008", "Nandini", "ECE", "Computer Networks", 47, "D", "Fail"],
                ["ECE009", "Manoj", "ECE", "Computer Networks", 88, "A", "Pass"],
                ["ECE010", "Pooja", "ECE", "Computer Networks", 94, "A+", "Pass"],

                // ================= EEE =================

                ["EEE001", "Ramesh", "EEE", "Operating Systems", 89, "A", "Pass"],
                ["EEE002", "Divya", "EEE", "Operating Systems", 76, "B+", "Pass"],
                ["EEE003", "Karthik", "EEE", "Operating Systems", 68, "B", "Pass"],
                ["EEE004", "Swathi", "EEE", "Operating Systems", 55, "C", "Pass"],
                ["EEE005", "Praveen", "EEE", "Operating Systems", 48, "D", "Fail"],
                ["EEE006", "Sravani", "EEE", "Operating Systems", 83, "A", "Pass"],
                ["EEE007", "Mahesh", "EEE", "Operating Systems", 71, "B+", "Pass"],
                ["EEE008", "Lavanya", "EEE", "Operating Systems", 95, "A+", "Pass"],
                ["EEE009", "Naresh", "EEE", "Operating Systems", 64, "B", "Pass"],
                ["EEE010", "Sindhu", "EEE", "Operating Systems", 87, "A", "Pass"],

                // ================= CIVIL =================

                ["CIV001", "Ravi", "Civil", "Surveying", 91, "A+", "Pass"],
                ["CIV002", "Anusha", "Civil", "Surveying", 82, "A", "Pass"],
                ["CIV003", "Ganesh", "Civil", "Surveying", 74, "B+", "Pass"],
                ["CIV004", "Meghana", "Civil", "Surveying", 69, "B", "Pass"],
                ["CIV005", "Srinivas", "Civil", "Surveying", 58, "C", "Pass"],
                ["CIV006", "Harini", "Civil", "Surveying", 86, "A", "Pass"],
                ["CIV007", "Kishore", "Civil", "Surveying", 49, "D", "Fail"],
                ["CIV008", "Navya", "Civil", "Surveying", 79, "B+", "Pass"],
                ["CIV009", "Venu", "Civil", "Surveying", 93, "A+", "Pass"],
                ["CIV010", "Bhargavi", "Civil", "Surveying", 71, "B+", "Pass"],

                // ================= MECHANICAL =================

                ["MEC001", "Vamsi", "Mechanical", "Thermodynamics", 90, "A+", "Pass"],
                ["MEC002", "Sowmya", "Mechanical", "Thermodynamics", 84, "A", "Pass"],
                ["MEC003", "Kiran", "Mechanical", "Thermodynamics", 77, "B+", "Pass"],
                ["MEC004", "Tejaswini", "Mechanical", "Thermodynamics", 69, "B", "Pass"],
                ["MEC005", "Lokesh", "Mechanical", "Thermodynamics", 62, "B", "Pass"],
                ["MEC006", "Pavani", "Mechanical", "Thermodynamics", 81, "A", "Pass"],
                ["MEC007", "Sairam", "Mechanical", "Thermodynamics", 56, "C", "Pass"],
                ["MEC008", "Akhila", "Mechanical", "Thermodynamics", 46, "D", "Fail"],
                ["MEC009", "Chandu", "Mechanical", "Thermodynamics", 88, "A", "Pass"],
                ["MEC010", "Likitha", "Mechanical", "Thermodynamics", 94, "A+", "Pass"]

            ];

            results.forEach(result => {

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
                    VALUES (?,?,?,?,?,?,?)
                    `,

                    result,

                    (err) => {

                        if (err) {

                            console.log(err.message);

                        }

                    }

                );

            });

            console.log("✅ Sample Results Inserted");

        }

    }

);

// ======================================
// DATABASE EXPORT
// ======================================

module.exports = db;

