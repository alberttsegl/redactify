const isObject = v => v !== null && typeof v === "object"

const createTracker = () => {
    const map = new WeakMap()
    const stack = []
    return { map, stack }
}

const pathKey = path => {
    if (!Array.isArray(path)) return ""
    let out = ""
    for (let i = 0; i < path.length; i++) {
        out += i === 0 ? String(path[i]) : "." + String(path[i])
    }
    return out
}

const resolvePlaceholder = (placeholder, path) => {
    if (!placeholder) return "[Circular]"
    if (typeof placeholder === "string") return placeholder
    if (typeof placeholder === "function") {
        try {
            return placeholder(pathKey(path))
        } catch {
            return "[Circular]"
        }
    }
    return "[Circular]"
}

const register = (tracker, obj, path) => {
    tracker.map.set(obj, pathKey(path))
    tracker.stack.push(obj)
}

const unregister = (tracker, obj) => {
    if (!tracker.map.has(obj)) return
    tracker.map.delete(obj)
    const idx = tracker.stack.lastIndexOf(obj)
    if (idx !== -1) tracker.stack.splice(idx, 1)
}

const lookup = (tracker, obj) => {
    if (!tracker.map.has(obj)) return null
    return tracker.map.get(obj)
}

export default function circularGuard(options) {
    const cfg = Object.create(null)
    cfg.placeholder = options?.placeholder
    const tracker = createTracker()

    return {
        enter(value, path) {
            if (!isObject(value)) {
                return {
                    circular: false,
                    value
                }
            }

            const refPath = lookup(tracker, value)
            if (refPath !== null) {
                return {
                    circular: true,
                    value: resolvePlaceholder(cfg.placeholder, path)
                }
            }

            register(tracker, value, path)
            return {
                circular: false,
                value
            }
        },

        exit(value) {
            if (isObject(value)) {
                unregister(tracker, value)
            }
            return value
        }
    }
}
