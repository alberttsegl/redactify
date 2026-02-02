import { REGEX_LIST } from "./regex.js";
import SENSITIVE_KEYS from "./keys.js";

const PRESETS = {
  default: {
    keys: SENSITIVE_KEYS,
    regex: REGEX_LIST,
    placeholder: "[REDACTED]",
    depth: 5,
    mode: "strict"
  },

  relaxed: {
    keys: SENSITIVE_KEYS,
    regex: REGEX_LIST,
    placeholder: "[REDACTED]",
    depth: 3,
    mode: "relaxed"
  },

  paranoid: {
    keys: SENSITIVE_KEYS,
    regex: REGEX_LIST,
    placeholder: "[REDACTED]",
    depth: 8,
    mode: "paranoid"
  }
};

export default PRESETS;
