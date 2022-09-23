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

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

const previewFile = file => {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = function () {
        let data = reader.result;
        let jsonData = csv2json(data);
        if (jsonData) {
            json = jsonData;
        }
    }
}

const handleFiles = files => {
    files = [...files];
    if (files.length != 1) {
        console.log("Put only one file");
        return;
    }
    previewFile(files[0]);
}

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files);
}
dropArea.addEventListener('drop', handleDrop, false);

document.getElementById('drawBtn').onclick = e => {
    let labels = getLabels();
    let values = getValues();
    if (labels==null || values==null) return;
    cb(labels, values);
}