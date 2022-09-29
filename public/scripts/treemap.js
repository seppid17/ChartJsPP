class TreemapController extends HierarchicalController {
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
                verticalText: height < width,
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
        return rect;
    }

    _recurseTree(ctx, data, startX, startY, endX, endY) {
        var totWeight = 0;
        data.forEach(item => {
            totWeight += item.v;
        });
        var width = endX - startX;
        var height = endY - startY;
        // if (width < this.textOptions.font.size / 3 || height < this.textOptions.font.size / 3) return;
        var bgcols = this.chart.$context.chart.data.datasets[0].backgroundColor;
        var labels = this.chart.$context.chart.data.labels;
        var chartData = this.getMeta()._parsed;//this.chart.$context.chart.data.datasets[0].data;
        if (width > height) {
            var x0 = startX;
            data.forEach(item => {
                var weight = item.v / totWeight;
                var myWidth = width * weight;
                chartData[this._drawIndex] = item.v;
                labels[this._drawIndex] = item.n;
                var x = this._drawIndex + 1;
                var color = bgcols[this._drawIndex];
                if (typeof color == 'undefined') {
                    color = `rgba(${(167 * x) % 256},${(71 * x) % 256},${(203 * x) % 256},1)`;
                    bgcols[this._drawIndex] = color;
                }
                var rect = this._drawRect(ctx, x0, startY, myWidth, height, color, labels[this._drawIndex]);
                var childStartX, childStartY, childEndX, childEndY;
                if (myWidth > height) {
                    childStartX = x0 + this.textOptions.font.size + rect.options.padding * 2;
                    childStartY = startY + rect.options.padding;
                } else {
                    childStartX = x0 + rect.options.padding;
                    childStartY = startY + this.textOptions.font.size + rect.options.padding * 2;
                }
                childEndX = x0 + myWidth - rect.options.padding;
                childEndY = startY + height - rect.options.padding;
                if ((item.c.length > 0) && (childEndX - childStartX >= this.textOptions.font.size + rect.options.padding * 2) && (childEndY - childStartY >= this.textOptions.font.size + rect.options.padding * 2)) {
                    rect.setChild();
                    this._recurseTree(ctx, item.c, childStartX, childStartY, childEndX, childEndY);
                }
                x0 += myWidth;
            });
        } else {
            var y0 = startY;
            data.forEach(item => {
                var weight = item.v / totWeight;
                var myHeight = height * weight;
                chartData[this._drawIndex] = item.v;
                labels[this._drawIndex] = item.n;
                var x = this._drawIndex + 1;
                var color = bgcols[this._drawIndex];
                if (typeof color == 'undefined') {
                    color = `rgba(${(167 * x) % 256},${(71 * x) % 256},${(203 * x) % 256},1)`;
                    bgcols[this._drawIndex] = color;
                }
                var rect = this._drawRect(ctx, startX, y0, width, myHeight, color, labels[this._drawIndex]);
                var childStartX, childStartY, childEndX, childEndY;
                if (myHeight < width) {
                    childStartX = startX + this.textOptions.font.size + rect.options.padding * 2;
                    childStartY = y0 + rect.options.padding;
                } else {
                    childStartX = startX + rect.options.padding;
                    childStartY = y0 + this.textOptions.font.size + rect.options.padding * 2;
                }
                childEndX = startX + width - rect.options.padding;
                childEndY = y0 + myHeight - rect.options.padding;
                if ((item.c.length > 0) && (childEndX - childStartX >= this.textOptions.font.size + rect.options.padding * 2) && (childEndY - childStartY >= this.textOptions.font.size + rect.options.padding * 2)) {
                    rect.setChild();
                    this._recurseTree(ctx, item.c, childStartX, childStartY, childEndX, childEndY);
                }
                y0 += myHeight;
            });
        }
    }

    draw() {
        var meta = this.getMeta();
        var data = meta._dataset.tree;
        var ctx = this.chart.ctx;
        this.textOptions = this.chart.$context.chart.config._config.options.text;
        if (typeof this.textOptions.font == 'undefined') this.textOptions.font = {};
        this.textOptions.font.size = Chart.defaults.font.size;
        this._drawIndex = 0;
        this._recurseTree(ctx, data, this.startX, this.startY, this.endX, this.endY);
    }
}

TreemapController.id = 'treemap';
TreemapController.defaults = Chart.PieController.defaults;
Chart.register(TreemapController, RectangleElement);
Chart.register(TreemapController);