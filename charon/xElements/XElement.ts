import { merge } from '../utils'

export interface XElementShape {}

type Color = string | CanvasGradient | CanvasPattern

export interface XElementStyle {
    fill?: Color
    stroke?: Color
}



export interface XElementOptions {
    type?: string,
    shape?:  XElementShape,
    style?: XElementStyle

}

function bindStyle () {

}

export default class XElement {
    shape: XElementShape = {};
    style: XElementStyle = {};
    options: XElementOptions;
    constructor(opt: XElementOptions) {
        this.options = opt;
    }
    updateOptions() {
        let opt = this.options;
        if (opt.shape) {
            merge(this.shape, opt.shape)
        }
        if (opt.style) {
            merge(this.style, opt.style)
        }
    }
    render(ctx: CanvasRenderingContext2D) {

    }

    beforeRender(ctx: CanvasRenderingContext2D) {
        this.updateOptions();
        let style = this.style;
        ctx.save();
        // @ts-ignore
        ctx.fillStyle = style.fill;
        // @ts-ignore
        ctx.strokeStyle = style.stroke;
        ctx.beginPath();
    }
    afterRender(ctx: CanvasRenderingContext2D) {
        ctx.stroke();
        ctx.fill();
        ctx.restore();

    }
    refresh(ctx: CanvasRenderingContext2D) {
        this.beforeRender(ctx)
        this.render(ctx)
        this.afterRender(ctx)
    }

}
