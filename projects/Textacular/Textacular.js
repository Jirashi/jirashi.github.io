let output = document.getElementById('output');
let fileName = document.getElementById('file-name');
let fileUpload = document.getElementById('file-upload');
let zoomAmnt = document.getElementById('set-zoom-btn');

let editors = document.getElementById('editors');
let htmlViewer = document.getElementById('html-viewer');

var undone = [];
var copiedText = "";

function newFile() {
    if (confirm("New file? All current text will be deleted.")) {
        output.innerHTML = "";
        fileName.value = `Untitled.${editors.className}`;
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
        &body=${output.value}`;
    }
}

function saveFile() {
    var fileType = "text/plain";
    if (editors.className == "txt") {
        fileType = "text/plain";
    } else if (editors.className == "html") {
        fileType = "text/html";
    }
    var file = new Blob([ output.value ], { type: fileType });
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
    if (output.value.length > 0) {
        if (confirm("Are you sure? All current text will be deleted.")) {
            output.value = "";
        }
    }
}

function Cut() {
    Copy()
    output.value = "";
}

function Paste() {
    output.value += copiedText
}

function slctAll() {
    output.select();
}

function Zoom(inout) {
    let fontSize = output.style.fontSize;
    var truFontSize = parseInt(fontSize.slice(0, fontSize.length - 2))
    if (inout) {var ZoomAmnt = 2;} else {var ZoomAmnt = -2;}
    if (truFontSize >= 32 || 6 > truFontSize) {
        output.style.fontSize = "18px";
        zoomAmnt.innerHTML = "18px"
    } else {
        output.style.fontSize = `${(truFontSize + ZoomAmnt)}px`;
        zoomAmnt.innerHTML = `${(truFontSize + ZoomAmnt)}px`;
    }
}

function setZoom() {
    var amnt = prompt("Choose size:", "6-32")
    if (amnt > 5 && amnt < 33) {
        amnt = `${amnt}px`;
        output.style.fontSize = amnt;
        zoomAmnt.innerHTML = amnt;
    }
}

function Theme() {
    document.body.classList.toggle('dark-theme');
}

function Type(type) {
    editors.classList.replace(editors.classList[0], type);
}

function Settings() {
    alert("Whoops! You've found a feature that hasn't yet been implemented, check back later.")
}

fileName.addEventListener('change', function() {
    if (fileName.value) {
        if (!fileName.value.endsWith(`.${editors.className}`)) {
            fileName.value += `.${editors.className}`;
        }
    } else {
        fileName.value = `Untitled.${editors.className}`
    }
});

fileUpload.addEventListener('change', function() {
    var file = fileUpload.files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            output.value = e.target.result;
        };
        console.log(file.type);
        fileName.value = file.name;
    }
});

output.addEventListener('change', function() {
    if (editors.className == "html") {
        document.getElementById('html-content').innerHTML = output.value;
    }
});