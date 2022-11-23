class DataFormatHelper {
    /**
     * Recursively traverse through nodes and replace
     * the value array with the value in it.
     * @param {Array} list input list of nodes
     * @param {Array} out output list of nodes
     * @returns {void}
     */
    static _recursiveUnlist(list, out) {
        let success = true;
        list.forEach(item => {
            let unlistC = [];
            if (!DataFormatHelper._recursiveUnlist(item.c, unlistC)) {
                success = false;
                return;
            }
            if (item.v.length !== 1) {
                success = false;
                return;
            }
            let unlistItem = { n: item.n, v: item.v[0], c: unlistC };
            out.push(unlistItem);
        });
        return success;
    }

    /**
     * Traverse through nodes and replace
     * the value array with the value in it.
     * @param {Array} list input list of nodes
     * @returns {Array}
     */
    static unlist(list) {
        let processedList = [];
        if (!DataFormatHelper._recursiveUnlist(list, processedList)) return null;
        return processedList;
    }

    /**
     * Recursively traverse through nodes and calculate the
     * weights of nodes relative to thier sibling nodes.
     * @param {Array} data array of nodes
     * @param {object} parent parent node
     * @returns {object}
     */
    static _recursiveProcess(data, parent) {
        let processedData = [];
        let maxDepth = 0;
        data.forEach(item => {
            let newItem = {
                v: item.v,
                n: item.n,
                p: parent
            }
            if (typeof item.clr != 'undefined') newItem.clr = item.clr;
            let children, depth, childSum;
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
        let total = 0;
        processedData.forEach(item => { total += item.v; });
        processedData.forEach(item => {
            item.w = total != 0 ? item.v / total : 0;
        });
        return [processedData, maxDepth + 1, total];
    }

    /**
     * Traverse through nodes and calculate the
     * weights of nodes relative to thier sibling nodes.
     * @param {Array} data array of nodes
     * @returns {object}
     */
    static preProcess(data) {
        let processedData, maxDepth, total;
        let root = { n: '/', v: 1, w: 1 };
        [processedData, maxDepth, total] = this._recursiveProcess(data, root);
        root.d = maxDepth - 1;
        root.c = processedData;
        return root;
    }
}

if (typeof module !== 'undefined') {
    module.exports = DataFormatHelper;
}