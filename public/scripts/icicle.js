class IcicleController extends HierarchicalController {
    _drawRect(ctx, x0, y0, width, height, color = 'black') {
        var rect = new RectangleElement({
            x: x0,
            y: y0,
            width: width,
            height: height,
            options: {
                backgroundColor: color
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

        var maxDepth = this.tree[this.tree.length - 1].n + 1;
        var bgcols = this.$context.dataset.backgroundColor;
        this.tree.forEach((item, index) => {
            var x0 = this.startX + unitWidth * item.n;
            var y0 = item.s;
            var height = item.e - item.s;
            this._drawRect(ctx, x0, y0, unitWidth, height, bgcols[index]);
        });
    }
}

IcicleController.id = 'icicle';
IcicleController.defaults = Chart.PieController.defaults;
Chart.register(IcicleController, RectangleElement);
Chart.register(IcicleController);