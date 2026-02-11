const internal = require("./mergeConfigWithPolicy.js").default
const engine = require("./engine/redactEngine.js")
const traversal = require("./traversal/traverse.js")
const sanitizers = require("./sanitizers/sanitizeObject.js")
const adapters = {
  console: require("./adapters/console.js"),
  stream: require("./adapters/stream.js"),
  winston: require("./adapters/winston.js"),
  pino: require("./adapters/pino.js"),
  bunyan: require("./adapters/bunyan.js")
}
const utils = {
  isType: require("./utils/isType.js"),
  safeSerialize: require("./utils/safeSerialize.js"),
  logger: require("./utils/logger.js"),
  noop: require("./utils/noop.js")
}

const configStore = {}

const redactifyInternal = {
  init(options = {}) {
    configStore.config = internal(options)
    engine.init(configStore.config)
    traversal.init && traversal.init(configStore.config)
    sanitizers.init && sanitizers.init(configStore.config)
  },
  wrapConsole() {
    if (!configStore.config) throw new Error("redactify not initialized")
    adapters.console.wrap && adapters.console.wrap(configStore.config)
  },
  wrapStream(stream) {
    if (!configStore.config) throw new Error("redactify not initialized")
    return adapters.stream.wrap
      ? adapters.stream.wrap(stream, configStore.config)
      : stream
  },
  getSanitizer() {
    if (!configStore.config) throw new Error("redactify not initialized")
    return sanitizers.sanitizeObject || sanitizers.sanitizeValue || sanitizers.sanitizeString
  },
  adapters,
  utils
}

module.exports = redactifyInternal