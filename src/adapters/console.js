import dispatcher from "../dispatcher.js"

const methods = ["log", "info", "warn", "error"]

const original = {}
const active = {}

const bind = fn => Function.prototype.bind.call(fn, console)

const captureOriginal = () => {
  for (const m of methods) {
    if (typeof console[m] === "function") {
      original[m] = bind(console[m])
    }
  }
}

const proxy = method => {
  return function (...args) {
    const out = dispatcher(args)
    return original[method](...out)
  }
}

const install = () => {
  captureOriginal()
  for (const m of methods) {
    if (!original[m]) continue
    const wrapped = proxy(m)
    active[m] = wrapped
    console[m] = wrapped
  }
}

const restore = () => {
  for (const m of methods) {
    if (original[m]) {
      console[m] = original[m]
    }
  }
}

const isInstalled = () => {
  for (const m of methods) {
    if (console[m] !== active[m]) return false
  }
  return true
}

export default {
  install,
  restore,
  isInstalled
}
