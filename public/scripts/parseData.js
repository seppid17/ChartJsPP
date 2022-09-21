function csv2json(csv) {
    let lines = csv.split(/\r?\n|\r|\n/g);
    let json = {};
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^\s*$/.test(line)) continue;
        let data = line.split(/\s*,\s*/);
        if (data.length < 3 || data.length > 4) {
            console.log('len invalid', line);
            return null;
        }

        let id = data[0];
        if (!/^\d+$/.test(id)) {
            console.log('id invalid', line);
            return null;
        }
        id = parseInt(id);
        if (id <= 0) {
            console.log('id invalid', line);
            return null;
        }

        let name = data[1];
        if (!/^[^\s]{1,32}$/.test(name)) {
            console.log('name invalid', line);
            return null;
        }

        let value = data[2];
        if (isNaN(value)) {
            console.log('value invalid', line);
            return null;
        }
        value = parseFloat(value);

        if (json[id] !== undefined) {
            console.log('duplicate id', id);
            return null;
        }

        let parent = 0;
        if (data.length > 3) {
            let par = data[3];
            if (!/^\d+$/.test(par)) {
                console.log('par invalid', line);
                return null;
            }
            par = parseInt(par);
            if (par <= 0) {
                console.log('par invalid', line);
                return null;
            }
            if (par >= id) {
                console.log('par > id', line);
                return null;
            }
            parent = par;
        }
        json[id] = { n: name, v: value, p: parent, c: {} };
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
            return null;
        }
        parent.c[id] = data;
    }
    return json;
}