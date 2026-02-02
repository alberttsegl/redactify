import traverse from "../traversal/traverse.js"
import sanitizeValue from "./sanitizeValue.js"
import keyDetector from "../engine/keyDetector.js"
import redactEngine from "../engine/redactEngine.js"

const isObject = v => v !== null && typeof v === "object"
const isArray = Array.isArray

const resolveKey = k => {
    if (typeof k === "string") return k
    if (typeof k === "symbol") return k.description || k.toString()
    return String(k)
}

const guardKey = (key, value, cfg) => {
    if (!cfg?.enableKey) return value
    if (!key) return value
    if (keyDetector(key)) {
        return redactEngine(key, value, cfg)
    }
    return value
}

const sanitizePair = (key, value, cfg) => {
    const v = sanitizeValue(key, value, cfg)
    return guardKey(key, v, cfg)
}

const walk = (input, cfg) => {
    return traverse(input, cfg, (key, value) => {
        return sanitizePair(key, value, cfg)
    })
}

const route = (value, cfg) => {
    if (!isObject(value)) {
        return sanitizeValue(undefined, value, cfg)
    }
    if (isArray(value)) {
        return walk(value, cfg)
    }
    return walk(value, cfg)
}

export default function sanitizeObject(value, config) {
    try {
        return route(value, config)
    } catch {
        return redactEngine(undefined, "[REDACTED]", config)
    }
}
