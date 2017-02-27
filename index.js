module.exports = class ABAC {
  constructor (rules) {
    if (!rules['*']) {
      rules['*'] = () => false
    }
    this.rules = rules
  }

  can (user, param, resource) {
    return ['*', param].some(param => {
      let rules = this.rules[param]
      if (!rules) return false
      if (typeof rules === 'function') {
        rules = [ rules ]
      } else if (rules.as) {
        rules = this.rules[rules.as]
      }
      return rules.some(rule => {
        return rule(user, resource)
      })
    })
  }

  cant (user, param, resource) {
    return (!can(user, param, resource))
  }
}