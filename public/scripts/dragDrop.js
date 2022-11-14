const dropArea = document.getElementById('dropDiv');
const dropSpan = document.getElementById('dropSpan');

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;

    FileInputManager.handleFiles(files);
}

dropArea.addEventListener('drop', handleDrop, false);

document.getElementById('selectFileBtn').onclick = e => {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.onchange = e => {
        var file = e.target.files[0];
        FileInputManager.extractFile(file);
    }

    input.click();
}

document.getElementById("closeAlert").onclick = e => {
    alertDiv.style.display = 'none';
}

class FileInputManager {

    static extractedData = null;
    static fileSelectedNoError = false;

    static _isCSV(filename) {
        var parts = filename.split('.');
        var ext = parts[parts.length - 1];
        return ext.toLowerCase() === 'csv';
    }

    static _dropDivMsg(msg, isError) {
        if (isError) {
            dropSpan.classList.add('error');
        } else {
            dropSpan.classList.remove('error');
        }
        dropSpan.innerText = msg;
        FileInputManager.fileSelectedNoError = !isError;
    }

    static _setErrorMsg(msg) {
        FileInputManager._dropDivMsg(msg, true);
    }

    static extractFile(file) {
        let reader = new FileReader();
        if (FileInputManager._isCSV(file.name)) {
            reader.readAsText(file);
            reader.onloadend = function () {
                FileInputManager.extractedData = null;
                let data = reader.result;
                try {
                    let parsedData = parseCSV(data);
                    if (parsedData && !parsedData.properties.hasOwnProperty('name')) {
                        let nameList = file.name.split('.');
                        nameList.pop();
                        parsedData.properties.name = nameList.join('.');
                    }
                    if (parsedData) {
                        FileInputManager.extractedData = parsedData;
                        FileInputManager._dropDivMsg('File selected (' + file.name + '). You can draw chart or upload different file', false);
                        if (parsedData.properties.hasOwnProperty('type') && parsedData.properties.type.length > 0) {
                            setSelectedChartType(parsedData.properties.type);
                        }else if (getSelectedChartType()!=null){
                            drawBtnDiv.hidden = false;
                        }
                    }
                } catch (ex) {
                    FileInputManager._setErrorMsg(ex);
                }
            }
        } else {
            FileInputManager._setErrorMsg('Invalid file type. Submit a .csv file');
        }
    }

    static handleFiles(files) {
        files = [...files];
        if (files.length != 1) {
            FileInputManager._setErrorMsg('Multiple files were selected. Please select only one file');
            return;
        }
        FileInputManager.extractFile(files[0]);
    }

    static draw(callback) {
        if (FileInputManager.fileSelectedNoError) {
            if (FileInputManager.extractedData == null || FileInputManager.extractedData.length == 0) return;
            callback(FileInputManager.extractedData);
        } else {
            alertDiv.style.display = 'none';
            FileInputManager._setErrorMsg('No file selected. Please upload a file first');
        }
    }
}