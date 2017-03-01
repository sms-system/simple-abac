class ABAC {
  constructor (rules) {
    if (!rules['*']) {
      rules['*'] = () => false
    }
    this.rules = rules
  }

  can (user, param, resource) {
    return ['*', param].some((_param, i) => {
      let rules = this.rules[_param]
      if (!rules) return false
      if (typeof rules === 'function') {
        rules = [ rules ]
      } else if (rules.as) {
        rules = this.rules[rules.as]
      }
      return rules.some(rule => {
        return i == 0?
          rule(user, param, resource) : rule(user, resource)
      })
    })
  }

  cant (user, param, resource) {
    return (!this.can(user, param, resource))
  }

  with (rules) {
    let newRules = Object.assign({}, this.rules)
    Object.keys(rules).forEach(param => {
      newRules[param] = rules[param]
    })
    return new ABAC(newRules)
  }
}

module.exports = ABAC
