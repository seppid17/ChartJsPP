class TreemapController extends HierarchicalController {
    _drawRect(ctx, x0, y0, width, height, backgroundColor = 'black', text = null) {
        // if (backgroundColor=='black'){
        //     throw new Error("Color error");
        // }
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
    }

    _recurseTree(ctx, data, startX, startY, endX, endY) {
        var totWeight = 0;
        data.forEach(item => {
            totWeight += item.v;
        });
        var width = endX - startX;
        var height = endY - startY;
        if (width < this.textOptions.font.size / 3 || height < this.textOptions.font.size / 3) return;
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
                if (color == undefined) {
                    color = `rgba(${(167 * x) % 256},${(71 * x) % 256},${(203 * x) % 256},1)`;
                    bgcols[this._drawIndex] = color;
                }
                this._drawRect(ctx, x0, startY, myWidth, height, color, labels[this._drawIndex]);
                var childStartX, childStartY, childEndX, childEndY;
                if (myWidth > height) {
                    childStartX = x0 + 4 * this.textOptions.font.size / 3;
                    childStartY = startY + 4;
                } else {
                    childStartX = x0 + 4;
                    childStartY = startY + 4 * this.textOptions.font.size / 3;
                }
                childEndX = x0 + myWidth - 4;
                childEndY = startY + height - 4;
                this._recurseTree(ctx, item.c, childStartX, childStartY, childEndX, childEndY);
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
                if (color == undefined) {
                    color = `rgba(${(167 * x) % 256},${(71 * x) % 256},${(203 * x) % 256},1)`;
                    bgcols[this._drawIndex] = color;
                }
                this._drawRect(ctx, startX, y0, width, myHeight, color, labels[this._drawIndex]);
                var childStartX, childStartY, childEndX, childEndY;
                if (myHeight < width) {
                    childStartX = startX + 4 * this.textOptions.font.size / 3;
                    childStartY = y0 + 4;
                } else {
                    childStartX = startX + 4;
                    childStartY = y0 + 4 * this.textOptions.font.size / 3;
                }
                childEndX = startX + width - 4;
                childEndY = y0 + myHeight - 4;
                this._recurseTree(ctx, item.c, childStartX, childStartY, childEndX, childEndY);
                y0 += myHeight;
            });
        }
    }

    draw() {
        var meta = this.getMeta();
        var data = meta._dataset.tree;
        var ctx = this.chart.ctx;
        this.textOptions = this.chart.$context.chart.config._config.options.text;
        var labels = this.chart.$context.chart.data.labels;
        this._drawIndex = 0;
        this._recurseTree(ctx, data, this.startX, this.startY, this.endX, this.endY);
    }
}

TreemapController.id = 'treemap';
TreemapController.defaults = Chart.PieController.defaults;
Chart.register(TreemapController, RectangleElement);
Chart.register(TreemapController);