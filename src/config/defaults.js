import PRESETS from "../patterns/presets.js";

const DEFAULTS = {
  preset: "default",
  placeholder: PRESETS.default.placeholder,
  depth: PRESETS.default.depth,
  mode: PRESETS.default.mode,
  entropy: {
    enabled: true,
    minLength: 20,
    threshold: 3.5
  },
  engine: {
    key: true,
    value: true,
    entropy: true
  },
  traversal: {
    circularPlaceholder: "[Circular]",
    clone: true
  }
};

export default DEFAULTS;
