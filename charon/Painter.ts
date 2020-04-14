import {debounce, isString} from "./utils";
import Stage from "./Stage";

export interface PainterOptions {
    width?: number;
    height?: number;
    backgroundColor?: string;
}

function createCanvas(dom: string| HTMLCanvasElement | HTMLElement) {
    if (isString(dom)) {
        dom = document.querySelector(dom as string) as HTMLElement
    }
    if (dom instanceof  HTMLCanvasElement) {
        return dom
    }
    let canvas = document.createElement('canvas');

    (<HTMLElement>dom).appendChild(canvas)

    canvas.height = (<HTMLElement>dom).clientHeight
    canvas.width = (<HTMLElement>dom).clientWidth
    return canvas
}

function setCanvasStyle (canvas: HTMLCanvasElement, opt: PainterOptions) {
    if (opt.height) {
        canvas.height = opt.height;
        canvas.style.height = `${opt.height}px`;
    } else {
        opt.height = canvas.clientHeight
    }
    if (opt.width) {
        canvas.width = opt.width;
        canvas.style.width = `${opt.width}px`;
    } else {
        opt.width = canvas.clientWidth
    }
    if (opt.backgroundColor) {
        canvas.style.backgroundColor = opt.backgroundColor
    }
}


class Painter {
    canvas: HTMLCanvasElement;
    stage: Stage;
    opt: PainterOptions
    ctx: CanvasRenderingContext2D | null;
    constructor(dom: string | HTMLCanvasElement | HTMLElement, stage: Stage, opt: PainterOptions = {}) {
        this.canvas = createCanvas(dom);
        this.opt = opt
        setCanvasStyle(this.canvas, opt);
        this.stage = stage;
        this.ctx = this.canvas.getContext('2d');
    }
    render = debounce(() => {
        console.log('painter render', this.stage.getAll())
        this.beforeRender();
        let xelements = this.stage.getAll();
        for (let i = 0; i < xelements.length; i += 1) {
            xelements[i].refresh(this.ctx as CanvasRenderingContext2D)
        }
    })
    beforeRender() {
        (this.ctx as CanvasRenderingContext2D ).clearRect(0,0,this.opt.width || 0, this.opt.height || 0)

    }
}

export default Painter
