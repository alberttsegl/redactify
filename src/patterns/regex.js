const REGEX_PATTERNS = {
  jwt: {
    name: "JWT",
    severity: "critical",
    regex: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9._-]{10,}\.[A-Za-z0-9._-]{10,}\b/,
    description: "JSON Web Token format"
  },

  bearerToken: {
    name: "Bearer Token",
    severity: "critical",
    regex: /\bBearer\s+[A-Za-z0-9\-._~+/]+=*\b/i,
    description: "HTTP Authorization Bearer token"
  },

  oauthToken: {
    name: "OAuth Access Token",
    severity: "high",
    regex: /\b(access|refresh)[-_ ]?token\b[\s:=]+[A-Za-z0-9\-._~+/]{20,}/i,
    description: "OAuth style access / refresh token"
  },

  awsAccessKey: {
    name: "AWS Access Key ID",
    severity: "critical",
    regex: /\bAKIA[0-9A-Z]{16}\b/,
    description: "AWS Access Key ID"
  },

  awsSecretKey: {
    name: "AWS Secret Key",
    severity: "critical",
    regex: /\b[A-Za-z0-9/+=]{40}\b/,
    description: "AWS Secret Access Key"
  },

  googleApiKey: {
    name: "Google API Key",
    severity: "high",
    regex: /\bAIza[0-9A-Za-z\-_]{35}\b/,
    description: "Google API key format"
  },

  githubToken: {
    name: "GitHub Token",
    severity: "high",
    regex: /\bgh[pousr]_[A-Za-z0-9]{36,255}\b/,
    description: "GitHub token"
  },

  stripeKey: {
    name: "Stripe API Key",
    severity: "critical",
    regex: /\bsk_(live|test)_[0-9a-zA-Z]{24,}\b/,
    description: "Stripe secret key"
  },

  genericApiKey: {
    name: "Generic API Key",
    severity: "medium",
    regex: /\bapi[_-]?key\b[\s:=]+[A-Za-z0-9\-._]{16,}/i,
    description: "Generic API key pattern"
  },

  creditCard: {
    name: "Credit Card Number",
    severity: "critical",
    regex: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/,
    description: "Credit card number"
  },

  cvv: {
    name: "Card CVV",
    severity: "critical",
    regex: /\b(cvv|cvc|cvv2)\b[\s:=]+[0-9]{3,4}\b/i,
    description: "Card verification value"
  },

  email: {
    name: "Email",
    severity: "medium",
    regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    description: "Email address"
  },

  phoneNumber: {
    name: "Phone Number",
    severity: "medium",
    regex: /\b(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{3,4}[\s-]?\d{4}\b/,
    description: "Phone number"
  },

  nationalId: {
    name: "National ID",
    severity: "high",
    regex: /\b\d{8,16}\b/,
    description: "National identification number"
  },

  privateKeyBlock: {
    name: "Private Key",
    severity: "critical",
    regex: /-----BEGIN (RSA|EC|DSA|OPENSSH|PRIVATE) KEY-----[\s\S]+?-----END (RSA|EC|DSA|OPENSSH|PRIVATE) KEY-----/,
    description: "Private key block"
  },

  hexSecret: {
    name: "Hex Secret",
    severity: "high",
    regex: /\b[a-f0-9]{32,128}\b/i,
    description: "Hex encoded secret"
  },

  base64Secret: {
    name: "Base64 Secret",
    severity: "high",
    regex: /\b[A-Za-z0-9+/]{32,}={0,2}\b/,
    description: "Base64 encoded secret"
  },

  uuid: {
    name: "UUID",
    severity: "low",
    regex: /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i,
    description: "UUID"
  }
};

const REGEX_LIST = Object.values(REGEX_PATTERNS);

export {
  REGEX_PATTERNS,
  REGEX_LIST
};
