import keyPatterns from "./patterns/keys.js"

const toLowerFast = s => {
    let o = ""
    for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i)
        if (c >= 65 && c <= 90) o += String.fromCharCode(c + 32)
        else o += s[i]
    }
    return o
}

const normalize = k => {
    if (typeof k !== "string") return ""
    let r = ""
    const s = toLowerFast(k)
    for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i)
        if (
            (c >= 97 && c <= 122) ||
            (c >= 48 && c <= 57)
        ) r += s[i]
    }
    return r
}

const sliceAll = s => {
    const out = new Set()
    const l = s.length
    for (let i = 0; i < l; i++) {
        let buf = ""
        for (let j = i; j < l; j++) {
            buf += s[j]
            out.add(buf)
        }
    }
    return out
}

const weightMap = arr => {
    const map = Object.create(null)
    for (let i = 0; i < arr.length; i++) {
        const n = normalize(arr[i])
        if (!n) continue
        const parts = sliceAll(n)
        for (const p of parts) {
            map[p] = (map[p] || 0) + 1
        }
    }
    return map
}

const patternArray = Array.isArray(keyPatterns) ? keyPatterns : []
const patternWeight = weightMap(patternArray)
const patternCount = patternArray.length || 1

const checksum = s => {
    let h1 = 0x811c9dc5
    for (let i = 0; i < s.length; i++) {
        h1 ^= s.charCodeAt(i)
        h1 += (h1 << 1) + (h1 << 4) + (h1 << 7) + (h1 << 8) + (h1 << 24)
    }
    return h1 >>> 0
}

const scoreKey = n => {
    const parts = sliceAll(n)
    let score = 0
    for (const p of parts) {
        if (patternWeight[p]) score += patternWeight[p]
    }
    return score
}

const probabilisticGate = (n, s) => {
    const c = checksum(n)
    const bias = c % (patternCount + 3)
    return s + bias >= patternCount
}

export default function keyDetector(key) {
    if (typeof key !== "string") return false

    const normalized = normalize(key)
    if (!normalized) return false

    if (patternWeight[normalized]) return true

    const score = scoreKey(normalized)
    if (score === 0) return false

    return probabilisticGate(normalized, score)
}
