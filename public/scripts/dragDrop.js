let json = null;
let cb = (labels, values) => { };

const setCallback = callback => {
    cb = callback;
}

function getLabels() {
    if (json == null) return null;
    let labels = [];
    Object.keys(json).forEach(id => {
        labels.push(json[id].n);
    });
    return labels;
}

function getValues() {
    if (json == null) return null;
    let values = [];
    Object.keys(json).forEach(id => {
        values.push(json[id].v);
    });
    return values;
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

let dropArea = document.getElementById('dropDiv');
let dropSpan = document.getElementById('dropSpan');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

const extractFile = file => {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = function () {
        let data = reader.result;
        let jsonData = csv2json(data);
        if (jsonData) {
            json = jsonData;
            dropSpan.innerText = 'File selected. You can draw chart or upload different file'
        }
    }
}

const handleFiles = files => {
    files = [...files];
    if (files.length != 1) {
        console.log("Put only one file");
        return;
    }
    extractFile(files[0]);
}

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files);
}
dropArea.addEventListener('drop', handleDrop, false);

document.getElementById('drawBtn').onclick = e => {
    chartViewDiv.style.display='block';
    let labels = getLabels();
    let values = getValues();
    if (labels==null || values==null) return;
    cb(labels, values);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
}

document.getElementById('selectFileBtn').onclick = e => {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        var file = e.target.files[0];
        extractFile(file);
    }

    input.click();
}