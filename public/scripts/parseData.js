function extractProperties(lines) {
    let properties = {};
    while (lines.length > 2) {
        let lastLine = lines.pop().trim();
        if (lastLine.length == 0) continue;
        let data = lastLine.split(/\s*,\s*/).map(x => { return x.trim(); });
        if (data.length == 0 || data[0].length == 0) continue;

        if (data.length >= 3 && data[0].toLowerCase().startsWith('prop')) {
            let propName = data[1];
            let propValue = data[2];
            switch (propName) {
                case 'type':
                    if (['bar', 'pie', 'line', 'doughnut', 'polarArea', 'radar', 'scatter', 'bubble', 'sunburst', 'treemap', 'icicle'].includes(propValue))
                        properties.type = propValue;
                    break;

                case 'name':
                    if (FormUtils.chart_name_pattern.test(propValue))
                        properties.name = propValue;
                    break;

                case 'fontSize':
                    if (/^\d{1,3}$/.test(propValue))
                        properties.fontSize = propValue;
                    break;

                case 'fontStyle':
                    if (['normal', 'italic'].includes(propValue))
                        properties.fontStyle = propValue;
                    break;

                case 'fontWeight':
                    if (['normal', 'bold'].includes(propValue))
                        properties.fontWeight = propValue;
                    break;

                case 'simple':
                    propValue = propValue.toLowerCase();
                    if (propValue.startsWith('t') || propValue.startsWith('y')) {
                        properties.simple = 1;
                    } else if (propValue == 'force') {
                        properties.simple = 2;
                    }
                    break;

                default:
                    break;
            }
        } else {
            lines.push(lastLine); // restore last line since it is not a part of properties
            break;
        }
    }
    return properties;
}

function extractCSV(csv) {
    try {
        let lines = csv.split(/\r?\n|\r|\n/g);
        let properties = extractProperties(lines);
        if (lines.length < 1 || (lines.length == 1 && lines[0].trim() == '')) {
            throw 'Empty data file';
        }
        let noParentColumn = false;
        let forceNoParentColumn = false;
        if (properties.hasOwnProperty('simple') && properties.simple > 0) {
            noParentColumn = true;
            if (properties.simple == 2) {
                forceNoParentColumn = true;
            }
        }
        let hasParentColumn = !noParentColumn;

        let start = 0;
        let titles = [];
        let body = {};

        // remove empty lines from the begining
        while (true) {
            if (start >= lines.length) {
                throw 'No data table found. Please check the file.';
            }
            let row = lines[start].split(/\s*,\s*/).map(x => { return x.trim(); });
            if (row.length > 1 && row[0].length > 0) {
                break;
            }
            start++;
        }

        // extract heading row if exists
        {
            let head = lines[start].split(/\s*,\s*/).map(x => { return x.trim(); });

            if (head.length > 2 && head[0].toLowerCase() == 'id') {
                if (!noParentColumn || !forceNoParentColumn && head[1].toLowerCase() == 'parent') {
                    hasParentColumn = true;
                }
                if (hasParentColumn) {
                    titles = head.slice(2);
                } else {
                    titles = head.slice(1);
                }
                while (titles[titles.length - 1] == '') titles.pop();
                start++;
            }
        }

        for (let i = start; i < lines.length; i++) {
            const line = lines[i];
            if (/^\s*$/.test(line)) continue;
            let data = line.split(/\s*,\s*/).map(x => { return x.trim(); });
            if (data.length == 0 || data[0].length == 0) continue;

            if (!hasParentColumn) {
                data.splice(1, 0, '0');
            }

            if (noParentColumn) {
                data[1] = '0';
            }

            while (data[data.length - 1] == '') data.pop();

            // length of data (without ID and parent fields) must be same as title
            if ((titles.length > 0 && data.length - 2 !== titles.length) || (data.length - 2 < 2)) {
                throw 'Invalid data. Please check and upload again';
            }

            let id = data[0];
            if (!/^\d+$/.test(id)) {
                throw 'Invalid id. Please check and upload again';
            }

            id = parseInt(id);
            if (id <= 0) {
                throw 'Invalid id. Please check and upload again';
            }

            let parent = data[1];
            if (!/^\d+$/.test(parent)) {
                throw 'Invalid parent. Please check and upload again';
            }

            parent = parseInt(parent);
            if (parent >= id) {
                throw 'Parent id equal or greater than its own id. Please check and upload again';
            }

            let name = data[2];
            if (!/^[^\s]{1,32}$/.test(name)) {
                throw 'Invalid name. Please check and upload again';
            }

            let vals = data.slice(3);
            if (vals.length < 1) {
                throw 'No values. Please check and upload again';
            }

            let values = new Array();
            if (!vals.every(val => {
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

        return { title: titles, data: body, properties: properties };
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