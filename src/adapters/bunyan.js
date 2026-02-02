import dispatcher from "../dispatcher.js"

const isObject = v => v && typeof v === "object" && !Array.isArray(v)

const sanitizeRecord = record => {
  if (!isObject(record)) return record
  return dispatcher([record])[0]
}

export default function wrapBunyan(logger) {
  if (!logger || typeof logger.addStream !== "function") return logger

  const originalMethods = {}
  const levels = ["trace","debug","info","warn","error","fatal"]

  for (const level of levels) {
    if (typeof logger[level] !== "function") continue
    originalMethods[level] = logger[level].bind(logger)
    logger[level] = function (...args) {
      if (args.length === 1 && isObject(args[0])) {
        return originalMethods[level](sanitizeRecord(args[0]))
      }
      const out = dispatcher(args)
      return originalMethods[level](...out)
    }
  }

  return {
    logger,
    restore() {
      for (const lvl of levels) {
        if (originalMethods[lvl]) logger[lvl] = originalMethods[lvl]
      }
    }
  }
}
