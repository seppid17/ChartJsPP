class RectangleElement extends Chart.Element {
    static id = 'rectangle'

    constructor(cfg) {
        super();
        this.x = cfg.x;
        this.y = cfg.y;
        this.width = cfg.width;
        this.height = cfg.height;
        this.text = cfg.text != undefined ? cfg.text : null;
        this.options = {};

        var options = cfg.options;
        this.options.backgroundColor = options.backgroundColor != undefined ? options.backgroundColor : '#000000';
        this.options.hAlign = options.hAlign != undefined ? options.hAlign : 'left'; // 'left' | 'center' | 'right'
        this.options.vAlign = options.vAlign != undefined ? options.vAlign : 'top'; // 'top' | 'middle' | 'bottom'
        this.options.textColor = options.textColor != undefined ? options.textColor : '#000000';
        this.options.verticalText = options.verticalText != undefined ? options.verticalText : false;
        this.options.font = {};

        var font = options.font != undefined ? options.font : {};
        this.options.font.style = font.style != undefined ? font.style : 'normal'; // 'normal' | 'italic' | 'oblique'
        this.options.font.weight = font.weight != undefined ? font.weight : 'normal'; // 'normal' | 'bold' | 'bolder' | 'lighter'
        this.options.font.size = font.size != undefined ? font.size : 16;
        this.options.font.family = font.family != undefined ? font.family : 'Arial';

        this.options.padding = options.padding != undefined ? options.padding : this.options.font.size / 4;
        this.hasChild = false;
    }

    _addText(ctx) {
        if (this.text == null) return;
        ctx.fillStyle = this.options.textColor;
        ctx.font = this.options.font.style + ' ' + this.options.font.weight + ' ' + this.options.font.size + 'px' + ' ' + this.options.font.family;
        if (this.options.verticalText) {
            if (this.options.font.size + this.options.padding * 2 > this.width) return;
            if (ctx.measureText(this.text).width + this.options.padding * 2 > this.height) return;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            var textX = this.x + this.options.padding;
            var textY = this.y + this.height - this.options.padding;
            ctx.translate(textX, textY);
            ctx.rotate(Math.PI / 2);
            ctx.scale(-1, -1);
            ctx.fillText(this.text, 0, 0);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        } else {
            if (this.options.font.size + this.options.padding * 2 > this.height) return;
            if (ctx.measureText(this.text).width + this.options.padding * 2 > this.width) return;
            var textX = this.x + this.options.padding;
            var textY = this.y + this.options.padding;
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
            ctx.fillText(this.text, textX, textY);
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.options.backgroundColor;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        this._addText(ctx);
        ctx.restore();
    }

    getCenterPoint(useFinalPosition) {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }

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

    inXRange(mouseX, useFinalPosition) {
        if (mouseX < this.x) return false;
        if (mouseX > this.x + this.width) return false;
        return true;
    }

    inYRange(mouseY, useFinalPosition) {
        if (mouseY < this.y) return false;
        if (mouseY > this.y + this.height) return false;
        return true;
    }

    getRange(axis) {
        return axis === 'x' ? this.width / 2 : this.height / 2;
    }

    setChild() {
        this.hasChild = true;
    }
}