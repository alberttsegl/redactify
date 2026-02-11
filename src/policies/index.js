import devPolicy from './development.js'
import prodPolicy from './production.js'
import auditPolicy from './audit.js'

const POLICIES = {
  development: devPolicy,
  production: prodPolicy,
  audit: auditPolicy
}

export default POLICIES