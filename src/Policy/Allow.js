import _ from 'lodash';

export class Allow {
  roles = []

  scope = []

  constructor (roles, scope) {
    this.roles = [...this.roles, ...roles];
    this.scope = [...this.scope, ...scope];
    this.grant = this.grant.bind(this);
    this.getRoles = this.getRoles.bind(this);
    this.getScope = this.getScope.bind(this);
  }

  async getRoles () {
    return _.reduce(this.roles, async (collect, role) => (!_.isFunction(role) ? [...await collect, role] : [...collect, ...await role()]), Promise.all([]));
  }

  async getScope () {
    return _.reduce(this.scope, async (collect, scope) => (!_.isFunction(scope) ? [...await collect, scope] : [...collect, ...await scope()]), Promise.all([]));
  }

  async grant (isotope, roles, scope) {
    // Retrieve the roles array for this policy
    const forRoles = await this.getRoles();
    // Retrieve and build the roles array from the provided roles
    const againstRoles = await _.reduce(roles, async (collect, role) => (!_.isFunction(role) ? [...await collect, role] : [...collect, ...await role()]), Promise.all([]));
    // Conduct a compare check of the two roles arrays
    const roleCheck = _.difference(againstRoles, forRoles);
    // If none of the provided roles were found and this policy does not allow wildcare then return false
    if (roleCheck.length === againstRoles.length && forRoles.indexOf('*') === -1) {
      return false;
    }

    const forScopes = await this.getScope();
    const againstScopes = await _.reduce(scope, async (collect, role) => (!_.isFunction(role) ? [...await collect, role] : [...collect, ...await role()]), Promise.all([]));

    const scopeCheck = _.difference(againstScopes, forScopes);

    if (scopeCheck.length === againstScopes.length && forScopes.indexOf('*') === -1) {
      return false;
    }

    return true;
  }
}
