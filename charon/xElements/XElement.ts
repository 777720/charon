import {isFunction, isObject, isString, merge} from '../utils';
import Charon from "../Charon";
import Animation from '../Animation';

export interface XElementShape {
}

type Color = string | CanvasGradient | CanvasPattern

export interface XElementStyle {
    fill?: Color
    stroke?: Color,
    opacity?: number,
    lineWidth?: number
}


export interface XElementOptions {
    type?: string,
    shape?: XElementShape,
    style?: XElementStyle,
    zLevel?: number
}

interface Transform {
    position: [number, number];
    scale: [number, number];
    rotation: number;
    origin: [number, number]
}

function bindStyle(ctx: CanvasRenderingContext2D, style: XElementStyle) {
    let fill = style.fill || 'transparent';
    ctx.fillStyle = fill;
    ctx.strokeStyle = style.stroke || '';
    // @ts-ignore
    ctx.globalAlpha = style.opacity;
    // @ts-ignore
    ctx.lineWidth = style.lineWidth;

}

class XElement implements Transform{

    public animation: Animation;

    public ignore: boolean = false;

    public shape: XElementShape = {};
    public style: XElementStyle = {};
    public zLevel = 1;
    public options: XElementOptions;
    private _cr: Charon | Object;
    public position: [number, number] = [0, 0];
    public scale: [number, number] = [1, 1];
    public rotation: number = 0;
    public origin: [number, number] = [0, 0];

    constructor(opt: XElementOptions) {
        this.options = opt;
        this._cr = {};
    }



    show() {
        this.ignore = false;
        (this._cr as Charon).render();
    }

    hide() {
        this.ignore = true;
        (this._cr as Charon).render();
    }

    animateTo(target: Object, time: any, delay: any, easing: any, callback: any) {
        if (isString(delay)) {
            callback = easing;
            easing = delay;
            delay = 0;
        } else if (isFunction(easing)) {
            callback = easing;
            easing = 'linear';
            delay = 0;
        } else if (isFunction(delay)) {
            callback = delay;
            delay = 0;
        } else if (isFunction(time)) {
            callback = time;
            time = 500;
        } else if (!time) {
            time = 500;
        }
        // 先停止动画
        this.animation && this.animation.stop();
        this.animation = new Animation({
            shape: this.shape,
            style: this.style
        });
        // @ts-ignore
        return this.animation
            .during((target: object) => {
                this.attr(target);
            })
            .when(time, target)
            .done(callback)
            .delay(delay)
            .start(easing);
    }


    attrShapeFunction(newShape: object) {
        console.log('attrShapeFunction', newShape);
        let shape = this.options.shape || {};
        merge(shape, newShape);
    }

    attrStyleFunction(newStyle: object) {
        let style = this.options.style || {};
        merge(style, newStyle);
    }

    attrKv(key: string, value: object) {

        switch (key) {
            case 'shape':
                this.attrShapeFunction(value);
                break;
            case 'style':
                this.attrStyleFunction(value);
                break;
            default:
                (this.options as any)[key] = value;
        }
    }

    attr(key: string | object, value?: any) {
        if (isString(key)) {
            this.attrKv(key as string, value);
        } else if (isObject(key)) {
            for (let name in key as any) {
                if (key.hasOwnProperty(name)) {
                    this.attrKv(name, (key as any)[name]);
                }
            }
        }
        this.updateOptions();
        (this._cr as Charon).render();
    }

    updateOptions() {
        let opt = this.options;
        if (opt.shape) {
            merge(this.shape, opt.shape);
        }
        if (opt.style) {
            merge(this.style, opt.style);
        }
        if (opt.zLevel) {
            this.zLevel = opt.zLevel;
        }
        ['zLevel', 'origin', 'scale', 'position', 'rotation'].forEach(key => {
            if (opt[key]) {
                this[key] = opt[key]
            }
        })
    }

    render(ctx: CanvasRenderingContext2D) {

    }

    setCr(cr: Charon) {
        this._cr = cr;
    }

    setTransform(ctx: CanvasRenderingContext2D) {
        ctx.translate(...this.origin);
        ctx.scale(...this.scale);
        ctx.rotate(this.rotation);
        ctx.translate(-this.origin[0], -this.origin[1])
        ctx.translate(...this.position)
    }

    beforeRender(ctx: CanvasRenderingContext2D) {
        ctx.save();
        bindStyle(ctx, this.style);
        this.setTransform(ctx)
        ctx.beginPath();
    }

    afterRender(ctx: CanvasRenderingContext2D) {
        ctx.stroke();
        ctx.fill();
        ctx.restore();

    }

    refresh(ctx: CanvasRenderingContext2D) {
        this.beforeRender(ctx);
        this.render(ctx);
        this.afterRender(ctx);
    }

}

export default XElement;
