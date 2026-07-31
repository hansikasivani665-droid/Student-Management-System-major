function saveSettings() {

    let data = {

        college: document.getElementById("collegeName").value,

        system: document.getElementById("systemName").value,

        year: document.getElementById("year").value,

        theme: document.getElementById("theme").value

    };

    localStorage.setItem(
        "settings",
        JSON.stringify(data)
    );

    // Save theme separately
    localStorage.setItem(
        "theme",
        data.theme
    );

    applyTheme();

    alert("Settings Saved Successfully");

}