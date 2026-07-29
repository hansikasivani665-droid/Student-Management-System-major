/**
 * ============================================================================
 * Student Management System Controller Engine (Part 1)
 * Identity Verification, State Hydration, and API Core Layer
 * Developed by: Hansika Sivani
 * ============================================================================
 */

// User Access Control Authentication Validation Matrix Check
if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

// Runtime API Target Routing Strategy Selection Configuration
const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/students"
    : `${window.location.origin}/students`;

const form = document.getElementById("majorAddStudentForm");
const message = document.getElementById("message");
const submitBtn = document.querySelector(".submit-btn-action");

const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get("id");

// Execute Dynamic Interface Custom Calendar Setup Initialization Lookups
document.addEventListener("DOMContentLoaded", async () => {
    const dateBox = document.getElementById("liveDateDisplay");
    if (dateBox) {
        const today = new Date();
        dateBox.textContent = today.toLocaleDateString('en-US', { 
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
        });
    }

    if (!form) return;

    const liveCounter = document.getElementById("liveRegisterCount");
    if (liveCounter) {
        liveCounter.textContent = editId ? "Edit" : "New";
    }

    // Halt operation sequencing execution if running form in clean context view
    if (!editId) return;

    try {
        const response = await fetch(`${API_URL}/${editId}`);
        const result = await response.json();

        if (!result.success) {
            displaySystemAlert(`Database Communication Exception: ${result.message}`, "error");
            return;
        }

        // Invoke Segment 2 parsing profile handler engine algorithm method mappings
        hydrateFormFieldsWithServerData(result.student);
    }
    catch (error) {
        console.error("Hydration Transaction Trace Exception Logged:", error);
        displaySystemAlert("Network Cluster Fault: Unable to map database properties to front components.", "error");
    }
});

/**
 * Global Interceptor System Notification Banner Component Alert Mapping Function
 */
function displaySystemAlert(txtMsg, alertType = "success") {
    if (!message) return;
    message.style.display = "block";
    if (alertType === "error") {
        message.style.color = "#dc2626";
        message.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Check Error: ${txtMsg}`;
    } else {
        message.style.color = "#16a34a";
        message.innerHTML = `<i class="fa-solid fa-circle-check"></i> Success: ${txtMsg}`;
    }
}
/**
 * ============================================================================
 * Student Management System Controller Engine (Part 2)
 * Structural Object Hydration, Input Checking Framework, and API Data Pipeline
 * Developed by: Hansika Sivani
 * ============================================================================
 */

/**
 * Populates structural interface form values from records sent back by SQLite
 */
function hydrateFormFieldsWithServerData(student) {
    if (!student) return;

    document.getElementById("studentName").value = student.name || "";
    document.getElementById("rollNumber").value = student.roll || "";
    document.getElementById("department").value = student.department || "";
    document.getElementById("emailAddress").value = student.email || "";
    document.getElementById("phone").value = student.phone || "";
    
    if(document.getElementById("studentPhoto") && student.photo) {
        document.getElementById("studentPhoto").value = student.photo;
    }
    if(document.getElementById("userRole") && student.role) {
        document.getElementById("userRole").value = student.role;
    }
    if(document.getElementById("paymentStatus") && student.paymentStatus) {
        document.getElementById("paymentStatus").value = student.paymentStatus;
        const feeTile = document.getElementById("feeStatus");
        if (feeTile) feeTile.textContent = student.paymentStatus;
    }

    const yearRadio = document.querySelector(`input[name="year"][value="${student.year}"]`);
    if (yearRadio) yearRadio.checked = true;

    if (submitBtn) {
        submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> <span>Update Student</span>`;
    }
    
    const mainTitle = document.getElementById("pageHeadingTitle");
    if (mainTitle) mainTitle.textContent = "Update Student Profile";
}

// Data Serialization Submissions Processor Pipeline
if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("studentName").value.trim();
        const roll = document.getElementById("rollNumber").value.trim();
        const department = document.getElementById("department").value;
        const year = document.querySelector("input[name='year']:checked")?.value;
        const email = document.getElementById("emailAddress").value.trim();
        const phone = document.getElementById("phone").value.trim();
        
        const photo = document.getElementById("studentPhoto").value.trim() || "images/default-avatar.png";
        const role = document.getElementById("userRole").value;
        const paymentStatus = document.getElementById("paymentStatus").value;

        // Internship Validation Constraints Assertions
        if (!/^[A-Za-z ]+$/.test(name)) {
            alert("Alpha Verification Failed: Student Name may contain English alphabetic letters only.");
            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            alert("Format Boundary Met: Core Mobile Contact Parameters must contain exactly 10 numerical digits.");
            return;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.com$/;
        if (!emailPattern.test(email)) {
            alert("Network Syntax Exception: Core account contact layout configuration rule must be valid.");
            return;
        }

        if (!year) {
            alert("Missing Context Argument: Choose an active student academic year parameter designation.");
            return;
        }

        // Assemble Structured Data Schema Payload Object 
        const studentPayload = {
            name, roll, department, year, email, phone, photo, role, paymentStatus
        };

        // Halt interface mechanics interaction safely to prevent multi-traffic packet bursts
        submitBtn.disabled = true;
        submitBtn.innerHTML = editId ? 
            `<i class="fa-solid fa-spinner fa-spin"></i> <span>Updating Cloud...</span>` : 
            `<i class="fa-solid fa-spinner fa-spin"></i> <span>Writing DB...</span>`;

        try {
            let response;
            if (editId) {
                response = await fetch(`${API_URL}/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(studentPayload)
                });
            } else {
                response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(studentPayload)
                });
            }

            const result = await response.json();

            if (!result.success) {
                displaySystemAlert(`Engine Execution Refusal: ${result.message}`, "error");
                submitBtn.disabled = false;
                submitBtn.innerHTML = editId ? 
                    `<i class="fa-solid fa-floppy-disk"></i> <span>Update Student</span>` : 
                    `<i class="fa-solid fa-floppy-disk"></i> <span>Save Record</span>`;
                return;
            }

            displaySystemAlert(result.message, "success");
            const cloudBadge = document.getElementById("cloudStatus");
            if (cloudBadge) cloudBadge.textContent = "Synced";

            // Delay redirection slightly so the user sees the confirmation message
            setTimeout(() => {
                window.location.replace("student-list.html");
            }, 1400);
        }
        catch (error) {
            console.error("Critical Stream Gateway Crash Trace Exception caught:", error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = editId ? 
                `<i class="fa-solid fa-floppy-disk"></i> <span>Update Student</span>` : 
                `<i class="fa-solid fa-floppy-disk"></i> <span>Save Record</span>`;
            alert("Runtime Transport Error: Server is unavailable. Ensure your backend Node cluster is live.");
        }
    });
}
