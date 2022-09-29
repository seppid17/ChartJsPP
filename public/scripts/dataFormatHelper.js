class DataFormatHelper {
    static _recursesBFStree(data, tree, levelIndex, parent) {
        if (typeof tree[levelIndex] == 'undefined') {
            tree[levelIndex] = [];
        }
        var level = tree[levelIndex];
        data.forEach(item => {
            var treeItem = {
                n: item.n,
                v: item.v,
                p: parent
            }
            var myIndex = level.push(treeItem) - 1;
            DataFormatHelper._recursesBFStree(item.c, tree, levelIndex + 1, myIndex);
        });
    }

    static makeBFStree(data) {
        var tree = [];
        DataFormatHelper._recursesBFStree(data, tree, 0, 0);
        if (tree[tree.length - 1].length == 0) tree.length -= 1;
        return tree;
    }

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

    static _recursiveProcess(data) {
        var processedData = [];
        var totWeight = 0;
        data.forEach(item => { totWeight += item.v; });
        var prevWeight = 0;
        var maxDepth = 0;
        data.forEach(item => {
            var weight = item.v / totWeight;
            var newItem = {
                v: item.v,
                n: item.n,
                w: weight,
                pw: prevWeight
            }
            prevWeight += weight;
            var children, depth;
            [children, depth] = DataFormatHelper._recursiveProcess(item.c);
            newItem.d = depth-1;
            newItem.c = children;
            if (depth > maxDepth) {
                maxDepth = depth;
            }
            processedData.push(newItem);
        });
        return [processedData, maxDepth + 1];
    }

    static preprocess(data) {
        var processedData, maxDepth;
        [processedData, maxDepth] = this._recursiveProcess(data);
        return { n: '/', v: 1, w: 1, pw: 0, d: maxDepth-1, c: processedData };
    }
}