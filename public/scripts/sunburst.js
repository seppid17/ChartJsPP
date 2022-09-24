class SunburstController extends Chart.PieController {
    update(mode) {
        super.update();
        this.draw();
    }

    _polarToRect(x0, y0, r, theta) {
        return [x0 + r * Math.cos(theta), y0 + r * Math.sin(theta)];
    }

    _drawSector(ctx, x0, y0, r1, r2, theta1, theta2) {
        ctx.save();
        ctx.beginPath();
        var color = `rgba(${Math.floor(256*theta1*r1/(r2-r1))%256},${Math.floor(256*theta2*r2/(r2-r1))%256},${Math.floor(256*(theta2-theta1)*(r1+r2)/(r2-r1))%256},1)`;
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
            newList.push({ v: item.v, c: item.c });
        });
        newList.forEach(item => {
            item.v = item.v / totWeight;
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
        data.forEach(item => {
            var weight = item.v;
            var nextAng = start + ang * weight;
            this._drawSector(ctx, x0, y0, r0, r2, start, nextAng);
            this._drawSubChart(ctx, item.c, x0, y0, start, nextAng, r2, r, remaining - 1);
            start = nextAng;
        });
    }

    draw() {
        var data = this._data;
        var [tree, maxDepth] = this._recurseTree(data);
        maxDepth = Math.min(maxDepth, 4);

        var ctx = this.chart.ctx;
        var canvas = ctx.canvas;
        var x0 = canvas.width / 2;
        var y0 = canvas.height / 2;

        var hw = Math.min(canvas.width, canvas.height);
        var r = hw / (2 * (maxDepth + 1));

        this._drawSubChart(ctx, tree, x0, y0, 0, 2 * Math.PI, r, r, maxDepth);
        // this._drawSector(ctx, x0, y0, r1, r2, 2 * Math.PI / 3, Math.PI / 3);
        // this._drawSector(ctx, x0, y0, r2, r1 * 3, Math.PI / 3, 2 * Math.PI / 3);
        // Call bubble controller method to draw all the points
        // super.draw();

        // Now we can do some custom drawing for this dataset. Here we'll draw a red box around the first point in each dataset
        /*const meta = this.getMeta();
        meta.data.forEach(pt => {
            const { x, y } = pt.getProps(['x', 'y']);
            const { width, height } = pt.getProps(['width', 'height']);
            pt.width = 60;
            const ctx = this.chart.ctx;
            ctx.save();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(x-width/2, y, width, height);
            ctx.restore();
        });*/
    }
}

SunburstController.id = 'sunburst';
SunburstController.defaults = Chart.PieController.defaults;
Chart.register(SunburstController);