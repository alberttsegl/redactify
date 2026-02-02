import keyDetector from "./keyDetector.js"
import valueDetector from "./valueDetector.js"
import entropy from "./entropy.js"

const toPrimitive = v => {
    if (v === null || v === undefined) return v
    const t = typeof v
    if (t === "string" || t === "number" || t === "boolean" || t === "bigint") return v
    try {
        return String(v)
    } catch {
        return v
    }
}

const mergeConfig = c => {
    const base = Object.create(null)
    base.placeholder = "[REDACTED]"
    base.enableKey = true
    base.enableValue = true
    base.enableEntropy = true
    base.forceString = false
    if (!c || typeof c !== "object") return base
    if (typeof c.placeholder === "string") base.placeholder = c.placeholder
    if (typeof c.enableKey === "boolean") base.enableKey = c.enableKey
    if (typeof c.enableValue === "boolean") base.enableValue = c.enableValue
    if (typeof c.enableEntropy === "boolean") base.enableEntropy = c.enableEntropy
    if (typeof c.forceString === "boolean") base.forceString = c.forceString
    return base
}

const redact = (placeholder, original, force) => {
    if (!force) return placeholder
    return typeof original === "string" ? placeholder : String(placeholder)
}

const decide = (key, value, cfg) => {
    if (cfg.enableKey && keyDetector(key)) return true
    if (cfg.enableValue && valueDetector(value)) return true
    if (cfg.enableEntropy && entropy(value)) return true
    return false
}

export default function redactEngine(key, value, config) {
    const cfg = mergeConfig(config)
    const v = toPrimitive(value)
    if (decide(key, v, cfg)) {
        return redact(cfg.placeholder, v, cfg.forceString)
    }
    return v
}
