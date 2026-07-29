# Student Management System (SMS)

## 📌 Project Overview

The **Student Management System** is a web-based application developed to manage student academic and administrative activities digitally.

The system helps administrators and students to manage student details, attendance records, examination results, and profile information efficiently.

This project provides a user-friendly interface with separate dashboards for administrators and students.

---

# 🚀 Features

## 👨‍💼 Admin Module

### Dashboard
- Total Students Count
- Department Count
- Attendance Overview
- Results Overview
- Average Marks Calculation
- Pass Percentage Calculation
- Latest Student Details

### Student Management
- Add New Students
- View Student List
- Store Student Information
- Manage Student Profiles

### Attendance Management
- Record Student Attendance
- View Present and Absent Details
- Calculate Attendance Percentage

### Results Management
- Add Student Results
- View Academic Results
- Calculate:
  - Average Marks
  - Grade
  - Pass Percentage

### Admin Profile & Settings
- View Administrator Profile
- Manage System Settings

---

# 👨‍🎓 Student Module

### Student Dashboard

Students can view:

- Personal Profile Details
- Roll Number
- Department
- Year
- Email
- Phone Number

### Academic Details

- Total Subjects
- Total Results
- Average Marks
- Highest Marks
- Result Status

### Attendance Details

- Total Working Days
- Present Days
- Absent Days
- Attendance Percentage

### Results

Students can view:

- Subject Name
- Marks
- Grade
- Result Status

---

# 🛠️ Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript
- Font Awesome Icons

## Backend

- Node.js
- Express.js

## Database

- SQLite Database

## Tools Used

- Visual Studio Code
- Git & GitHub
- Postman

---

# 📂 Project Structure

```
Student Management System Major

│
├── frontend
│
│   ├── html
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── student-dashboard.html
│   │   ├── results.html
│   │   ├── attendance.html
│   │   └── profile.html
│   │
│   ├── css
│   │   ├── dashboard.css
│   │   ├── student-dashboard.css
│   │   └── styles.css
│   │
│   ├── js
│       ├── dashboard.js
│       ├── student-dashboard.js
│       ├── results.js
│       └── attendance.js
│
│
├── backend
│
│   ├── routes
│   │   ├── students.js
│   │   ├── results.js
│   │   └── attendance.js
│   │
│   ├── models
│   │   └── database.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md

```

---

# ⚙️ Installation & Setup

## Step 1: Clone Repository

```
git clone <repository-url>
```

---

## Step 2: Install Backend Dependencies

Go to backend folder:

```
cd backend
```

Install required packages:

```
npm install
```

---

## Step 3: Start Backend Server

Run:

```
node server.js
```

Server will start at:

```
http://localhost:5000
```

---

## Step 4: Run Frontend

Open:

```
frontend/html/login.html
```

in your browser.

---

# 🔐 Login Details

## Admin Login

```
Email:
admin@gmail.com

Password:
admin123
```

---

## Student Login Example

```
Roll Number:
2298789

Password:
Hansika@123
```

---

# 🔗 API Endpoints

## Students

```
GET /students
```

Get all student details.


---

## Results

```
GET /results
```

Get student results.


---

## Attendance

```
GET /attendance
```

Get attendance records.


---

# 📊 Calculations Implemented

## Average Marks

```
Average Marks =
Total Marks / Number of Subjects
```

---

## Pass Percentage

```
Pass Percentage =
(Number of Passed Results / Total Results) × 100
```

---

## Attendance Percentage

```
Attendance Percentage =
(Present Days / Total Working Days) × 100
```

---

# 🎯 Future Enhancements

- Student registration system
- Role-based authentication
- Password encryption
- Email notifications
- Online fee payment
- PDF report generation
- Cloud database integration

---

# 👩‍💻 Developer

**Hansika Sivani**

B.Tech Computer Science Engineering

---

# 📄 License

This project is developed for academic major project purposes.