import sanitizeObject from "./sanitizeObject.js"
import sanitizeString from "./sanitizeString.js"
import redactEngine from "../engine/redactEngine.js"

const isPrimitive = v =>
    v === null ||
    v === undefined ||
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean" ||
    typeof v === "bigint"

const isFunction = v => typeof v === "function"
const isSymbol = v => typeof v === "symbol"
const isObject = v => v !== null && typeof v === "object"

const safeStringify = v => {
    try {
        return String(v)
    } catch {
        return "[Unserializable]"
    }
}

const fallback = (key, value, cfg) => {
    try {
        return redactEngine(key, safeStringify(value), cfg)
    } catch {
        return cfg?.placeholder || "[REDACTED]"
    }
}

export default function sanitizeValue(key, value, config) {
    try {
        if (isPrimitive(value)) {
            if (typeof value === "string") {
                const sanitized = sanitizeString(value, config)
                return redactEngine(key, sanitized, config)
            }
            return redactEngine(key, value, config)
        }

        if (isFunction(value)) {
            return redactEngine(
                key,
                `[Function${value.name ? ":" + value.name : ""}]`,
                config
            )
        }

        if (isSymbol(value)) {
            return redactEngine(
                key,
                `[Symbol${value.description ? ":" + value.description : ""}]`,
                config
            )
        }

        if (isObject(value)) {
            const sanitized = sanitizeObject(value, config)
            return redactEngine(key, sanitized, config)
        }

        return fallback(key, value, config)
    } catch {
        return fallback(key, value, config)
    }
}
