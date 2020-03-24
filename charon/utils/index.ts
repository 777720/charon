export function isString (str: any) {
    return typeof str === 'string'
}

export function merge (obj: Object, newObj: Object) {
    for (let key in newObj) {
        // @ts-ignore
        obj[key] = newObj[key]
    }
}
