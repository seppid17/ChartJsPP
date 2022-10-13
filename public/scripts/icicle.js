class IcicleController extends HierarchicalController {
    static maxDepth = 5;
    _drawRect(x0, y0, width, height, backgroundColor = 'black', text = null) {
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
        rect.draw(this.chart.ctx);
    }

    _drawChart(data, startY, endY, startX, unitWidth, remaining) {
        if (remaining <= 0) return;
        var chartData = this.getMeta()._parsed;
        var labels = this.chart.$context.chart.data.labels;
        var bgcols = this.chart.$context.chart.data.datasets[0].backgroundColor;
        var height = endY - startY;
        let y0 = startY;
        var x1 = startX + unitWidth;
        data.forEach(item => {
            let n = this._drawIndex;
            chartData[n] = item.v;
            labels[n] = item.n;
            this.pointers[n] = item;
            if (item.clr==undefined) item.clr = genColor(n);
            let color = item.clr;
            bgcols[n] = color;
            let myHeight = height * item.w;
            this._drawRect(startX, y0, unitWidth, myHeight, color, item.n);
            this._drawChart(item.c, y0, y0 + myHeight, x1, unitWidth, remaining - 1);
            y0 += myHeight;
        });
    }

    draw(index = -1) {
        super.draw(index);
        var data = this.tree;
        var maxDepth = Math.min(data.d, IcicleController.maxDepth);
        var width = this.endX - this.startX;
        var unitWidth = width / maxDepth;
        this._drawIndex = 0;
        this._drawChart(data.c, this.startY, this.endY, this.startX, unitWidth, maxDepth);
    }
}

IcicleController.id = 'icicle';
IcicleController.defaults = Chart.PieController.defaults;
Chart.register(IcicleController, RectangleElement);
Chart.register(IcicleController);