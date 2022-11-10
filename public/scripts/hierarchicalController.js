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
        if (typeof mode != 'undefined') {
            if (mode.startsWith('expand ')) {
                var index = mode.split(' ')[1];
                index = parseInt(index);
                this.draw(index);
                return;
            } else if (mode == 'root') {
                this.tree = this.getMeta()._dataset.tree;
                return;
            } else if (mode == 'parent') {
                let parent = this.tree.p;
                if (parent != undefined) {
                    this.tree = parent;
                    this.draw();
                    return;
                }
            }
        }
        super.update(mode);
        this._setAreaCoordinates();
        if (typeof mode == 'undefined' || mode == 'resize' || mode == 'default' || mode == 'reset' || mode == 'none')
            this.draw();
    }

    draw(index = -1) {
        if (typeof this.endX == 'undefined' || this.endX == 0) {
            this._setAreaCoordinates();
        }
        var meta = this.getMeta();
        if (typeof this.tree == 'undefined') {
            this.tree = meta._dataset.tree;
        }
        if (index >= 0) {
            if (typeof this.pointers != 'undefined' && typeof this.pointers[index] != undefined && this.pointers[index].c.length > 0) {
                this.tree = this.pointers[index];
            }
        }
        this.textOptions = this.chart.$context.chart.config._config.options.text;
        if (this.textOptions == undefined) this.textOptions = {};
        if (typeof this.textOptions.font == 'undefined') this.textOptions.font = {};
        this.textOptions.font.size = Chart.defaults.font.size;
        this.pointers = [];
        meta._parsed.length = 0;
        this.chart.$context.chart.data.labels = [];
        this.chart.$context.chart.data.datasets[0].backgroundColor = [];
        this._drawIndex = 0;
    }
}