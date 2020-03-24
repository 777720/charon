import Stage from "./Stage";
import Painter from './Painter'
import XElement from "./xElements/XElement";

export default class Charon {
    stage: Stage;
    painter: Painter;
    constructor(dom: string | HTMLElement) {
        this.stage = new Stage();
        this.painter = new Painter(dom, this.stage)

    }
    add(...xelements: XElement[]) {
        this.stage.add(...xelements);
        this.render()
    }
    render() {
        this.painter.render()
    }
}
