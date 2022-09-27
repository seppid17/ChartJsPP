class SunburstController extends HierarchicalController {
    _drawSector(ctx, x0, y0, r1, r2, theta1, theta2, color = 'black') {
        var arc = new Chart.elements.ArcElement({
            startAngle: theta1,
            endAngle: theta2,
            x: x0,
            y: y0,
            innerRadius: r1,
            outerRadius: r2,
            options: {
                backgroundColor: color,
                circular: true,
                spacing: 0,
                offset: 0,
            }
        });
        this.getMeta().data[this._drawIndex] = arc;
        this._drawIndex += 1;
        arc.draw(ctx);
    }

    _getCenter() {
        var x0 = (this.endX + this.startX) / 2;
        var y0 = (this.endY + this.startY) / 2;
        return [x0, y0];
    }

    draw() {
        super.draw();
        this._processTree(0, 2 * Math.PI);

        var ctx = this.chart.ctx;
        var x0, y0;
        [x0, y0] = this._getCenter();
        var maxDepth = this.tree[this.tree.length - 1].n + 1;

        var hwMin = Math.min(this.endX - this.startX, this.endY - this.startY);
        var r = hwMin / (2 * maxDepth + 1);
        var bgcols = this.$context.dataset.backgroundColor;
        this.tree.forEach((item, index) => {
            this._drawSector(ctx, x0, y0, r / 2 + r * item.n, r / 2 + r * (1 + item.n), item.s, item.e, bgcols[index]);
        });
    }
}

SunburstController.id = 'sunburst';
SunburstController.defaults = Chart.PieController.defaults;
Chart.register(SunburstController);