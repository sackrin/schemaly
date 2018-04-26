import _ from 'lodash'

export class Allow {
  roles = []

  scope = []

  constructor (roles, scope) {
    this.roles = [...this.roles, ...roles]
    this.scope = [...this.scope, ...scope]
    this.grant = this.grant.bind(this)
    this.getRoles = this.getRoles.bind(this)
    this.getScope = this.getScope.bind(this)
  }

  grant (roles, scope) {
    return new Promise(function (resolve, reject) {
      resolve(true)
    })
  }

  async getRoles () {
    return _.reduce(this.roles, async (collect, role) => {
      return !_.isFunction(role) ? [...await collect, role] : [...collect, ...await role()]
    }, Promise.all([]))
  }

  async getScope () {
    return _.reduce(this.scope, async (collect, scope) => {
      return !_.isFunction(scope) ? [...await collect, scope] : [...collect, ...await scope()]
    }, Promise.all([]))
  }
}
