class IcicleController extends HierarchicalController {
    _drawRect(ctx, x0, y0, width, height, backgroundColor = 'black', text = null) {
        var textOptions = this.textOptions;
        var rect = new RectangleElement({
            x: x0,
            y: y0,
            width: width,
            height: height,
            text: text,
            options: {
                backgroundColor: backgroundColor,
                hAlign: textOptions.hAlign,
                vAlign: textOptions.vAlign,
                textColor: textOptions.color,
                font: {
                    style: textOptions.font.style,
                    weight: textOptions.font.weight,
                    size: textOptions.font.size,
                    family: textOptions.font.family
                }
            }
        });
        this.getMeta().data[this._drawIndex] = rect;
        this._drawIndex += 1;
        rect.draw(ctx);
    }

    draw() {
        super.draw();
        this._processTree(this.startY, this.endY);
        var maxDepth = this.tree[this.tree.length - 1].n + 1;
        var unitWidth = (this.endX - this.startX) / maxDepth;

        var ctx = this.chart.ctx;
        this.textOptions = this.chart.$context.chart.config._config.options.text;
        var labels = this.chart.$context.chart.data.labels;

        var maxDepth = this.tree[this.tree.length - 1].n + 1;
        var bgcols = this.$context.dataset.backgroundColor;
        this.tree.forEach((item, index) => {
            var x0 = this.startX + unitWidth * item.n;
            var y0 = item.s;
            var height = item.e - item.s;
            this._drawRect(ctx, x0, y0, unitWidth, height, bgcols[index], labels[index]);
        });
    }
}

IcicleController.id = 'icicle';
IcicleController.defaults = Chart.PieController.defaults;
Chart.register(IcicleController, RectangleElement);
Chart.register(IcicleController);