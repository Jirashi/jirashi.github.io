let editor = document.getElementById('editor');
let fileName = document.getElementById('file-name');
let fileUpload = document.getElementById('file-upload');
let zoomAmnt = document.getElementById('set-zoom-btn');

let container = document.getElementById('container');
let htmlViewer = document.getElementById('output');

var undone = [];
var copiedText = "";
var themes = ["light-theme", "dark-theme", "dracula", "one-dark"]

function newFile() {
    if (confirm("New file? All current text will be deleted.")) {
        editor.innerHTML = "";
        fileName.value = `Untitled.${container.className}`;
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
    menu = document.getElementById('theme-menu');
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
    alert("Whoops! You've found a feature that hasn't yet been implemented, check back later.")
}

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
        console.log(file.type);
        fileName.value = file.name;
    }
});

editor.addEventListener("keyup", function() {
    Update();
});

document.getElementById('theme').addEventListener('change', function() {
    document.body.classList.replace (
        document.body.classList[0], 
        document.getElementById('theme').value
    );
});

function numColmn(textarea){
    var textLines = textarea.value.substr(0, textarea.selectionStart).split("\n");
    var currentLineNumber = textLines.length;
    var currentColumnIndex = textLines[textLines.length-1].length;
    document.getElementById('numColmn').innerHTML = "Line " + currentLineNumber+", Column " + currentColumnIndex;
}