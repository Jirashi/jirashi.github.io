const regex = /^#[0-9A-F]{6}$/i;
var themeName = "light";
var themes = {
    light: ["#eeeeee","#f9f9f9","#dddddd","#ffffff","#dddddd","#000000","#00c3ff"],
    dark: ["#1d1d1d","#222222","#141414","#1a1a1a","#313131","#eeeeee","#109c5f"],
    onedark: ["#282c34","#282c34","#1d2025","#17191d","#282c34","#abb2bf","#e06c75"],
    dracula: ["#282a36","#282a36","#22242e","#22242e","#2f303a","#f8f8f2","#6272a4"]
};

function setPref(num, val) {
    preferences = JSON.parse(localStorage.getItem("preferences"))
    preferences[num] = val;
    localStorage.setItem("preferences", JSON.stringify(preferences));
}

function theme(theme, colors) {
    for (var color of colors) {
        if (!regex.exec(color)) {
            color = "#000000";
        }
    }

    var themeCSS = `
        body.${theme} {background-color: ${colors[0]};}
        body.${theme} header h1 {background-color: ${colors[6]}; color: ${colors[1]};}
        body.${theme} #file-name {background-color: ${colors[1]}; color: ${colors[5]};}
        
        body.${theme} .topbar-list, .topbar-list button {background-color: ${colors[3]}; color: ${colors[5]};}
        body.${theme} .dropdown-content, .dropdown-content button {background-color: ${colors[1]}; color: ${colors[5]};}
        body.${theme} .dropdown-content button:hover {background-color: ${colors[4]};}
        body.${theme} .dropdown-content hr {border: 0.25px solid ${colors[2]};}

        body.${theme} .tool button {background-color: ${colors[1]}; color: ${colors[5]};}
        body.${theme} .tool button:hover {background-color: ${colors[4]}; color: ${colors[5]};}
        body.${theme} #set-zoom-btn {background-color: ${colors[0]}; border: 1px solid ${colors[2]};}

        body.${theme} #editor {background-color: ${colors[1]}; color: ${colors[5]}; border: 1px solid ${colors[2]};}
        body.${theme} #output {border: 1px solid ${colors[2]};}

        body.${theme} .menu-content {background-color: ${colors[3]}; border: 1px solid ${colors[2]};}
        body.${theme} .menu-content h1, h6 {background-color: ${colors[6]}; color: ${colors[0]};}
        body.${theme} .menu-content h3, h4 {color: ${colors[5]};}
        body.${theme} .menu-content .options, .apply-changes {background-color: ${colors[0]}; color: ${colors[5]};}
        body.${theme} .menu-content .apply-changes:hover {background-color: ${colors[6]}; color: ${colors[0]};}

        body.${theme} footer {background-color: ${colors[2]}; color: ${colors[5]};}
    `;
    document.getElementById('theme').innerHTML = themeCSS;
    document.body.classList.replace(document.body.classList[0], theme)
}

for (button of document.getElementsByClassName('apply-changes')) {
    button.addEventListener('click', function(event) {
        event.target.parentElement.parentElement.style.display = "none";
    })
    if (button.id == "apply-changes-theme") {
        button.addEventListener('click', function() {
            themeName = document.getElementById('theme-select').value;
            themes["custom"] = [
                document.getElementById('custom-theme-background').value,
                document.getElementById('custom-theme-foreground').value,
                document.getElementById('custom-theme-border').value,
                document.getElementById('custom-theme-topbar').value,
                document.getElementById('custom-theme-hover').value,
                document.getElementById('custom-theme-text').value,
                document.getElementById('custom-theme-special').value,
            ]
            setPref(0, themeName);
            theme(themeName, themes[themeName])
        });
    } else if (button.id == "apply-changes-pref") {
        button.addEventListener('click', function() {
            var editor =  document.getElementById('editor');
            setPref(1, document.getElementById('font').value);
            setPref(2, document.getElementById('font-weight').value);
            editor.style.fontFamily = document.getElementById('font').value;
            editor.style.fontWeight = document.getElementById('font-weight').value;
        });
    } 
}

function loadPreferences() {
    let preferences = localStorage.getItem("preferences")

    if (preferences) {
        let prefs = JSON.parse(preferences);
        theme(prefs[0], themes[prefs[0]]);

        editor.style.fontFamily = prefs[1];
        editor.style.fontWeight = prefs[2];
    } else {
        let defaultPreferences = JSON.stringify(["light", "Arial, Helvetica, sans-serif", "400"]);
        localStorage.setItem("preferences", defaultPreferences);
        loadPreferences()
    }
}

