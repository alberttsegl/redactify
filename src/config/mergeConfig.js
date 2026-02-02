import PRESETS from "../patterns/presets.js"
import DEFAULTS from "./defaults.js"

const isObject = v => v && typeof v === "object" && !Array.isArray(v)

const deepClone = v => {
  if (!isObject(v) && !Array.isArray(v)) return v
  if (Array.isArray(v)) return v.map(deepClone)
  const o = {}
  for (const k in v) o[k] = deepClone(v[k])
  return o
}

const deepMerge = (base, override) => {
  const out = deepClone(base)
  for (const k in override) {
    if (!(k in base)) continue
    const bv = base[k]
    const ov = override[k]
    if (isObject(bv) && isObject(ov)) {
      out[k] = deepMerge(bv, ov)
    } else {
      out[k] = deepClone(ov)
    }
  }
  return out
}

const normalize = cfg => {
  const c = deepClone(cfg)
  if (typeof c.depth !== "number" || c.depth < 0) c.depth = DEFAULTS.depth
  if (typeof c.placeholder !== "string") c.placeholder = DEFAULTS.placeholder
  if (!["strict", "relaxed", "paranoid"].includes(c.mode)) c.mode = DEFAULTS.mode
  if (!isObject(c.entropy)) c.entropy = DEFAULTS.entropy
  if (!isObject(c.engine)) c.engine = DEFAULTS.engine
  if (!isObject(c.traversal)) c.traversal = DEFAULTS.traversal
  return c
}

export default function mergeConfig(userConfig = {}) {
  const presetName =
    typeof userConfig.preset === "string" && PRESETS[userConfig.preset]
      ? userConfig.preset
      : DEFAULTS.preset

  const preset = PRESETS[presetName]
  const step1 = deepMerge(DEFAULTS, preset)
  const step2 = deepMerge(step1, userConfig)
  return normalize(step2)
}
