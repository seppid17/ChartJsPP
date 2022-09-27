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
                setErrorMsg('Insufficent data (line ' + i++ + '). Please check and upload again');
                return null;
            }

            let id = data[0].trim();
            if (!/^\d+$/.test(id)) {
                console.log('id invalid', line);
                setErrorMsg('Invalid id (line ' + i++ + '). Please check and upload again');
                return null;
            }

            id = parseInt(id);
            if (id <= 0) {
                console.log('id invalid', line);
                setErrorMsg('Invalid id (line ' + i++ + '). Please check and upload again');
                return null;
            }

            let parent = data[1].trim();
            if (!/^\d+$/.test(parent)) {
                console.log('par invalid', line);
                setErrorMsg('Invalid parent (line ' + i++ + '). Please check and upload again');
                return null;
            }

            parent = parseInt(parent);
            if (parent >= id) {
                console.log('parent > id', line);
                setErrorMsg('Invalid parent id (line ' + i++ + '). Please check and upload again');
                return null;
            }

            let name = data[2].trim();
            if (!/^[^\s]{1,32}$/.test(name)) {
                console.log('name invalid', line);
                setErrorMsg('Invalid name (line ' + i++ + '). Please check and upload again');
                return null;
            }

            let vals = data.slice(3);
            if (vals.length < 1) {
                console.log('no values', line);
                setErrorMsg('No values (line ' + i++ + '). Please check and upload again');
                return null;
            }

            let values = new Array();
            if (!vals.every(val => {
                val = val.trim();
                if (val == '' || isNaN(val)) {
                    console.log('value invalid', line);
                    setErrorMsg('Invalid values (line ' + i++ + '). Please check and upload again');
                    return false;
                }
                let value = parseFloat(val);
                values.push(value);
                return true;
            })) return null;

            if (json[id] !== undefined) {
                console.log('duplicate id', id);
                setErrorMsg('Duplicate ids (line ' + i++ + '). Please check and upload again');
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
                setErrorMsg('Missing parent (line ' + i++ + '). Please check and upload again');
                return null;
            }
            parent.c[id] = data;
        }
        return json;
    } catch (ex) {
        console.log(ex);
        setErrorMsg('Error in data. Please check and upload again');
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
        if (json == null) { return null; }
        let dataList = [];
        return removeIDs(json, dataList);
    } catch (ex) {
        try
        {
            console.log(ex);
            setErrorMsg('Error in data. Please check and upload again');
            return null;
        }
        catch(ex){
            return null;
        }
        
    }
}
module.exports = {parseCSV};