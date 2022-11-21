/**
 * Chart controller for sunburst chart
 */
class SunburstController extends HierarchicalController {
    // maximum number of levels to show at a time
    static maxDepth = 4;

    /**
     * Draw a sector of the chart.
     * This draws an arc element.
     * @param {number} innerRadius inner radius
     * @param {number} outerRadius outer radius
     * @param {number} startAngle start angle
     * @param {number} endAngle end angle
     * @param {string|undefined} color color of the sector
     * @param {string|null|undefined} text label of the arc
     * @returns {void}
     */
    _drawSector(innerRadius, outerRadius, startAngle, endAngle, color = 'black', text = null) {
        let textOptions = this.textOptions;
        let arc = new LabeledArcElement({
            startAngle: startAngle,
            endAngle: endAngle,
            x: this.x0,
            y: this.y0,
            innerRadius: innerRadius,
            outerRadius: outerRadius,
            text: text,
            options: {
                backgroundColor: color,
                circular: true,
                spacing: 0,
                offset: 0,
                textColor: textOptions.color,
                font: {
                    style: textOptions.font.style,
                    weight: textOptions.font.weight,
                    size: textOptions.font.size,
                    family: textOptions.font.family
                }
            }
        });
        this.getMeta().data[this._drawIndex] = arc;
        this._drawIndex += 1;
        arc.draw(this.chart.ctx);
    }

    /**
     * Set coordinates of the center of the drawing area
     */
    _setCenter() {
        this.x0 = (this.endX + this.startX) / 2;
        this.y0 = (this.endY + this.startY) / 2;
    }

    /**
     * Recursively traverse through data and draw sectors.
     * @param {Array} dataArray data to draw the chart
     * @param {number} start start angle
     * @param {number} end end angle
     * @param {number} innerRadius inner radius
     * @param {number} radiusIncrement radius difference of levels
     * @param {number} remaining remaining number of levels to draw
     * @returns {void}
     */
    _drawChart(dataArray, start, end, innerRadius, radiusIncrement, remaining) {
        if (remaining <= 0) return;
        let chartData = this.getMeta()._parsed;
        let labels = this.chart.$context.chart.data.labels;
        let bgcols = this.chart.$context.chart.data.datasets[0].backgroundColor;
        let ang = end - start;
        let startAngle = start;
        let r1 = innerRadius + radiusIncrement;
        dataArray.forEach(item => {
            let n = this._drawIndex;
            chartData[n] = item.v;
            labels[n] = item.n;
            this.pointers[n] = item;
            if (item.clr == undefined) item.clr = genColor(n);
            let color = item.clr;
            bgcols[n] = color;
            let endAngle = startAngle + ang * item.w;
            this._drawSector(innerRadius, r1, startAngle, endAngle, color, item.n);
            this._drawChart(item.c, startAngle, endAngle, r1, radiusIncrement, remaining - 1);
            startAngle = endAngle;
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
        this._setCenter();
        let data = this.tree;
        let maxDepth = Math.min(data.d, SunburstController.maxDepth);
        let hwMin = Math.min(this.endX - this.startX, this.endY - this.startY);
        let r = hwMin / (2 * maxDepth + 1);
        this._drawChart(data.c, 0, 2 * Math.PI, r / 2, r, maxDepth);
    }
}

// register the new chart type
SunburstController.id = 'sunburst';
SunburstController.defaults = Chart.PieController.defaults;
Chart.register(SunburstController, LabeledArcElement);
Chart.register(SunburstController);