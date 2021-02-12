let output = document.getElementById('output');
let fileName = document.getElementById('file-name');
var undone = [];
var copiedText = "";
// buttons
let fileNew = document.getElementById('file-new-btn');
let fileOpen = document.getElementById('file-open-btn');
let fileSave = document.getElementById('file-save-btn');
let fileSaveAs = document.getElementById('file-saveas-btn');
let fileEmail = document.getElementById('file-email-btn');

let editUndo = document.getElementById('edit-undo-btn');
let editRedo = document.getElementById('edit-redo-btn');
let editCopy = document.getElementById('edit-copy-btn');
let editPaste = document.getElementById('edit-paste-btn');
let editCut = document.getElementById('edit-cut-btn');
let editClear = document.getElementById('edit-clear-btn');
let editSelectAll = document.getElementById('edit-slctall-btn');

let setZoomIn = document.getElementById('set-zoomin-btn');
let setZoomOut = document.getElementById('set-zoomout-btn');
let setTheme = document.getElementById('set-theme-btn');
let setSettings = document.getElementById('set-settings-btn');
let fileUpload = document.getElementById('file-upload');

function newFile() {
    if (confirm("New file? All current text will be deleted.")) {
        output.innerHTML = "";
        fileName.value = "Untitled.txt";
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
        ?subject=${fileName.value.slice(0, fileName.value.length - 4)}
        &body=${output.value}`;
    }
}

function saveFile() {
    var file = new Blob([ output.value ], { type: 'text/plain' });
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
    if (prompt("Save As:", fileName.value)) {saveFile();}
}

function Undo() {
    let last = undone.length
    if (last < 101) {
        undone.push(output.value.slice(output.value.length - 1));
        output.value = output.value.slice(0, output.value.length - 1)
    }
}

function Redo() {
    let last = undone.length - 1;
    if (last > -1) {
        output.value += undone[last];
        undone.splice(last, 1)
    }
}

function Copy() {
    copiedText = output.value;
    output.select();
    output.setSelectionRange(0, 99999)
    document.execCommand("copy");
}

function Clear() {
    output = "";
}

function Cut() {
    Copy()
    Clear()
}

function Paste() {
    output.value += copiedText
}

function slctAll() {
    output.select();
}

function ZoomIn() {
    let fontSize = output.style.fontSize;
    var truFontSize = fontSize.slice(0, fontSize.length - 2)
    console.log(truFontSize)
    if (truFontSize >= 50) {
        output.style.fontSize = "18px";
    } else {
        output.style.fontSize = `${(truFontSize + 2)}px`;
    }
}

function ZoomOut() {
    let fontSize = output.style.fontSize;
    var truFontSize = fontSize.slice(0, fontSize.length - 2)
    console.log(truFontSize)
    if (truFontSize >= 10) {
        output.style.fontSize = "18px";
    } else {
        output.style.fontSize = `${(truFontSize - 2)}px`;
    }
}

fileName.addEventListener('change', function() {
    if (fileName.value) {
        if (!fileName.value.endsWith('.txt')) {
            fileName.value += '.txt';
        }
    } else {
        fileName.value = 'Untitled.txt'
    }
});

document.getElementById('set-theme-btn').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');  
});

fileUpload.addEventListener('change', function() {
    var file = fileUpload.files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            output.value = e.target.result;
        };
    }
    fileName.value = file.name;
});