import regexPatterns from "./patterns/regex.js"

const typeGuard = v => {
    if (v === null || v === undefined) return ""
    if (typeof v === "string") return v
    if (typeof v === "number" || typeof v === "bigint") return String(v)
    if (typeof v === "boolean") return v ? "true" : "false"
    try {
        return String(v)
    } catch {
        return ""
    }
}

const normalize = s => {
    let o = ""
    for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i)
        if (
            (c >= 48 && c <= 57) ||
            (c >= 65 && c <= 90) ||
            (c >= 97 && c <= 122) ||
            c === 43 || c === 47 || c === 61 || c === 45 || c === 95 || c === 46
        ) o += s[i]
    }
    return o
}

const splitWindows = (s, min, max) => {
    const out = []
    const l = s.length
    for (let size = min; size <= max; size++) {
        for (let i = 0; i + size <= l; i++) {
            out.push(s.slice(i, i + size))
        }
    }
    return out
}

const buildMatcher = patterns => {
    const list = []
    for (let i = 0; i < patterns.length; i++) {
        const p = patterns[i]
        if (p instanceof RegExp) list.push(p)
    }
    return list
}

const matcherList = buildMatcher(
    Array.isArray(regexPatterns) ? regexPatterns : []
)

const directMatch = s => {
    for (let i = 0; i < matcherList.length; i++) {
        if (matcherList[i].test(s)) return true
    }
    return false
}

const fragmentMatch = s => {
    const windows = splitWindows(s, 8, 64)
    for (let i = 0; i < windows.length; i++) {
        const w = windows[i]
        for (let j = 0; j < matcherList.length; j++) {
            if (matcherList[j].test(w)) return true
        }
    }
    return false
}

const layeredMatch = s => {
    if (directMatch(s)) return true
    const n = normalize(s)
    if (!n || n.length < 8) return false
    if (directMatch(n)) return true
    return fragmentMatch(n)
}

export default function valueDetector(value) {
    const raw = typeGuard(value)
    if (!raw) return false
    if (raw.length < 6) return false
    return layeredMatch(raw)
}
