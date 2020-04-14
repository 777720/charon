import Stage from "./Stage";
import Painter, {PainterOptions} from './Painter'
import XElement from "./xElements/XElement";

export interface CharonOptions extends PainterOptions {

}

export default class Charon {
    stage: Stage;
    painter: Painter;
    constructor(dom: string | HTMLElement, opt: CharonOptions = {}) {
        this.stage = new Stage();
        this.painter = new Painter(dom, this.stage, opt)

    }
    add(...xelements: XElement[]) {

        xelements.forEach(xel => {
            xel.setCr(this);
        })
        this.stage.add(...xelements);
        this.render()
    }
    render() {
        this.painter.render()
    }
}
