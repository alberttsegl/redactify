import pipeline from "./pipeline.js"
import isType from "../utils/isType.js"
import noop from "../utils/noop.js"

const boxPrimitive = v => {
    if (v === null) return null
    const t = typeof v
    if (t === "string") return v
    if (t === "number") return v
    if (t === "boolean") return v
    if (t === "bigint") return v
    if (t === "undefined") return undefined
    try {
        return String(v)
    } catch {
        return undefined
    }
}

const normalizeOne = (arg, cfg) => {
    if (isType.error(arg)) return pipeline(arg, cfg)
    if (isType.array(arg)) return pipeline(arg, cfg)
    if (isType.object(arg)) return pipeline(arg, cfg)
    if (isType.string(arg)) return pipeline(arg, cfg)
    if (isType.primitive(arg)) return pipeline(boxPrimitive(arg), cfg)
    return pipeline(boxPrimitive(arg), cfg)
}

const normalizeAll = (args, cfg) => {
    const out = []
    for (let i = 0; i < args.length; i++) {
        try {
            out.push(normalizeOne(args[i], cfg))
        } catch {
            out.push(noop())
        }
    }
    return out
}

const flattenArgs = input => {
    const out = []
    for (let i = 0; i < input.length; i++) {
        out.push(input[i])
    }
    return out
}

export default function dispatcher() {
    const args = flattenArgs(arguments)
    const cfg =
        args.length > 0 &&
        isType.object(args[args.length - 1]) &&
        args[args.length - 1]?.__config === true
            ? args.pop()
            : undefined

    if (args.length === 0) return []

    return normalizeAll(args, cfg)
}
