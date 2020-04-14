import Charon, {CharonOptions} from './Charon';


export { default as  Circle } from './xElements/Circle'
export { default as Rect } from './xElements/Rect'

export function init(dom: string | HTMLElement, opt?: CharonOptions) {
    return new Charon(dom, opt)
}
