class LabeledArcElement extends Chart.elements.ArcElement {
    static id = 'labeledArc';

    constructor(cfg) {
        super(cfg);
        this.text = typeof cfg.text != 'undefined' ? cfg.text : null;
        if (typeof this.options == 'undefined') this.options = {};

        var options = cfg.options;
        this.options.textColor = typeof options.textColor != 'undefined' ? options.textColor : '#000000';
        this.options.font = {};

        var font = typeof options.font != 'undefined' ? options.font : {};
        this.options.font.style = typeof font.style != 'undefined' ? font.style : Chart.defaults.font.style; // 'normal' | 'italic' | 'oblique'
        this.options.font.weight = typeof font.weight != 'undefined' ? font.weight : Chart.defaults.font.weight; // 'normal' | 'bold' | 'bolder' | 'lighter'
        this.options.font.size = typeof font.size != 'undefined' ? font.size : Chart.defaults.font.size;
        this.options.font.family = typeof font.family != 'undefined' ? font.family : 'Arial';
    }

    _addText(ctx) {
        if (this.text == null) return;
        var center = this.getCenterPoint(true);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.options.textColor;
        ctx.font = this.options.font.style + ' ' + this.options.font.weight + ' ' + this.options.font.size + 'px' + ' ' + this.options.font.family;
        var textX = center.x, textY = center.y;
        var height = this.options.font.size + 2;
        var width = ctx.measureText(this.text).width + 2;
        var top = textY - height / 2;
        var bottom = textY + height / 2;
        var left = textX - width / 2;
        var right = textX + width / 2;
        if (!this.inRange(left, top, true)) return;
        if (!this.inRange(right, top, true)) return;
        if (!this.inRange(left, bottom, true)) return;
        if (!this.inRange(right, bottom, true)) return;
        ctx.fillText(this.text, textX, textY);
        ctx.restore();
    }

    draw(ctx) {
        super.draw(ctx);
        this._addText(ctx);
    }
}