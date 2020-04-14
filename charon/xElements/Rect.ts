import XElement, {XElementOptions, XElementShape} from "./XElement";

interface RectShape extends XElementShape {
    height: number,
    width: number,
    rx: number,
    ry: number

}

interface RectOptions extends XElementOptions{
    shape: RectShape
}

class Rect extends XElement {
    name = 'rect';
    shape: RectShape = {
        rx: 0,
        ry: 0,
        height: 0,
        width: 0
    }
    constructor(opt: RectOptions) {
        super(opt)
        this.updateOptions()
    }

    render(ctx: CanvasRenderingContext2D) {
        let shape = this.shape;
        ctx.rect(shape.rx, shape.ry, shape.width, shape.height)
    }
}


export default Rect;
