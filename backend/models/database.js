const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// 1. Create an absolute path targeting the database directory folder
const dbDir = path.join(__dirname, "../database");
const dbPath = path.join(dbDir, "student.db");

// 2. Cross-platform validation check: Automatically build the folder structure if missing on Render's server environment
if (!fs.existsSync(dbDir)) {
    console.log("📁 Database directory missing. Creating absolute path workspace folder...");
    fs.mkdirSync(dbDir, { recursive: true });
}

console.log("Initializing absolute SQLite Database connection path at:", dbPath);

const db = new sqlite3.Database(
    dbPath,
    (err) => {
        if (err) {
            console.log("❌ SQLite Connection Failed");
            console.log(err.message);
        } else {
            console.log("✅ SQLite Connected Successfully");
        }
    }
);

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
            date TEXT NOT NULL,
            status TEXT NOT NULL,
            UNIQUE(roll,date)
        )
    `);

    // ===============================
    // RESULTS TABLE
    // ===============================
    db.run(`
        CREATE TABLE IF NOT EXISTS results(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            roll TEXT NOT NULL,
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
 id INTEGER PRIMARY KEY,
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
// INSERT SAMPLE STUDENTS
// ======================================

db.get("SELECT COUNT(*) AS count FROM students", (err, row) => {

    if (err) {
        console.log(err);
        return;
    }

    if (row.count === 0) {

        console.log("📥 Adding Sample Students...");

        const students = [

            ["Rahul Kumar", "CSE001", "CSE", "III", "rahul@gmail.com", "9876543210", "1234"],
            ["Anjali Sharma", "CSE002", "CSE", "III", "anjali@gmail.com", "9876543211", "1234"],
            ["Priya Reddy", "CSE003", "CSE", "III", "priya@gmail.com", "9876543212", "1234"],
            ["Sai Teja", "CSE004", "CSE", "III", "sai@gmail.com", "9876543213", "1234"],
            ["Kiran Kumar", "CSE005", "CSE", "III", "kiran@gmail.com", "9876543214", "1234"],
            ["Harsha Vardhan", "CSE006", "CSE", "III", "harsha@gmail.com", "9876543215", "1234"],
            ["Nikhil Reddy", "CSE007", "CSE", "III", "nikhil@gmail.com", "9876543216", "1234"],
            ["Keerthana", "CSE008", "CSE", "III", "keerthana@gmail.com", "9876543217", "1234"],
            ["Bhavana", "CSE009", "CSE", "III", "bhavana@gmail.com", "9876543218", "1234"],
            ["Sandeep", "CSE010", "CSE", "III", "sandeep@gmail.com", "9876543219", "1234"]

        ];

        students.forEach(student => {

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
                VALUES
                (?,?,?,?,?,?,?)
                `,
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

});

// ======================================
// INSERT SAMPLE TEACHERS
// ======================================

db.get("SELECT COUNT(*) AS count FROM teachers", (err, row) => {

    if (err) {
        console.log(err);
        return;
    }

    if (row.count === 0) {

        console.log("📥 Adding Sample Teachers...");

        const teachers = [

            ["T001", "Dr. Ramesh", "CSE", "ramesh@gmail.com", "9876500001", "M.Tech", "5 Years", "1234"],
            ["T002", "Dr. Suresh", "CSE", "suresh@gmail.com", "9876500002", "Ph.D", "8 Years", "1234"],
            ["T003", "Mrs. Lakshmi", "CSE", "lakshmi@gmail.com", "9876500003", "M.Tech", "6 Years", "1234"],
            ["T004", "Mr. Rajesh", "CSE", "rajesh@gmail.com", "9876500004", "M.Tech", "4 Years", "1234"],
            ["T005", "Mrs. Anitha", "CSE", "anitha@gmail.com", "9876500005", "Ph.D", "10 Years", "1234"]

        ];

        teachers.forEach(teacher => {

            db.run(
                `
                INSERT INTO teachers
                (
                    teacherId,
                    name,
                    department,
                    email,
                    phone,
                    qualification,
                    experience,
                    password
                )
                VALUES
                (?,?,?,?,?,?,?,?)
                `,
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

});

// ======================================
// INSERT SAMPLE ATTENDANCE
// ======================================

db.get("SELECT COUNT(*) AS count FROM attendance", (err, row) => {

    if (err) {
        console.log(err);
        return;
    }

    if (row.count === 0) {

        console.log("📥 Adding Sample Attendance...");

        const today = new Date().toISOString().split("T")[0];

        const attendance = [

            ["CSE001", today, "Present"],
            ["CSE002", today, "Present"],
            ["CSE003", today, "Present"],
            ["CSE004", today, "Present"],
            ["CSE005", today, "Absent"],
            ["CSE006", today, "Present"],
            ["CSE007", today, "Present"],
            ["CSE008", today, "Absent"],
            ["CSE009", today, "Present"],
            ["CSE010", today, "Present"]

        ];

        attendance.forEach(record => {

            db.run(
                `
                INSERT INTO attendance
                (
                    roll,
                    date,
                    status
                )
                VALUES
                (?,?,?)
                `,
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

});

// ======================================
// INSERT SAMPLE RESULTS
// ======================================

db.get("SELECT COUNT(*) AS count FROM results", (err, row) => {

    if (err) {
        console.log(err);
        return;
    }

    if (row.count === 0) {

        console.log("📥 Adding Sample Results...");

        const results = [

            ["CSE001", "Rahul Kumar", "CSE", "DBMS", 92, "A+", "Pass"],
            ["CSE002", "Anjali Sharma", "CSE", "DBMS", 88, "A", "Pass"],
            ["CSE003", "Priya Reddy", "CSE", "DBMS", 81, "A", "Pass"],
            ["CSE004", "Sai Teja", "CSE", "DBMS", 76, "B+", "Pass"],
            ["CSE005", "Kiran Kumar", "CSE", "DBMS", 69, "B", "Pass"],
            ["CSE006", "Harsha Vardhan", "CSE", "DBMS", 58, "C", "Pass"],
            ["CSE007", "Nikhil Reddy", "CSE", "DBMS", 45, "D", "Fail"],
            ["CSE008", "Keerthana", "CSE", "DBMS", 84, "A", "Pass"],
            ["CSE009", "Bhavana", "CSE", "DBMS", 91, "A+", "Pass"],
            ["CSE010", "Sandeep", "CSE", "DBMS", 73, "B+", "Pass"]

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
                VALUES
                (?,?,?,?,?,?,?)
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

});

module.exports = db;
