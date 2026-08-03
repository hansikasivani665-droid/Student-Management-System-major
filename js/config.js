// Shared API base URL — works on Render, local Express, and Live Server
(function () {
    const { hostname, port, origin } = window.location;

    if ((hostname === "localhost" || hostname === "127.0.0.1") && port === "5500") {
        window.API_BASE = "http://localhost:5000";
        return;
    }

    if (origin && origin !== "null") {
        window.API_BASE = origin;
        return;
    }

    window.API_BASE = "https://student-management-system-major-1.onrender.com";
})();
