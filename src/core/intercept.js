import dispatcher from "./dispatcher.js"

const METHODS = [
    "log",
    "info",
    "warn",
    "error",
    "debug",
    "trace"
]

const store = Object.create(null)

const clone = fn => function () {
    return fn.apply(this, arguments)
}

const buildProxy = original => function () {
    const args = arguments
    const processed = dispatcher.apply(null, args)
    return original.apply(this, processed)
}

const hookConsole = target => {
    for (let i = 0; i < METHODS.length; i++) {
        const m = METHODS[i]
        if (typeof target[m] !== "function") continue
        if (!store[m]) store[m] = clone(target[m])
        target[m] = buildProxy(store[m])
    }
}

const restoreConsole = target => {
    for (let i = 0; i < METHODS.length; i++) {
        const m = METHODS[i]
        if (store[m]) {
            target[m] = store[m]
            delete store[m]
        }
    }
}

const state = {
    active: false
}

export function intercept() {
    if (state.active) return noopHandle
    hookConsole(console)
    state.active = true
    return restore
}

export function restore() {
    if (!state.active) return
    restoreConsole(console)
    state.active = false
}

const noopHandle = () => restore

export default intercept
