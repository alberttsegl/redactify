import dispatcher from "../dispatcher.js"

const isFunction = v => typeof v === "function"

const normalizeChunk = (chunk, encoding) => {
  if (Buffer.isBuffer(chunk)) return chunk.toString(encoding || "utf8")
  if (typeof chunk === "string") return chunk
  return String(chunk)
}

export default function wrapStream(stream) {
  if (!stream || !isFunction(stream.write)) return stream

  const originalWrite = stream.write.bind(stream)
  let enabled = true

  const wrappedWrite = function (chunk, encoding, cb) {
    if (!enabled) {
      return originalWrite(chunk, encoding, cb)
    }

    const data = normalizeChunk(chunk, encoding)
    const sanitized = dispatcher([data]).join("")

    if (isFunction(cb)) {
      return originalWrite(sanitized, encoding, cb)
    }

    return originalWrite(sanitized, encoding)
  }

  stream.write = wrappedWrite

  return {
    stream,
    restore() {
      stream.write = originalWrite
      enabled = false
    },
    disable() {
      enabled = false
    },
    enable() {
      enabled = true
    }
  }
}
