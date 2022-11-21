/**
 * Rectangular chart element
 */
class RectangleElement extends Chart.Element {
    static id = 'rectangle'

    constructor(cfg) {
        super();

        // set position and size
        this.x = cfg.x;
        this.y = cfg.y;
        this.width = cfg.width;
        this.height = cfg.height;

        // set text and its options (use default values if not specified)
        this.text = typeof cfg.text != 'undefined' ? cfg.text : null;
        if (typeof this.options == 'undefined') this.options = {};

        let options = cfg.options;
        this.options.backgroundColor = typeof options.backgroundColor != 'undefined' ? options.backgroundColor : 'black';
        this.options.hAlign = typeof options.hAlign != 'undefined' ? options.hAlign : 'left'; // 'left' | 'center' | 'right'
        this.options.vAlign = typeof options.vAlign != 'undefined' ? options.vAlign : 'top'; // 'top' | 'middle' | 'bottom'
        this.options.textColor = typeof options.textColor != 'undefined' ? options.textColor : 'black';
        this.options.verticalText = typeof options.verticalText != 'undefined' ? options.verticalText : false;
        this.options.font = {};

        let font = typeof options.font != 'undefined' ? options.font : {};
        this.options.font.style = typeof font.style != 'undefined' ? font.style : Chart.defaults.font.style; // 'normal' | 'italic' | 'oblique'
        this.options.font.weight = typeof font.weight != 'undefined' ? font.weight : Chart.defaults.font.weight; // 'normal' | 'bold' | 'bolder' | 'lighter'
        this.options.font.size = typeof font.size != 'undefined' ? font.size : Chart.defaults.font.size;
        this.options.font.family = typeof font.family != 'undefined' ? font.family : 'Arial';

        this.options.padding = typeof options.padding != 'undefined' ? options.padding : this.options.font.size / 4;
        this.hasChild = false;
    }

    /**
     * Add text to the rectangle element if sufficient space is available.
     * @param {CanvasRenderingContext2D} ctx 
     * @returns {void}
     */
    _addText(ctx) {
        if (this.text == null) return; // no text

        // set text position and properties
        ctx.fillStyle = this.options.textColor;
        ctx.font = this.options.font.style + ' ' + this.options.font.weight + ' ' + this.options.font.size + 'px' + ' ' + this.options.font.family;
        let textHeight = this.options.font.size * 0.8 + this.options.padding * 2;
        let textWidth = ctx.measureText(this.text).width + this.options.padding * 2;
        if (this.options.verticalText && textHeight < textWidth) { // try to add text rotated
            if (textHeight > this.width) return; // not enough space to add text
            if (textWidth > this.height) return; // not enough space to add text
            
            // set text position
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            let textX = this.x + this.options.padding;
            let textY = this.y + this.height - this.options.padding;
            ctx.translate(textX, textY);

            // rotate to draw text vertically
            ctx.rotate(Math.PI / 2);

            // flip
            ctx.scale(-1, -1);

            // add text
            ctx.fillText(this.text, 0, 0);

            // reset translation and rotation
            ctx.setTransform(1, 0, 0, 1, 0, 0);
    
        } else { // try to add text horizontally
            if (textHeight > this.height) return; // not enough space to add text
            if (textWidth > this.width) return; // not enough space to add text

            // set text position
            let textX = this.x + this.options.padding;
            let textY = this.y + this.options.padding;
            if (this.options.hAlign == 'center') {
                textX = this.x + this.width / 2;
            } else if (this.options.hAlign == 'right') {
                textX = this.x + this.width - this.options.padding;
            }
            if (this.options.vAlign == 'middle') {
                textY = this.y + this.height / 2;
            } else if (this.options.vAlign == 'bottom') {
                textY = this.y + this.height - this.options.padding;
            }
            ctx.textAlign = this.options.hAlign;
            ctx.textBaseline = this.options.vAlign;

            // add text
            ctx.fillText(this.text, textX, textY);

        }
    }

    /**
     * Draw the rectangle element.
     * @param {CanvasRenderingContext2D} ctx
     * @returns {void}
     */
    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.options.backgroundColor;// set color
        // draw rectangle
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();

        this._addText(ctx);
        ctx.restore();
    }

    /**
     * Get the center point of the rectangle
     * @param {boolean} useFinalPosition unused
     * @returns {Object} {x:Xcoordinate, y:Ycoordinate}
     */
    getCenterPoint(useFinalPosition) {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }

    /**
     * Position to show tooltip.
     * At the center of the top or left side bar
     * @returns {Object} {x:Xcoordinate, y:Ycoordinate}
     */
    tooltipPosition() {
        if (this.hasChild) {
            if (this.options.verticalText) {
                return {
                    x: this.x + this.options.font.size / 2 + this.options.padding,
                    y: this.y + this.height / 2
                };
            } else {
                return {
                    x: this.x + this.width / 2,
                    y: this.y + this.options.font.size / 2 + this.options.padding
                };
            }
        }
        return this.getCenterPoint();
    }

    /**
     * Checks of the mouse is in the rectangle,
     * but not in any of its inner rectangle
     * @param {Number} mouseX
     * @param {Number} mouseY
     * @param {boolean} useFinalPosition unused
     * @returns {boolean}
     */
    inRange(mouseX, mouseY, useFinalPosition) {
        if (mouseX < this.x) return false;
        if (mouseX > this.x + this.width) return false;
        if (mouseY < this.y) return false;
        if (mouseY > this.y + this.height) return false;
        if (this.hasChild) {
            if (mouseX > this.x + this.width - this.options.padding) return true;
            if (mouseY > this.y + this.height - this.options.padding) return true;
            if (this.options.verticalText) {
                if (mouseX < this.x + this.options.font.size + this.options.padding * 2) return true;
                if (mouseY < this.y + this.options.padding) return true;
            } else {
                if (mouseX < this.x + this.options.padding) return true;
                if (mouseY < this.y + this.options.font.size + this.options.padding * 2) return true;
            }
            return false;
        }
        return true;
    }

    /**
     * Checks of the mouse is in the X range of the rectangle,
     * but not in any of its inner rectangle
     * @param {Number} mouseX
     * @param {boolean} useFinalPosition unused
     * @returns {boolean}
     */
     inXRange(mouseX, useFinalPosition) {
        if (mouseX < this.x) return false;
        if (mouseX > this.x + this.width) return false;
        return true;
    }

    /**
     * Checks of the mouse is in the Y range of the rectangle,
     * but not in any of its inner rectangle
     * @param {Number} mouseY
     * @param {boolean} useFinalPosition unused
     * @returns {boolean}
     */
    
    inYRange(mouseY, useFinalPosition) {
        if (mouseY < this.y) return false;
        if (mouseY > this.y + this.height) return false;
        return true;
    }

    /**
     * Range of the element along the axis
     * @param {string} axis name of the axis (x or y)
     * @returns {number}
     */
    getRange(axis) {
        return axis === 'x' ? this.width / 2 : this.height / 2;
    }

    /**
     * Specifies that this rectangle contains other rectangles in it
     */
    setChild() {
        this.hasChild = true;
    }
}