import dispatcher from "../dispatcher.js"

const isObject = v => v && typeof v === "object" && !Array.isArray(v)

const sanitizePinoObj = obj => {
  if (!isObject(obj)) return obj
  return dispatcher([obj])[0]
}

export default function wrapPino(logger) {
  if (!logger || typeof logger.info !== "function") return logger

  const methods = ["info","warn","error","debug","trace","fatal"]
  const original = {}

  for (const m of methods) {
    if (typeof logger[m] !== "function") continue
    original[m] = logger[m].bind(logger)
    logger[m] = function (...args) {
      if (args.length === 1 && isObject(args[0])) {
        return original[m](sanitizePinoObj(args[0]))
      }
      const out = dispatcher(args)
      return original[m](...out)
    }
  }

  return {
    logger,
    restore() {
      for (const m of methods) {
        if (original[m]) logger[m] = original[m]
      }
    }
  }
}
