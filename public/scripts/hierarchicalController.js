class HierarchicalController extends Chart.PieController {
    _drawIndex = 0;

    _setAreaCoordinates() {
        var ctx = this.chart.ctx;
        var canvas = ctx.canvas;
        this.startX = 0;
        this.startY = 0;
        this.endX = parseFloat(canvas.style.width);
        this.endY = parseFloat(canvas.style.height);
        var legend = this.chart.legend;
        if (!legend) return;
        if (legend.position == 'top') {
            this.startY = legend.bottom;
        } else if (legend.position == 'bottom') {
            this.endY = legend.top;
        } else if (legend.position == 'left') {
            this.startX = legend.right;
        } else if (legend.position == 'right') {
            this.endX = legend.left;
        }
    }

    update(mode) {
        super.update(mode);
        this._setAreaCoordinates();
        if (mode == 'resize' || mode == 'default' || mode == 'reset' || mode == 'none')
            this.draw();
    }

    _makeTree(data, levelIndex, parent) {
        if (this.tree[levelIndex] == undefined) {
            this.tree[levelIndex] = [];
        }
        var level = this.tree[levelIndex];
        var totWeight = 0;
        data.forEach(item => {
            totWeight += item.v;
        });
        var prevWeight = 0;
        data.forEach(item => {
            var weight = item.v / totWeight;
            var treeItem = {
                pw: prevWeight,
                w: weight,
                p: parent
            }
            prevWeight += weight;
            var myIndex = level.push(treeItem) - 1;
            this._makeTree(item.c, levelIndex + 1, myIndex);
        });
    }

    _processTree(minValue, maxValue) {
        for (let n = 0; n < this.tree.length; n++) {
            var prevRow = n == 0 ? [{ s: minValue, e: maxValue }] : this.tree[n - 1];
            var row = this.tree[n];
            row.forEach(elem => {
                var parent = prevRow[elem.p];
                var parentRange = parent.e - parent.s;
                var myRange = parentRange * elem.w;
                var prevPos = parent.s + parentRange * elem.pw;
                elem.s = prevPos;
                elem.e = prevPos + myRange;
                elem.n = n;
                delete elem.p;
                delete elem.w;
                delete elem.pw;
            });
        }
        // flatten the tree
        var flatTree = [];
        this.tree.forEach(row => {
            row.forEach(elem => {
                flatTree.push(elem);
            });
        });
        this.tree = flatTree;
    }

    draw() {
        if (this.endX == undefined) {
            this._setAreaCoordinates();
        }
        var meta = this.getMeta();
        var data = meta._dataset.tree;
        this.tree = [];
        this._makeTree(data, 0, 0);
        if (this.tree[this.tree.length - 1].length == 0) this.tree.length -= 1;
        this._drawIndex = 0;
    }
}