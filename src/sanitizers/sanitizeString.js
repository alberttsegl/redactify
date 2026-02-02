import valueDetector from "../engine/valueDetector.js"
import entropy from "../engine/entropy.js"
import regexPatterns from "../patterns/regex.js"

const isString = v => typeof v === "string"

const normalize = s => {
    let o = ""
    for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i)
        if (c >= 32 && c <= 126) o += s[i]
    }
    return o
}

const maskMiddle = s => {
    if (s.length <= 4) return "*".repeat(s.length)
    const keep = Math.max(2, Math.floor(s.length * 0.2))
    const head = s.slice(0, keep)
    const tail = s.slice(-keep)
    return head + "*".repeat(s.length - keep * 2) + tail
}

const hardRedact = cfg =>
    typeof cfg?.placeholder === "string" ? cfg.placeholder : "[REDACTED]"

const regexScan = s => {
    if (!Array.isArray(regexPatterns)) return false
    for (let i = 0; i < regexPatterns.length; i++) {
        const r = regexPatterns[i]
        if (r instanceof RegExp && r.test(s)) return true
    }
    return false
}

const shouldMask = (s, cfg) => {
    if (cfg?.mode === "mask") return true
    if (cfg?.mode === "strict") return false
    return s.length > 8
}

export default function sanitizeString(value, config) {
    if (!isString(value)) return value

    const raw = normalize(value)
    if (!raw) return value

    let suspicious = false

    if (valueDetector(raw)) suspicious = true
    else if (regexScan(raw)) suspicious = true
    else if (entropy(raw)) suspicious = true

    if (!suspicious) return value

    if (shouldMask(raw, config)) {
        return maskMiddle(raw)
    }

    return hardRedact(config)
}
