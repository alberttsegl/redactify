import mergeConfig from "./config/mergeConfig.js"
import pipeline from "./core/pipeline.js"
import intercept from "./core/intercept.js"
import * as adapters from "./adapters/index.js"
import * as traversal from "./traversal/index.js"
import * as sanitizers from "./sanitizers/index.js"
import * as utils from "./utils/index.js"

let activeConfig = null
let initialized = false

const initRedactify = (userConfig = {}) => {
  if (initialized) return
  activeConfig = mergeConfig(userConfig)
  intercept(activeConfig)
  initialized = true
}

const wrapConsole = () => {
  if (!initialized) initRedactify()
  if (adapters.console && typeof adapters.console.install === "function") {
    adapters.console.install()
  }
}

const wrapStream = (stream) => {
  if (!initialized) initRedactify()
  if (adapters.stream && typeof adapters.stream === "function") {
    return adapters.stream(stream)
  }
  return stream
}

const getSanitizer = () => {
  if (!initialized) initRedactify()
  return {
    pipeline,
    sanitizers,
    traversal
  }
}

const getAdapters = () => ({
  console: adapters.console,
  stream: adapters.stream,
  winston: adapters.winston,
  pino: adapters.pino,
  bunyan: adapters.bunyan
})

export default {
  init: initRedactify,
  wrapConsole,
  wrapStream,
  getSanitizer,
  adapters: getAdapters(),
  utils
}
