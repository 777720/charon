import  XElment, { XElementShape, XElementOptions } from "./XElement";

interface CircleShape extends XElementShape {
    cx: number;
    cy: number;
    r: number;
}

interface CircleOptions extends XElementOptions {
    shape: CircleShape
}



export default class Circle extends XElment {
    name = 'circle';
    shape: CircleShape = {
        cx: 0, cy: 0, r: 100
    }
    constructor(opt: CircleOptions) {
        super(opt)
        this.updateOptions()
    }
    render(ctx: CanvasRenderingContext2D) {
        let shape = this.shape;
        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2, true)
    }
}
