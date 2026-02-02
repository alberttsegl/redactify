let enabled = false

export const setDebug = flag => { enabled = !!flag }

export default function logger(...args) {
  if (!enabled) return
  try {
    const out = args.map(a => {
      if (typeof a === "string") return a
      if (a instanceof Error) return `${a.name}: ${a.message}`
      try { return JSON.stringify(a) } catch { return "[Unserializable]" }
    }).join(" ")
    process.stderr.write(`[Redactify Debug] ${out}\n`)
  } catch {}
}
