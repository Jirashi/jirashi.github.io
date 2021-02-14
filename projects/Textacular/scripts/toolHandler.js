let editor = document.getElementById('editor');
let fileName = document.getElementById('file-name');
let fileUpload = document.getElementById('file-upload');
let zoomAmnt = document.getElementById('set-zoom-btn');

let container = document.getElementById('container');
let htmlViewer = document.getElementById('output');

var undone = [];
var copiedText = "";

function newFile() {
    if (confirm("New file? All current text will be deleted.")) {
        editor.value = "";
        fileName.value = `Untitled.${container.className}`;
        window.location.href = "https://techlujo.github.io/projects/Textacular/";
    }
}

function openFile() {
    fileUpload.click();
}

function emailFile() {
    var email = prompt("Enter a valid E-Mail", "abc@example.com")
    if (email) {
        window.location.href = `
        mailto:${email}
        ?subject=${fileName.value}
        &body=${editor.value}`;
    }
}

function saveFile() {
    var fileType = "text/plain";
    if (container.className == "txt") {
        fileType = "text/plain";
    } else if (container.className == "html") {
        fileType = "text/html";
    }
    var file = new Blob([ editor.value ], { type: fileType });
    var filename = fileName.value;

    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
 
}

function saveFileAs () {
    fileName.value = prompt("Save As:", fileName.value)
    if (fileName.value) {saveFile();}
}

function saveLocal() {
    function makeKey(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    var fileContent = [fileName.value, editor.value];
    var fileKey = makeKey(10);
    var fileComplete = JSON.stringify({Key: fileKey, Content: fileContent});
    var files = localStorage.getItem("files");

    if (files) {
        let parsedFiles = JSON.parse(files);
        for (var truFile of parsedFiles) {
            file = JSON.parse(truFile);
            if (file.Content[0] == fileName.value) {
                file.Content[1] = editor.value;
                parsedFiles[parsedFiles.indexOf(truFile)] = JSON.stringify(file);
                localStorage.setItem("files", JSON.stringify(parsedFiles));
                return;
            }
        }
        parsedFiles.push(fileComplete);
        localStorage.setItem("files", JSON.stringify(parsedFiles));
    } else {
        localStorage.setItem("files", JSON.stringify([fileComplete]));
    }
    prompt(`Saved file as ${fileName.value} \nKey:`, fileKey);
}

function delLocal(key) {
    var files = JSON.parse(localStorage.getItem("files"));
    for (var truFile of files) {
        file = JSON.parse(truFile)
        if (file.Key == key) {
            if (confirm(`Are you sure you want to delete ${file.Content[0]}?`)) {
                files.splice(files.indexOf(truFile), 1);
                localStorage.setItem("files", JSON.stringify(files));
            }
        }
    }
}

function loadLocal(key) {
    let files = JSON.parse(localStorage.getItem("files"));
    for (var file of files) {
        file = JSON.parse(file)
        if (file.Key == key) {
            fileName.value = file.Content[0]
            editor.value = file.Content[1]
        }
    }
}

function loadLocalFiles() {
    let files = localStorage.getItem("files");
    let menu = document.getElementById('localfiles-menu');
    let filelist = document.getElementById('lclfiles');
    filelist.innerHTML = "";
    if (files) {
        let parsedFiles = JSON.parse(localStorage.getItem("files"));
        for (var file of parsedFiles) {
            file = JSON.parse(file);
            optionHTML = `<option value="${file.Key}">${file.Content[0]} (${file.Content[1].slice(0, 10)}...)</option>`;
            filelist.insertAdjacentHTML('beforeend', optionHTML);
        }
        menu.style.display = "block";
    }
}

function loadLocalFromURL() {
    function getKey() {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            return pair[1]
        }
        return(false);
    }
    if (getKey()) {
        loadLocal(getKey())
    }
}

function Undo() {
    let last = undone.length
    if (last < 101) {
        undone.push(editor.value.slice(editor.value.length - 1));
        editor.value = editor.value.slice(0, editor.value.length - 1)
    }
}

function Redo() {
    let last = undone.length - 1;
    if (last > -1) {
        editor.value += undone[last];
        undone.splice(last, 1)
    }
}

function Copy() {
    copiedText = editor.value;
    editor.select();
    editor.setSelectionRange(0, 99999)
    document.execCommand("copy");
}

function Clear() {
    if (editor.value.length > 0) {
        if (confirm("Are you sure? All current text will be deleted.")) {
            editor.value = "";
        }
    }
}

function Cut() {
    Copy()
    editor.value = "";
}

function Paste() {
    editor.value += copiedText
}

function slctAll() {
    editor.select();
}

function Update() {
    if (container.className == "html") {
        document.getElementById('output').innerHTML = editor.value;
    }
}

function Zoom(inout) {
    let fontSize = editor.style.fontSize;
    var truFontSize = parseInt(fontSize.slice(0, fontSize.length - 2))
    if (inout) {var ZoomAmnt = 2;} else {var ZoomAmnt = -2;}
    if (truFontSize >= 32 || 6 > truFontSize) {
        editor.style.fontSize = "18px";
        zoomAmnt.innerHTML = "18px"
    } else {
        editor.style.fontSize = `${(truFontSize + ZoomAmnt)}px`;
        zoomAmnt.innerHTML = `${(truFontSize + ZoomAmnt)}px`;
    }
}

function setZoom() {
    var amnt = prompt("Choose size:", "6-32")
    if (amnt > 5 && amnt < 33) {
        amnt = `${amnt}px`;
        editor.style.fontSize = amnt;
        zoomAmnt.innerHTML = amnt;
    }
}

function Theme() {
    let menu = document.getElementById('theme-menu');
    menu.style.display = "block";
}
  
window.onclick = function(event) {
    if (event.target.className == "menu") {
        event.target.style.display = "none";
    }
}

function Type(type) {
    container.classList.replace(container.classList[0], type);
    Update();
}

function Settings() {
    let menu = document.getElementById('settings-menu');
    menu.style.display = "block";
}

editor.addEventListener("keyup", function() {
    Update();
});

fileName.addEventListener('change', function() {
    if (fileName.value) {
        if (!fileName.value.endsWith(`.${container.className}`)) {
            fileName.value += `.${container.className}`;
        }
    } else {
        fileName.value = `Untitled.${container.className}`
    }
});

fileUpload.addEventListener('change', function() {
    var file = fileUpload.files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            editor.value = e.target.result;
        };
        fileName.value = file.name;
    }
});

function numColmn(textarea){
    var textLines = textarea.value.substr(0, textarea.selectionStart).split("\n");
    var currentLineNumber = textLines.length;
    var currentColumnIndex = textLines[textLines.length-1].length;
    document.getElementById('numColmn').innerHTML = "Line " + currentLineNumber+", Column " + currentColumnIndex;
}