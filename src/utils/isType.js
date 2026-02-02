export const isObject = v => v && typeof v === "object" && !Array.isArray(v)
export const isArray = v => Array.isArray(v)
export const isString = v => typeof v === "string"
export const isPrimitive = v => v === null || (typeof v !== "object" && typeof v !== "function")
