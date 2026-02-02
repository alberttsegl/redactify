const toStringSafe = v => {
    if (typeof v === "string") return v
    try {
        return String(v)
    } catch {
        return ""
    }
}

const charStats = s => {
    const freq = Object.create(null)
    let unique = 0
    for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i)
        if (freq[c] === undefined) {
            freq[c] = 1
            unique++
        } else {
            freq[c]++
        }
    }
    return { freq, unique }
}

const shannonEntropy = (freq, len) => {
    let e = 0
    for (const k in freq) {
        const p = freq[k] / len
        e -= p * Math.log2(p)
    }
    return e
}

const runAnalysis = s => {
    let maxRun = 1
    let current = 1
    for (let i = 1; i < s.length; i++) {
        if (s[i] === s[i - 1]) {
            current++
            if (current > maxRun) maxRun = current
        } else {
            current = 1
        }
    }
    return maxRun
}

const charClassProfile = s => {
    let lower = 0
    let upper = 0
    let digit = 0
    let other = 0
    for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i)
        if (c >= 97 && c <= 122) lower++
        else if (c >= 65 && c <= 90) upper++
        else if (c >= 48 && c <= 57) digit++
        else other++
    }
    return { lower, upper, digit, other }
}

const balanceScore = profile => {
    const total = profile.lower + profile.upper + profile.digit + profile.other
    if (total === 0) return 0
    const ratios = [
        profile.lower / total,
        profile.upper / total,
        profile.digit / total,
        profile.other / total
    ]
    let variance = 0
    const mean = 0.25
    for (let i = 0; i < ratios.length; i++) {
        const d = ratios[i] - mean
        variance += d * d
    }
    return 1 - Math.min(1, variance * 4)
}

const windowEntropy = (s, size) => {
    let max = 0
    for (let i = 0; i + size <= s.length; i++) {
        const slice = s.slice(i, i + size)
        const { freq } = charStats(slice)
        const e = shannonEntropy(freq, slice.length)
        if (e > max) max = e
    }
    return max
}

const heuristicScore = s => {
    const len = s.length
    if (len < 12) return 0

    const stats = charStats(s)
    const entropy = shannonEntropy(stats.freq, len)
    const runPenalty = runAnalysis(s)
    const classProfile = charClassProfile(s)
    const balance = balanceScore(classProfile)
    const localEntropy = windowEntropy(s, Math.min(16, Math.floor(len / 2)))

    let score = 0
    score += entropy / Math.log2(len)
    score += localEntropy / Math.log2(16)
    score += balance
    score -= Math.min(1, runPenalty / len)

    return score / 3
}

export default function entropy(value) {
    const s = toStringSafe(value)
    if (!s) return false

    const score = heuristicScore(s)
    return score > 0.72
}
