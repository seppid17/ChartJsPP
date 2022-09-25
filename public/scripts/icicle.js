class IcicleController extends Chart.PieController {
    _processedData = [];
    _uninitialized = true;

    update(mode) {
        super.update();
        this._processedData = [];
        this.draw();
    }

    _drawRect(ctx, x0, y0, width, height, color = 'black') {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.rect(x0, y0, width, height);
        ctx.fill();
        ctx.restore();
    }

    _recurseTree(list) {
        var totWeight = 0;
        var newList = [];
        var maxDepth = -1
        list.forEach(item => {
            totWeight += item.v;
            newList.push({ v: item.v, w: item.v, c: item.c });
        });
        newList.forEach(item => {
            item.w = item.w / totWeight;
            var listDepth = this._recurseTree(item.c);
            item.c = listDepth[0];
            if (maxDepth < listDepth[1]) {
                maxDepth = listDepth[1];
            }
        });
        return [newList, maxDepth + 1];
    }

    _drawSubChart(ctx, data, x0, y0, unitWidth, totHeight, remaining) {
        if (remaining <= 0) return;
        var bgcols = this.$context.dataset.backgroundColor;
        data.forEach(item => {
            var weight = item.w;
            var height = totHeight * weight;
            var y1 = y0 + height;
            var i = this._processedData.length + 1;
            var color = `rgba(${(167 * i) % 256},${(71 * i) % 256},${(203 * i) % 256},1)`;
            if (this._uninitialized) bgcols.push(color);
            this._processedData.push({ v: item.v, x: x0, y: y0, w:unitWidth, h:height });
            this._drawRect(ctx, x0, y0, unitWidth, height, color);
            this._drawSubChart(ctx, item.c, x0+unitWidth, y0, unitWidth, height, remaining - 1);
            y0 = y1;
        });
    }

    draw() {
        var ctx = this.chart.ctx;
        var canvas = ctx.canvas;
        
        if (this._processedData.length == 0) {
            var data = this._data;
            var [tree, maxDepth] = this._recurseTree(data);
            maxDepth = Math.min(maxDepth, 5);

            var hw = Math.min(canvas.width, canvas.height);
            var unitWidth = canvas.width / maxDepth;

            this._drawSubChart(ctx, tree, 0, 0, unitWidth, canvas.height, maxDepth);
            this._uninitialized = false;
            this.chart.getActiveElements = this.getActiveElements;
        } else {
            var bgcols = this.$context.dataset.backgroundColor;
            this._processedData.forEach((item, index) => {
                this._drawRect(ctx, item.x, item.y, item.w, item.h, bgcols[index]);
            });
        }
    }

    getActiveElements = (evt) => {
        var ctx = this.chart.ctx;
        var canvas = ctx.canvas;
        var rect = canvas.getBoundingClientRect();
        var x = evt.clientX - rect.left;
        var y = evt.clientY - rect.top
        var points = []
        this._processedData.every((item, index) => {
            if (item.x < x && x < item.x+item.w && item.y < y && y < item.y+item.h) {
                points.push({ index: index });
                return false;
            }
            return true;
        })
        return points;
    }
}

IcicleController.id = 'icicle';
IcicleController.defaults = Chart.PieController.defaults;
Chart.register(IcicleController);