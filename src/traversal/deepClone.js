const isObject = v => v !== null && typeof v === "object"

const tagOf = v => Object.prototype.toString.call(v)

const cloneDate = v => new Date(v.getTime())

const cloneRegExp = v => new RegExp(v.source, v.flags)

const cloneArrayBuffer = v => v.slice(0)

const cloneTypedArray = v => new v.constructor(v)

const cloneArray = (v, seen) => {
    const out = new Array(v.length)
    seen.set(v, out)
    for (let i = 0; i < v.length; i++) {
        const el = v[i]
        out[i] = isObject(el) ? internal(el, seen) : el
    }
    return out
}

const cloneMap = (v, seen) => {
    const out = new Map()
    seen.set(v, out)
    v.forEach((val, key) => {
        const k = isObject(key) ? internal(key, seen) : key
        const vv = isObject(val) ? internal(val, seen) : val
        out.set(k, vv)
    })
    return out
}

const cloneSet = (v, seen) => {
    const out = new Set()
    seen.set(v, out)
    v.forEach(val => {
        const vv = isObject(val) ? internal(val, seen) : val
        out.add(vv)
    })
    return out
}

const cloneObject = (v, seen) => {
    const out = Object.create(Object.getPrototypeOf(v))
    seen.set(v, out)
    const keys = Reflect.ownKeys(v)
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i]
        const d = Object.getOwnPropertyDescriptor(v, k)
        if (!d) continue
        if ("value" in d) {
            const val = d.value
            d.value = isObject(val) ? internal(val, seen) : val
        }
        Object.defineProperty(out, k, d)
    }
    return out
}

const internal = (v, seen) => {
    if (!isObject(v)) return v
    if (seen.has(v)) return seen.get(v)

    const tag = tagOf(v)

    if (tag === "[object Date]") return cloneDate(v)
    if (tag === "[object RegExp]") return cloneRegExp(v)
    if (tag === "[object Array]") return cloneArray(v, seen)
    if (tag === "[object Map]") return cloneMap(v, seen)
    if (tag === "[object Set]") return cloneSet(v, seen)
    if (tag === "[object ArrayBuffer]") return cloneArrayBuffer(v)

    if (
        tag === "[object Int8Array]" ||
        tag === "[object Uint8Array]" ||
        tag === "[object Uint8ClampedArray]" ||
        tag === "[object Int16Array]" ||
        tag === "[object Uint16Array]" ||
        tag === "[object Int32Array]" ||
        tag === "[object Uint32Array]" ||
        tag === "[object Float32Array]" ||
        tag === "[object Float64Array]" ||
        tag === "[object BigInt64Array]" ||
        tag === "[object BigUint64Array]"
    ) return cloneTypedArray(v)

    return cloneObject(v, seen)
}

export default function deepClone(input) {
    if (!isObject(input)) return input
    return internal(input, new WeakMap())
}
