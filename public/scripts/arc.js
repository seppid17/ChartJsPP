/**
 * Arc element with a label
 */
class LabeledArcElement extends Chart.elements.ArcElement {
    static id = 'labeledArc';

    constructor(cfg) {
        super(cfg);

        // set text and its options (use default values if not specified)
        this.text = typeof cfg.text != 'undefined' ? cfg.text : null;
        if (typeof this.options == 'undefined') this.options = {};

        let options = cfg.options;
        this.options.textColor = typeof options.textColor != 'undefined' ? options.textColor : 'black';
        this.options.font = {};

        // set font options
        let font = typeof options.font != 'undefined' ? options.font : {};
        this.options.font.style = typeof font.style != 'undefined' ? font.style : Chart.defaults.font.style; // 'normal' | 'italic' | 'oblique'
        this.options.font.weight = typeof font.weight != 'undefined' ? font.weight : Chart.defaults.font.weight; // 'normal' | 'bold' | 'bolder' | 'lighter'
        this.options.font.size = typeof font.size != 'undefined' ? font.size : Chart.defaults.font.size;
        this.options.font.family = typeof font.family != 'undefined' ? font.family : 'Arial';
    }

    /**
     * Add text to the arc element if sufficient space is available.
     * @param {CanvasRenderingContext2D} ctx 
     * @returns {void}
     */
    _addText(ctx) {
        if (this.text == null) return; // no text

        let center = this.getCenterPoint(true);
        ctx.save();
        // set text position and properties
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.options.textColor;
        ctx.font = this.options.font.style + ' ' + this.options.font.weight + ' ' + this.options.font.size + 'px' + ' ' + this.options.font.family;
        let textX = center.x, textY = center.y;
        
        // height and width of text when rendered
        let height = this.options.font.size + 2;
        let width = ctx.measureText(this.text).width + 2;

        let top = textY - height / 2; // Y coordinate of top margin of the text
        let bottom = textY + height / 2; // Y coordinate of bottom margin of the text
        let left = textX - width / 2; // X coordinate of left margin of the text
        let right = textX + width / 2; // X coordinate of right margin of the text

        // if any corner of the text is out of the range, do not add text
        if (!this.inRange(left, top, true)) return; // top left corner is out of the arc
        if (!this.inRange(right, top, true)) return; // top right corner is out of the arc
        if (!this.inRange(left, bottom, true)) return; // bottom left corner is out of the arc
        if (!this.inRange(right, bottom, true)) return; // bottom right corner is out of the arc

        // add text
        ctx.fillText(this.text, textX, textY);
        ctx.restore();
    }

    /**
     * Draw the labled arc element.
     * @param {CanvasRenderingContext2D} ctx
     * @returns {void}
     */
    draw(ctx) {
        super.draw(ctx);
        this._addText(ctx);
    }
}