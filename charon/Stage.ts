import XElement from "./xElements/XElement";

class Stage {
    xelements: XElement[] = [];

    constructor() {
        console.log('Stage')
    }

    add (...xelements: XElement[]) {
        this.xelements.push(...xelements)
    }

    delete (xel: XElement) {
        let index = this.xelements.indexOf(xel)
        if (index > -1) {
            this.xelements.splice(index)
        }
    }
    getAll () {
        return this.xelements
    }
}

export default Stage;
