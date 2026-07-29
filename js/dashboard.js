/**
 * ============================================================================
 * Student Management System - Dashboard Controller v2.0
 * Live Real-Time Analytics and System Handshake Core Routing Engine
 * Developed by: Hansika Sivani
 * ============================================================================
 */

// Identity Security Guard Module Check
if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
}

// Adaptive Production Network Traffic URI Target Definition
const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/students"
    : `${window.location.origin}/students`;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Fire Up Dynamic System Live Calendar & Clock Updates Execution
    initializeLiveClocks();

    // 2. Query Live Database Indices Data Feed metrics
    fetchTelemetrySummaryCounts();
});

/**
 * Creates accurate ticking clock mechanisms inside active interface targets
 */
function initializeLiveClocks() {
    const dateBox = document.getElementById("liveDateDisplay");
    const timeBox = document.getElementById("liveTimeDisplay");

    function renderTime() {
        const current = new Date();
        
        if (dateBox) {
            dateBox.textContent = current.toLocaleDateString('en-US', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
            });
        }
        
        if (timeBox) {
            timeBox.textContent = current.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
            });
        }
    }
    
    renderTime();
    setInterval(renderTime, 1000);
}

/**
 * Communicates with backend system layers to load student database parameters
 */
async function fetchTelemetrySummaryCounts() {
    const studentCountBadge = document.getElementById("studentCount");
    if (!studentCountBadge) return;

    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (result.success && Array.isArray(result.students)) {
            // Bind true runtime length metrics value cleanly to interface box
            studentCountBadge.textContent = result.students.length;
        } else {
            studentCountBadge.textContent = "0";
        }
    }
    catch (error) {
        console.error("Telemetry Query Trace Interruption Error Catch:", error);
        // Fallback interface safe indicators on stream connections errors
        studentCountBadge.textContent = "Offline";
    }
}
