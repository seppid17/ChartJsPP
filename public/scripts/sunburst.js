class SunburstController extends Chart.PieController {
    _processedData = [];
    _uninitialized = true;

    update(mode) {
        super.update();
        this._processedData = [];
        this.draw();
    }

    _polarToRect(x0, y0, r, theta) {
        return [x0 + r * Math.cos(theta), y0 + r * Math.sin(theta)];
    }

    _drawSector(ctx, x0, y0, r1, r2, theta1, theta2, color = 'black') {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        var p1 = this._polarToRect(x0, y0, r1, theta1);
        ctx.moveTo(...p1);
        ctx.arc(x0, y0, r2, theta1, theta2);
        var p2 = this._polarToRect(x0, y0, r1, theta2);
        ctx.lineTo(...p2);
        ctx.arc(x0, y0, r1, theta2, theta1, true);
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

    _drawSubChart(ctx, data, x0, y0, start, end, r0, r, remaining) {
        if (remaining <= 0) return;
        var r2 = r0 + r;
        var ang = end - start;
        var bgcols = this.$context.dataset.backgroundColor;
        data.forEach(item => {
            var weight = item.w;
            var nextAng = start + ang * weight;
            var color = `rgba(${Math.floor(256 * start * remaining) % 256},${Math.floor(256 * nextAng * remaining) % 256},${Math.floor(256 * (nextAng - start) * remaining) % 256},1)`;
            if (this._uninitialized) bgcols.push(color);
            this._processedData.push({ v: item.v, r1: r0, r2: r2, th1: start, th2: nextAng });
            this._drawSector(ctx, x0, y0, r0, r2, start, nextAng, color);
            this._drawSubChart(ctx, item.c, x0, y0, start, nextAng, r2, r, remaining - 1);
            start = nextAng;
        });
    }

    draw() {
        var ctx = this.chart.ctx;
        var canvas = ctx.canvas;
        var x0 = canvas.width / 2;
        var y0 = canvas.height / 2;

        if (this._processedData.length == 0) {
            var data = this._data;
            var [tree, maxDepth] = this._recurseTree(data);
            maxDepth = Math.min(maxDepth, 4);

            var hw = Math.min(canvas.width, canvas.height);
            var r = hw / (2 * maxDepth + 1);

            this._drawSubChart(ctx, tree, x0, y0, 0, 2 * Math.PI, r / 2, r, maxDepth);
            this._uninitialized = false;
            this.chart.getActiveElements = this.getActiveElements;
        } else {
            var bgcols = this.$context.dataset.backgroundColor;
            this._processedData.forEach((item, index) => {
                this._drawSector(ctx, x0, y0, item.r1, item.r2, item.th1, item.th2, bgcols[index]);
            });
        }
    }

    getActiveElements = (evt) => {
        var ctx = this.chart.ctx;
        var canvas = ctx.canvas;
        var x0 = canvas.width / 2;
        var y0 = canvas.height / 2;
        
        var rect = canvas.getBoundingClientRect();
        var x = evt.clientX - rect.left;
        var y = evt.clientY - rect.top
        var r = Math.sqrt((x-x0)*(x-x0) + (y-y0)*(y-y0));
        var theta = Math.atan2((y-y0), (x-x0));
        if (theta<0){
            theta += 2*Math.PI;
        }
        var points = []
        this._processedData.every((item,index) => {
            if (item.r1 < r && r < item.r2 && item.th1 < theta && theta < item.th2){
                points.push({index:index});
                return false;
            }
            return true;
        })
        return points;
    }
}

SunburstController.id = 'sunburst';
SunburstController.defaults = Chart.PieController.defaults;
Chart.register(SunburstController);