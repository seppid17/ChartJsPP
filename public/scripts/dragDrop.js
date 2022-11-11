let extractedData = null;
let cb = (labels, values) => { };

const setCallback = callback => {
    cb = callback;
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
    if (isCSV(file.name)) {
        reader.readAsText(file);
        reader.onloadend = function () {
            extractedData = null;
            let data = reader.result;
            try {
                let parsedData = parseCSV(data);
                if (parsedData) {
                    extractedData = parsedData;
                    dropDivMsg('drop-span', 'File selected (' + file.name + '). You can draw chart or upload different file', true);
                }
            } catch (ex) {
                setErrorMsg(ex);
            }
        }
    } else {
        dropDivMsg('drop-span error', 'Invalid file type. Submit a .csv file', false);
    }
}

const handleFiles = files => {
    files = [...files];
    if (files.length != 1) {
        dropDivMsg('drop-span error', 'Multiple files were selected. Please select only one file', false);
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
            if (extractedData == null || extractedData.length == 0) return;
            chartViewDiv.style.display = 'block';
            alertDiv.style.display = 'none';
            cb(extractedData);
            document.getElementById('chartViewDiv').scrollIntoView();
        } else {
            alertDiv.style.display = 'none';
            dropDivMsg('drop-span error', 'No file selected. Please upload a file first', false);
        }
    } else {
        selectChartType.className = 'chart-type error';
        alertDiv.style.display = 'block';
        selectChartType.querySelector('small').innerText = "You didn't have selected a chart type";
        document.getElementById('uploadViewDiv').scrollIntoView();
    }
}

document.getElementById('selectFileBtn').onclick = e => {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.onchange = e => {
        var file = e.target.files[0];
        if (isCSV(file.name)) {
            extractFile(file);
        } else {
            dropDivMsg('drop-span error', 'Invalid file type. Please submit a .csv file', false);
        }
    }

    input.click();
}

document.getElementById("closeAlert").onclick = e => {
    alertDiv.style.display = 'none';
}

function isCSV(filename) {
    var parts = filename.split('.');
    var ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
        case 'csv': return true;
    } return false;
}

function setErrorMsg(msg) {
    dropDivMsg('drop-span error', msg, false);
}

function dropDivMsg(className, msg, isError) {
    dropSpan.className = className;
    dropSpan.innerText = msg;
    fileSelectedNoError = isError;
}