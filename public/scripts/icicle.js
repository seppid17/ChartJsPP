/**
 * Chart controller for icicle chart
 */
class IcicleController extends HierarchicalController {
    // maximum number of levels to show at a time
    static maxDepth = 5;

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
    _drawRect(startX, startY, width, height, backgroundColor = 'black', text = null) {
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

    /**
     * Recursively traverse through data and draw the chart elements.
     * @param {Array} dataArray data to draw the chart
     * @param {number} startY starting Y coordinate
     * @param {number} endY ending Y coordinate
     * @param {number} startX starting X coordinate
     * @param {number} unitWidth width of a level (X coordinate difference)
     * @param {number} remaining remaining number of levels to draw
     * @returns {void}
     */
    _drawChart(dataArray, startY, endY, startX, unitWidth, remaining) {
        if (remaining <= 0) return;
        let chartData = this.getMeta()._parsed;
        let labels = this.chart.$context.chart.data.labels;
        let bgcols = this.chart.$context.chart.data.datasets[0].backgroundColor;
        let height = endY - startY;
        let y0 = startY;
        let x1 = startX + unitWidth;
        dataArray.forEach(item => {
            let n = this._drawIndex;
            chartData[n] = item.v;
            labels[n] = item.n;
            this.pointers[n] = item;
            if (item.clr == undefined) item.clr = genColor(n);
            let color = item.clr;
            bgcols[n] = color;
            let myHeight = height * item.w;
            this._drawRect(startX, y0, unitWidth, myHeight, color, item.n);
            this._drawChart(item.c, y0, y0 + myHeight, x1, unitWidth, remaining - 1);
            y0 += myHeight;
        });
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
        let maxDepth = Math.min(data.d, IcicleController.maxDepth);
        let width = this.endX - this.startX;
        let unitWidth = width / maxDepth;
        this._drawIndex = 0;
        this._drawChart(data.c, this.startY, this.endY, this.startX, unitWidth, maxDepth);
    }
}

// register the new chart type
IcicleController.id = 'icicle';
IcicleController.defaults = Chart.PieController.defaults;
Chart.register(IcicleController, RectangleElement);
Chart.register(IcicleController);