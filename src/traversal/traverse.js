import deepClone from "./deepClone.js"
import circularGuard from "./circularGuard.js"

const isObject = v => v !== null && typeof v === "object"
const isArray = Array.isArray

const typeOf = v => {
    if (v === null) return "null"
    if (isArray(v)) return "array"
    return typeof v
}

const createContext = cfg => {
    const ctx = Object.create(null)
    ctx.maxDepth = typeof cfg?.depth === "number" ? cfg.depth : Infinity
    ctx.guard = circularGuard(cfg)
    return ctx
}

const walkPrimitive = (key, value, cb) => cb(key, value)

const walkArray = (arr, depth, path, ctx, cb) => {
    if (depth > ctx.maxDepth) return arr
    const out = new Array(arr.length)
    for (let i = 0; i < arr.length; i++) {
        const p = path.concat(i)
        const g = ctx.guard.enter(arr[i], p)
        if (g.circular) {
            out[i] = g.value
            continue
        }
        const v = internal(arr[i], depth + 1, p, ctx, cb)
        ctx.guard.exit(arr[i])
        out[i] = v
    }
    return out
}

const walkObject = (obj, depth, path, ctx, cb) => {
    if (depth > ctx.maxDepth) return obj
    const out = Object.create(Object.getPrototypeOf(obj))
    const keys = Reflect.ownKeys(obj)
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i]
        const p = path.concat(k)
        const val = obj[k]
        const g = ctx.guard.enter(val, p)
        if (g.circular) {
            out[k] = g.value
            continue
        }
        const v = internal(val, depth + 1, p, ctx, cb)
        ctx.guard.exit(val)
        out[k] = v
    }
    return out
}

const internal = (node, depth, path, ctx, cb) => {
    const t = typeOf(node)

    if (
        t === "string" ||
        t === "number" ||
        t === "boolean" ||
        t === "bigint" ||
        t === "undefined" ||
        t === "null"
    ) {
        return walkPrimitive(path[path.length - 1], node, cb)
    }

    if (t === "array") {
        const res = walkArray(node, depth, path, ctx, cb)
        return walkPrimitive(path[path.length - 1], res, cb)
    }

    if (t === "object") {
        const res = walkObject(node, depth, path, ctx, cb)
        return walkPrimitive(path[path.length - 1], res, cb)
    }

    return walkPrimitive(path[path.length - 1], node, cb)
}

export default function traverse(input, config, callback) {
    const cloned = deepClone(input)
    const ctx = createContext(config)
    return internal(cloned, 0, [], ctx, callback)
}
