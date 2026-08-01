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
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            teacherId TEXT UNIQUE,
            name TEXT NOT NULL,
            department TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
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

module.exports = db;
