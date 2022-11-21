/**
 * Extract properties from the end of the file
 * and remove those lines from the array.
 * @param {Array} lines lines of the CSV file
 * @returns {object}
 */
function extractProperties(lines) {
    let properties = {};
    while (lines.length > 2) {
        // get the last line out of the array
        let lastLine = lines.pop().trim();

        // if it's empty, skip it
        if (lastLine.length == 0) continue;

        // separate by commas and trim to get the cells
        let data = lastLine.split(/\s*,\s*/).map(x => { return x.trim(); });
        if (data.length == 0 || data[0].length == 0) continue; // no data in it

        if (data.length >= 3 && data[0].toLowerCase().startsWith('prop')) {
            let propName = data[1];
            let propValue = data[2];
            switch (propName) {
                // chart type
                case 'type':
                    if (['bar', 'pie', 'line', 'doughnut', 'polarArea', 'radar', 'scatter', 'bubble', 'sunburst', 'treemap', 'icicle'].includes(propValue))
                        properties.type = propValue;
                    break;

                // chart name
                case 'name':
                    if (FormUtils.chart_name_pattern.test(propValue))
                        properties.name = propValue;
                    break;

                // text font size
                case 'fontSize':
                    if (/^\d{1,3}$/.test(propValue))
                        properties.fontSize = propValue;
                    break;

                // text font style
                case 'fontStyle':
                    if (['normal', 'italic'].includes(propValue))
                        properties.fontStyle = propValue;
                    break;

                // text font weight
                case 'fontWeight':
                    if (['normal', 'bold'].includes(propValue))
                        properties.fontWeight = propValue;
                    break;

                // declare the chart as a basic chart type
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
            // restore last line since it is not a part of properties
            lines.push(lastLine);
            break;
        }
    }
    return properties;
}

/**
 * Extract the data, titles, and properties from the CSV file.
 * @param {string} csv contents of the CSV file
 * @returns {object}
 */
function extractCSV(csv) {
    try {
        // separate the lines
        let lines = csv.split(/\r?\n|\r|\n/g);

        // extract the properties
        let properties = extractProperties(lines);

        // if remaining lines are not sufficient,
        if (lines.length < 1 || (lines.length == 1 && lines[0].trim() == '')) {
            throw 'Empty data file';
        }

        // decide whether or not the 2nd column is the parent ID column
        let noParentColumn = false;
        let forceNoParentColumn = false;
        if (properties.hasOwnProperty('simple') && properties.simple > 0) {
            noParentColumn = true;
            if (properties.simple == 2) {
                forceNoParentColumn = true;
            }
        }
        let hasParentColumn = !noParentColumn;

        // starting index of the data lines
        let start = 0;

        // titles from the heading of the table
        let titles = [];

        // table body
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

                // remove the empty cells from titles
                while (titles[titles.length - 1] == '') titles.pop();
                start++;
            }
        }

        // iterate through table body rows
        for (let i = start; i < lines.length; i++) {
            const line = lines[i];

            // empty line
            if (/^\s*$/.test(line)) continue;

            // separate the cells
            let data = line.split(/\s*,\s*/).map(x => { return x.trim(); });

            // no data in cells
            if (data.length == 0 || data[0].length == 0) continue;

            // if no parent column is present, use 0 as parent.
            if (!hasParentColumn) {
                data.splice(1, 0, '0');
            }

            // ignore the parent column
            if (noParentColumn) {
                data[1] = '0';
            }

            // remove empty cells from the end of the row
            while (data[data.length - 1] == '') data.pop();

            // length of data (without ID and parent fields) must be same as title
            if ((titles.length > 0 && data.length - 2 !== titles.length) || (data.length - 2 < 2)) {
                throw 'Invalid data. Please check and upload again';
            }

            // ID
            let id = data[0];
            if (!/^\d+$/.test(id)) {
                throw 'Invalid id. Please check and upload again';
            }

            id = parseInt(id);
            if (id <= 0) {
                throw 'Invalid id. Please check and upload again';
            }

            // parent ID
            let parent = data[1];
            if (!/^\d+$/.test(parent)) {
                throw 'Invalid parent. Please check and upload again';
            }

            parent = parseInt(parent);
            if (parent >= id) {
                throw 'Parent id equal or greater than its own id. Please check and upload again';
            }

            // label
            let name = data[2];
            if (!/^[^\s]{1,32}$/.test(name)) {
                throw 'Invalid name. Please check and upload again';
            }

            // remaining values
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

            // this ID is already present
            if (typeof body[id] !== 'undefined') {
                throw 'Duplicate ids. Please check and upload again';
            }

            body[id] = { n: name, v: values, p: parent, c: {} };
        }

        ids = Object.keys(body);
        if (ids.length == 0) {
            throw 'No data in file';
        }

        // get the row IDs in discending order
        ids.sort(function (a, b) { return b - a });

        // append nodes as child nodes of parent nodes
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];

            // get the node
            let data = body[id];
            let parentId = data.p;
            delete data.p;

            // this node is at the root level
            if (parentId == 0) continue;

            // remove it from root
            delete body[id];
            let parent = body[parentId];
            if (!parent) {
                throw 'Missing parent. Please check and upload again';
            }

            // add it as a child of parent
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

/**
 * Remove the ID attribute from objects and put the values in a list
 * @param {object} json 
 * @param {Array} list 
 * @returns {Array}
 */
function removeIDs(json, list) {
    Object.keys(json).forEach(id => {
        let data = json[id];
        let children = [];
        data.c = removeIDs(data.c, children);
        list.push(data);
    });
    return list;
}

/**
 * Parse the CSV file data and separate title, body and properties
 * @param {string} csv content of the CSV file
 * @returns {object}
 */
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