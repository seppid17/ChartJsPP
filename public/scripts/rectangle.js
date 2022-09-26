class RectangleElement extends Chart.Element{
    static id = 'rectangle'
    
    constructor(props) {
        super();
        this.active = false;
        this.x = props.x;
        this.y = props.y;
        this.width = props.width;
        this.height = props.height;
        this.options = {}
        this.options.backgroundColor = props.options.backgroundColor;
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.options.backgroundColor;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.restore();
    }

    getCenterPoint(useFinalPosition) {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }

    tooltipPosition() {
        return this.getCenterPoint();
    }

    inRange(mouseX, mouseY, useFinalPosition) {
        if (mouseX < this.x) return false;
        if (mouseX > this.x + this.width) return false;
        if (mouseY < this.y) return false;
        if (mouseY > this.y + this.height) return false;
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
}