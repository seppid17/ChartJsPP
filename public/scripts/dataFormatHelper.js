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

    static _recursiveUnlist(list, out){
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
    
    static unlist(list){
        var processedList = [];
        if (!DataFormatHelper._recursiveUnlist(list, processedList)) return null;
        return processedList;
    }
}