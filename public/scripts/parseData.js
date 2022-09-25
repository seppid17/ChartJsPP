function extractCSV(csv) {
    try {
        let lines = csv.split(/\r?\n|\r|\n/g);
        let json = {};
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (/^\s*$/.test(line)) continue;
            let data = line.split(/\s*,\s*/);
            if (data.length < 4) {
                console.log('len invalid', line);
                dropSpan.className = 'drop-span error'
                dropSpan.innerText = 'Error in data (Invalid length). Please check and upload again'
                fileSelectedNoError = false;
                return null;
            }

            let id = data[0].trim();
            if (!/^\d+$/.test(id)) {
                console.log('id invalid', line);
                dropSpan.className = 'drop-span error'
                dropSpan.innerText = 'Error in data (Invalid id). Please check and upload again'
                fileSelectedNoError = false;
                return null;
            }
            id = parseInt(id);
            if (id <= 0) {
                console.log('id invalid', line);
                dropSpan.className = 'drop-span error'
                dropSpan.innerText = 'Error in data (Invalid id). Please check and upload again'
                fileSelectedNoError = false;
                return null;
            }

            let parent = data[1].trim();
            if (!/^\d+$/.test(parent)) {
                console.log('par invalid', line);
                dropSpan.className = 'drop-span error'
                dropSpan.innerText = 'Error in data (Invalid parent). Please check and upload again'
                fileSelectedNoError = false;
                return null;
            }
            parent = parseInt(parent);
            if (parent >= id) {
                console.log('parent > id', line);
                dropSpan.className = 'drop-span error'
                dropSpan.innerText = 'Error in data (Parent > id). Please check and upload again'
                fileSelectedNoError = false;
                return null;
            }

            let name = data[2].trim();
            if (!/^[^\s]{1,32}$/.test(name)) {
                console.log('name invalid', line);
                dropSpan.className = 'drop-span error'
                dropSpan.innerText = 'Error in data (Invalid name). Please check and upload again'
                fileSelectedNoError = false;
                return null;
            }

            let vals = data.slice(3);
            if (vals.length < 1) {
                console.log('no values', line);
                dropSpan.className = 'drop-span error'
                dropSpan.innerText = 'Error in data (No values). Please check and upload again'
                fileSelectedNoError = false;
                return null;
            }
            let values = new Array();
            vals.forEach(val => {
                val = val.trim();
                if (isNaN(val)) {
                    console.log('value invalid', line);
                    dropSpan.className = 'drop-span error'
                    dropSpan.innerText = 'Error in data (Invalid values). Please check and upload again'
                    fileSelectedNoError = false;
                    return null;
                }
                let value = parseFloat(val);
                values.push(value);
            });

            if (json[id] !== undefined) {
                console.log('duplicate id', id);
                dropSpan.className = 'drop-span error'
                dropSpan.innerText = 'Error in data (Duplicate ids). Please check and upload again'
                fileSelectedNoError = false;
                return null;
            }

            json[id] = { n: name, v: values, p: parent, c: {} };
        }

        ids = Object.keys(json);
        ids.sort(function (a, b) { return a - b });
        ids.reverse();
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            let data = json[id];
            let parentId = data.p;
            delete data.p;
            if (parentId == 0) continue;
            delete json[id];
            let parent = json[parentId];
            if (!parent) {
                console.log('missing parent', data);
                dropSpan.className = 'drop-span error'
                dropSpan.innerText = 'Error in data (Missing parent). Please check and upload again'
                fileSelectedNoError = false;
                return null;
            }
            parent.c[id] = data;
        }
        return json;
    } catch (ex) {
        console.log(ex);
        return null;
    }
}

function removeIDs(json, list) {
    Object.keys(json).forEach(id => {
        var data = json[id];
        var children = [];
        data.c = removeIDs(data.c, children);
        list.push(data);
    });
    return list;
}

function parseCSV(csv) {
    try {
        let json = extractCSV(csv);
        let dataList = [];
        return removeIDs(json, dataList);
    } catch (ex) {
        console.log(ex);
        return null;
    }
}