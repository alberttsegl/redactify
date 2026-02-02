import redactEngine from "../engine/redactEngine.js"
import mergeConfig from "../config/mergeConfig.js"
import defaultConfig from "../config/defaults.js"
import traverse from "../traversal/index.js"
import sanitize from "../sanitizers/index.js"

const typeOf = v => {
    if (v === null) return "null"
    if (Array.isArray(v)) return "array"
    if (v instanceof Error) return "error"
    return typeof v
}

const wrapError = e => {
    const out = Object.create(null)
    out.name = e.name
    out.message = e.message
    out.stack = e.stack
    return out
}

const normalizeInput = input => {
    const t = typeOf(input)
    if (t === "error") return wrapError(input)
    return input
}

const processPrimitive = (key, value, cfg) => {
    const sanitized = sanitize(value, cfg)
    return redactEngine(key, sanitized, cfg)
}

const processNode = (node, cfg) => {
    return traverse(node, cfg, (key, value) => {
        return processPrimitive(key, value, cfg)
    })
}

const route = (input, cfg) => {
    const t = typeOf(input)

    if (
        t === "string" ||
        t === "number" ||
        t === "boolean" ||
        t === "bigint" ||
        t === "undefined" ||
        t === "null"
    ) {
        return processPrimitive(undefined, input, cfg)
    }

    if (t === "array" || t === "object") {
        return processNode(input, cfg)
    }

    return processPrimitive(undefined, String(input), cfg)
}

export default function pipeline(input, userConfig) {
    const cfg = mergeConfig(defaultConfig, userConfig)
    const normalized = normalizeInput(input)
    return route(normalized, cfg)
}
