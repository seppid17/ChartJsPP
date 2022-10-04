class DataFormatHelper {
    static _recursiveUnlist(list, out) {
        var success = true;
        list.forEach(item => {
            var unlistC = [];
            if (!DataFormatHelper._recursiveUnlist(item.c, unlistC)) {
                success = false;
                return;
            }
            if (item.v.length !== 1) {
                success = false;
                console.log('invalid list', item);
                return;
            }
            var unlistItem = { n: item.n, v: item.v[0], c: unlistC };
            out.push(unlistItem);
        });
        return success;
    }

    static unlist(list) {
        var processedList = [];
        if (!DataFormatHelper._recursiveUnlist(list, processedList)) return null;
        return processedList;
    }

    static _recursiveProcess(data, parent) {
        var processedData = [];
        var maxDepth = 0;
        data.forEach(item => {
            var newItem = {
                v: item.v,
                n: item.n,
                p: parent
            }
            if (typeof item.clr != 'undefined') newItem.clr = item.clr;
            var children, depth, childSum;
            [children, depth, childSum] = DataFormatHelper._recursiveProcess(item.c, newItem);
            newItem.d = depth - 1;
            newItem.c = children;
            if (newItem.v < 0) {
                newItem.v = childSum;
            }
            if (depth > maxDepth) {
                maxDepth = depth;
            }
            processedData.push(newItem);
        });
        var total = 0;
        processedData.forEach(item => { total += item.v; });
        processedData.forEach(item => {
            item.w = total != 0 ? item.v / total : 0;
        });
        return [processedData, maxDepth + 1, total];
    }

    static preProcess(data) {
        var processedData, maxDepth, total;
        var root = { n: '/', v: 1, w: 1 };
        [processedData, maxDepth, total] = this._recursiveProcess(data, root);
        root.d = maxDepth - 1;
        root.c = processedData;
        return root;
    }
}

if (typeof module !== 'undefined') {
    module.exports = DataFormatHelper;
}