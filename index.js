function extendObject (sourceObject, withObject) {
  const newObject = Object.assign({}, sourceObject)
  Object.keys(withObject).forEach(key => {
    newObject[key] = withObject[key]
  })
  return newObject
}

function wrapArray (a) {
  if (a === undefined) { return [] }
  if (Array.isArray(a)) { return a }
  else { return [ a ] }
}

function getChecks (rules, permission) {
  let checks = rules[permission]

  if (!checks) {
    checks = []
  } else if (checks.as) {
    checks = rules[checks.as]
  }

  if (Array.isArray(checks)) {
    checks = {
      allow: checks
    }
  }

  checks.allow = wrapArray(checks.allow)
  checks.deny  = wrapArray(checks.deny)
  checks.grant = wrapArray(checks.grant)

  return checks
}

class ABAC {
  constructor (rules) {
    if (!rules['*']) {
      rules['*'] = () => false
    }
    this.rules = rules
  }

  can (user, permission, resource) {
    const sources = [
      {
        checks: getChecks(this.rules, '*'),
        checkAction: check => check(user, permission, resource)
      },
      {
        checks: getChecks(this.rules, permission),
        checkAction: check => check(user, resource)
      }
    ]

    const checkResult = sources.some(source =>
      source.checks.grant.some(source.checkAction)
    ) || (
      !sources.some(source =>
        source.checks.deny.some(source.checkAction)
      ) && sources.some(source =>
        source.checks.allow.some(source.checkAction)
      )
    )

    return checkResult
  }

  cant (user, param, resource) {
    return !this.can(user, param, resource)
  }

  with (rules) {
    return new ABAC(extendObject( this.rules, rules ))
  }
}

module.exports = ABAC
