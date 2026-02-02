import dispatcher from "../dispatcher.js"

const isObject = v => v && typeof v === "object" && !Array.isArray(v)

const sanitizeInfo = info => {
  const out = {}
  for (const k in info) {
    const v = info[k]
    if (k === "message") {
      out[k] = dispatcher([v]).join("")
      continue
    }
    if (k === "meta" && isObject(v)) {
      out[k] = dispatcher([v])[0]
      continue
    }
    if (isObject(v)) {
      out[k] = dispatcher([v])[0]
      continue
    }
    out[k] = dispatcher([v])[0]
  }
  return out
}

export default function wrapWinston(logger) {
  if (!logger || typeof logger.log !== "function") return logger

  const originalLog = logger.log.bind(logger)

  logger.log = function (...args) {
    if (args.length === 1 && isObject(args[0])) {
      return originalLog(sanitizeInfo(args[0]))
    }
    const normalized = dispatcher(args)
    return originalLog(...normalized)
  }

  return {
    logger,
    restore() {
      logger.log = originalLog
    }
  }
}
