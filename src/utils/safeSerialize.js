export default function safeSerialize(input, options = {}) {
  const { truncate } = options
  const seen = new WeakSet()
  try {
    let str = JSON.stringify(input, (key, value) => {
      if (typeof value === "bigint") return value.toString()
      if (value instanceof Error) return { name: value.name, message: value.message, stack: value.stack }
      if (value && typeof value === "object") {
        if (seen.has(value)) return "[Circular]"
        seen.add(value)
      }
      return value
    })
    if (truncate && typeof truncate === "number" && str.length > truncate) {
      str = str.slice(0, truncate) + "…"
    }
    return str
  } catch {
    return "[Unserializable]"
  }
}
