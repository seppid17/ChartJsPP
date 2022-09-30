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
        if (typeof mode == 'undefined' || mode == 'resize' || mode == 'default' || mode == 'reset' || mode == 'none')
            this.draw();
    }
}