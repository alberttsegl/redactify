const internal = require("./src/index.js").default

const redactify = {
  init(options = {}) {
    internal.init(options)
  },
  wrapConsole() {
    internal.wrapConsole()
  },
  wrapStream(stream) {
    return internal.wrapStream(stream)
  },
  getSanitizer() {
    return internal.getSanitizer()
  },
  adapters: internal.adapters,
  utils: internal.utils
}

module.exports = redactify
