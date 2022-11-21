/**
 * Chart controller for treemap chart
 */
class TreemapController extends HierarchicalController {

    /**
     * Draw a rectangle of the chart.
     * This draws a rectangle element.
     * @param {CanvasRenderingContext2D} ctx canvas context
     * @param {number} startX starting X coordinate
     * @param {number} startY starting Y coordinate
     * @param {number} width width of rectangle
     * @param {number} height height of rectangle
     * @param {string|undefined} backgroundColor color of rectangle
     * @param {string|null|undefined} text label of rectangle
     * @returns 
     */
    _drawRect(ctx, startX, startY, width, height, backgroundColor = 'black', text = null) {
        let textOptions = this.textOptions;
        let rect = new RectangleElement({
            x: startX,
            y: startY,
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

    /**
     * Recursively traverse through data and draw rectangles.
     * @param {CanvasRenderingContext2D} ctx canvas context
     * @param {Array} dataArray chart data
     * @param {number} startX starting X coordinate
     * @param {number} startY starting Y coordinate
     * @param {number} endX ending X coordinate
     * @param {number} endY ending Y coordinate
     */
    _recurseTree(ctx, dataArray, startX, startY, endX, endY) {
        let width = endX - startX;
        let height = endY - startY;
        let bgcols = this.chart.$context.chart.data.datasets[0].backgroundColor;
        let labels = this.chart.$context.chart.data.labels;
        let chartData = this.getMeta()._parsed;
        if (width > height) {
            let x0 = startX;
            dataArray.forEach(item => {
                let n = this._drawIndex;
                let myWidth = width * item.w;
                chartData[n] = item.v;
                labels[n] = item.n;
                this.pointers[n] = item;
                if (item.clr == undefined) item.clr = genColor(n);
                let color = item.clr;
                bgcols[n] = color;
                let rect = this._drawRect(ctx, x0, startY, myWidth, height, color, labels[n]);
                let childStartX, childStartY, childEndX, childEndY;
                if (myWidth > height) {
                    childStartX = x0 + this.textOptions.font.size * 0.8 + rect.options.padding * 2;
                    childStartY = startY + rect.options.padding;
                } else {
                    childStartX = x0 + rect.options.padding;
                    childStartY = startY + this.textOptions.font.size * 0.8 + rect.options.padding * 2;
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
            let y0 = startY;
            dataArray.forEach(item => {
                let n = this._drawIndex;
                let myHeight = height * item.w;
                chartData[n] = item.v;
                labels[n] = item.n;
                this.pointers[n] = item;
                if (item.clr == undefined) item.clr = genColor(n);
                let color = item.clr;
                bgcols[n] = color;
                let rect = this._drawRect(ctx, startX, y0, width, myHeight, color, labels[n]);
                let childStartX, childStartY, childEndX, childEndY;
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

    /**
     * Draw the chart.
     * If an index is specified, it starts drawing the subtree rooted at the index
     * @param {number|undefined} index index of the root of the subtree
     * @returns {void}
     */
    draw(index = -1) {
        super.draw(index);
        let data = this.tree;
        let ctx = this.chart.ctx;
        this.textOptions = this.chart.$context.chart.config._config.options.text;
        if (typeof this.textOptions.font == 'undefined') this.textOptions.font = {};
        this.textOptions.font.size = Chart.defaults.font.size;
        this._drawIndex = 0;
        this._recurseTree(ctx, data.c, this.startX, this.startY, this.endX, this.endY);
    }
}

// register the new chart type
TreemapController.id = 'treemap';
TreemapController.defaults = Chart.PieController.defaults;
Chart.register(TreemapController, RectangleElement);
Chart.register(TreemapController);