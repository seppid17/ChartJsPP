let extractedData = null;
let cb = (labels, values) => { };

const setCallback = callback => {
    cb = callback;
}

function getLabels() {
    if (extractedData == null) return null;
    let labels = [];
    extractedData.forEach(item => {
        labels.push(item.n);
    });
    return labels;
}

function getValues() {
    if (extractedData == null) return null;
    let values = [];
    extractedData.forEach(item => {
        values.push({ v: item.v, c: item.c });
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

let fileSelectedNoError = false;

const extractFile = file => {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = function () {
        extractedData = null;
        let data = reader.result;
        let parsedData = parseCSV(data);
        if (parsedData) {
            extractedData = parsedData;
            dropSpan.className = 'drop-span'
            dropSpan.innerText = 'File selected (' + file.name + '). You can draw chart or upload different file'
            fileSelectedNoError = true;
        }
    }
}

const handleFiles = files => {
    files = [...files];
    if (files.length != 1) {
        console.log("Put only one file");
        dropSpan.className = 'drop-span error'
        dropSpan.innerText = 'Multiple files were selected. Please select only one file';
        fileSelectedNoError = false;
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

let selectChartType = document.getElementById('selectChartType');

document.getElementById('drawBtn').onclick = e => {
    selectChartType.className = 'chart-type';
    let found = false;
    for (i = 0; i < types.length; i++) {
        if (types[i].checked) {
            found = true;
        }
    }
    if (found) {
        if (fileSelectedNoError) {
            chartViewDiv.style.display = 'block';
            let labels = getLabels();
            let values = getValues();
            if (labels == null || values == null) return;
            cb(labels, values);
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        } else {
            dropSpan.className = 'drop-span error'
            dropSpan.innerText = 'No file selected. Please upload a file first'
        }
    } else {
        selectChartType.className = 'chart-type error';
        selectChartType.querySelector('small').innerText = "You didn't have selected a chart type. Please select one first";
        document.getElementById('uploadViewDiv').scrollIntoView();
    }
}

document.getElementById('selectFileBtn').onclick = e => {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.onchange = e => {
        var file = e.target.files[0];
        extractFile(file);
    }

    input.click();
}