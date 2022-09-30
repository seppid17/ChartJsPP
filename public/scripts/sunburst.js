class SunburstController extends HierarchicalController {
    static maxDepth = 4;
    _drawSector(r1, r2, theta1, theta2, color = 'black', text = null) {
        var arc = new LabeledArcElement({
            startAngle: theta1,
            endAngle: theta2,
            x: this.x0,
            y: this.y0,
            innerRadius: r1,
            outerRadius: r2,
            text: text,
            options: {
                backgroundColor: color,
                circular: true,
                spacing: 0,
                offset: 0,
            }
        });
        this.getMeta().data[this._drawIndex] = arc;
        this._drawIndex += 1;
        arc.draw(this.chart.ctx);
    }

    _setCenter() {
        this.x0 = (this.endX + this.startX) / 2;
        this.y0 = (this.endY + this.startY) / 2;
    }

    _drawChart(data, start, end, r0, r, remaining) {
        if (remaining <= 0) return;
        var chartData = this.getMeta()._parsed;
        var labels = this.chart.$context.chart.data.labels;
        var bgcols = this.chart.$context.chart.data.datasets[0].backgroundColor;
        var ang = end - start;
        let startAngle = start;
        var r1 = r0 + r;
        data.forEach(item => {
            let x = this._drawIndex;
            chartData[x] = item.v;
            labels[x] = item.n;
            if (bgcols[x] == undefined) bgcols[x] = `rgba(${(167 * x + 51) % 256},${(71 * x + 203) % 256},${(203 * x + 67) % 256},1)`;
            let color = bgcols[x];
            let endAngle = startAngle + ang * item.w;
            this._drawSector(r0, r1, startAngle, endAngle, color, item.n);
            this._drawChart(item.c, startAngle, endAngle, r1, r, remaining - 1);
            startAngle = endAngle;
        });
    }

    draw() {
        if (typeof this.endX == 'undefined' || this.endX == 0) {
            this._setAreaCoordinates();
        }
        this._setCenter();
        var meta = this.getMeta();
        var data = meta._dataset.tree;
        var maxDepth = Math.min(data.d, SunburstController.maxDepth);
        var hwMin = Math.min(this.endX - this.startX, this.endY - this.startY);
        var r = hwMin / (2 * maxDepth + 1);
        this._drawIndex = 0;
        this._drawChart(data.c, 0, 2 * Math.PI, r / 2, r, maxDepth);
    }
}

SunburstController.id = 'sunburst';
SunburstController.defaults = Chart.PieController.defaults;
Chart.register(SunburstController, LabeledArcElement);
Chart.register(SunburstController);