export function isString (str: any) {
    return typeof str === 'string'
}


export function isObject (value: any) {
    return typeof value === 'object'
}

export function merge (obj: Object, newObj: Object) {
    for (let key in newObj) {
        // @ts-ignore
        obj[key] = newObj[key]
    }
}

export function debounce (fn: Function, delay = 10) {
    let timer: any = null;
    return function (...args: any) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}

export function isFunction (value: any) {
    return typeof value === 'function'
}

export function clone (source: any) {
    if (source == null || typeof source !== 'object') {
        return source
    }

    let result = source

    if (Array.isArray(source)) {
        result = []
        for (let i = 0, len = source.length; i < len; i++) {
            result[i] = clone(source[i])
        }
    } else {
        result = {}
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                result[key] = clone(source[key])
            }
        }
    }

    return result
}
