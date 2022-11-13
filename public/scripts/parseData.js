function extractCSV(csv) {
    try {
        let lines = csv.split(/\r?\n|\r|\n/g);
        if (lines.length < 1 || (lines.length==1 && lines[0].trim()=='')) {
            throw 'Empty data file';
        }
        let start = 1;
        let head = lines[0].split(/\s*,\s*/);
        let titles = [];
        let body = {};
        if (head.length > 2 && head[0].toLowerCase() == 'id') {
            titles = head.slice(2);
        } else {
            start = 0;
        }
        for (let i = start; i < lines.length; i++) {
            const line = lines[i];
            if (/^\s*$/.test(line)) continue;
            let data = line.split(/\s*,\s*/);
            // length of data (without ID and parent fields) must be same as title
            if ((titles.length > 0 && data.length - 2 !== titles.length) || (data.length < 4)) {
                throw 'Invalid data. Please check and upload again';
            }

            let id = data[0].trim();
            if (!/^\d+$/.test(id)) {
                throw 'Invalid id. Please check and upload again';
            }

            id = parseInt(id);
            if (id <= 0) {
                throw 'Invalid id. Please check and upload again';
            }

            let parent = data[1].trim();
            if (!/^\d+$/.test(parent)) {
                throw 'Invalid parent. Please check and upload again';
            }

            parent = parseInt(parent);
            if (parent >= id) {
                throw 'Parent id equal or greater than its own id. Please check and upload again';
            }

            let name = data[2].trim();
            if (!/^[^\s]{1,32}$/.test(name)) {
                throw 'Invalid name. Please check and upload again';
            }

            let vals = data.slice(3);
            if (vals.length < 1) {
                throw 'No values. Please check and upload again';
            }

            let values = new Array();
            if (!vals.every(val => {
                val = val.trim();
                if (val == '' || isNaN(val)) {
                    throw 'Invalid values. Please check and upload again';
                }
                let value = parseFloat(val);
                values.push(value);
                return true;
            })) throw null;

            if (typeof body[id] !== 'undefined') {
                throw 'Duplicate ids. Please check and upload again';
            }

            body[id] = { n: name, v: values, p: parent, c: {} };
        }

        ids = Object.keys(body);
        if (ids.length == 0) {
            throw 'No data in file';
        }
        ids.sort(function (a, b) { return a - b });
        ids.reverse();
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            let data = body[id];
            let parentId = data.p;
            delete data.p;
            if (parentId == 0) continue;
            delete body[id];
            let parent = body[parentId];
            if (!parent) {
                throw 'Missing parent. Please check and upload again';
            }
            parent.c[id] = data;
        }

        return { title: titles, data: body };
    } catch (ex) {
        if (ex) {
            throw ex;
        }
        throw 'Error in data. Please check and upload again';
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
        if (json == null) { return null; }
        let dataList = [];
        json.data = removeIDs(json.data, dataList);
        return json;
    } catch (ex) {
        throw new Error(ex);
    }
}

if (typeof module !== 'undefined') {
    module.exports = { parseCSV };
}