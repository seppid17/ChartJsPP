class SunburstController extends HierarchicalController {
    static maxDepth = 4;
    _drawSector(r1, r2, theta1, theta2, color = 'black', text = null) {
        var textOptions = this.textOptions;
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
                textColor: textOptions.color,
                font: {
                    style: textOptions.font.style,
                    weight: textOptions.font.weight,
                    size: textOptions.font.size,
                    family: textOptions.font.family
                }
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
            let n = this._drawIndex;
            chartData[n] = item.v;
            labels[n] = item.n;
            this.pointers[n] = item;
            if (item.clr == undefined) item.clr = genColor(n);
            let color = item.clr;
            bgcols[n] = color;
            let endAngle = startAngle + ang * item.w;
            this._drawSector(r0, r1, startAngle, endAngle, color, item.n);
            this._drawChart(item.c, startAngle, endAngle, r1, r, remaining - 1);
            startAngle = endAngle;
        });
    }

    draw(index = -1) {
        super.draw(index);
        this._setCenter();
        var data = this.tree;
        var maxDepth = Math.min(data.d, SunburstController.maxDepth);
        var hwMin = Math.min(this.endX - this.startX, this.endY - this.startY);
        var r = hwMin / (2 * maxDepth + 1);
        this._drawChart(data.c, 0, 2 * Math.PI, r / 2, r, maxDepth);
    }
}

SunburstController.id = 'sunburst';
SunburstController.defaults = Chart.PieController.defaults;
Chart.register(SunburstController, LabeledArcElement);
Chart.register(SunburstController);