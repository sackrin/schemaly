import _ from 'lodash';
import { buildRoles, buildScope } from './utils';

export class Deny {
  roles = [];

  scope = [];

  constructor (roles, scope) {
    this.roles = [...this.roles, ...roles];
    this.scope = [...this.scope, ...scope];
    this.grant = this.grant.bind(this);
    this.getRoles = this.getRoles.bind(this);
    this.getScope = this.getScope.bind(this);
  }

  async getRoles () {
    return buildRoles(this.roles);
  }

  async getScope () {
    return buildScope(this.scope);
  }

  async grant (isotope, roles, scope) {
    // Retrieve the roles array for this policy
    const forRoles = await buildRoles(this.roles);
    // Retrieve and build the roles array from the provided roles
    const againstRoles = await buildRoles(roles);
    // Conduct a compare check of the two roles arrays
    const roleCheck = _.difference(againstRoles, forRoles);
    // If none of the provided roles were found and this policy does not allow wildcare then grant
    if (roleCheck.length === againstRoles.length && forRoles.indexOf('*') === -1) return true;
    // Retrieve the scope for this policy
    const forScopes = await buildScope(this.scope);
    // Retrieve the scope passed to this policy
    const againstScopes = await buildScope(scope);
    // Conduct a compare check of the two scope arrays
    const scopeCheck = _.difference(againstScopes, forScopes);
    // Return a grant pass if mismatch or wildcard is not located
    return (scopeCheck.length === againstScopes.length && forScopes.indexOf('*') === -1);
  }
}
