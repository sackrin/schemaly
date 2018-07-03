import _ from 'lodash';
import { getMixedResult } from '../Utils';

export class Deny {
  roles = [];

  scope = [];

  options;

  constructor ({ roles, scope, ...options }) {
    this.roles = _.isArray(roles) ? roles : [ roles ];
    this.scope = _.isArray(scope) ? scope : [ scope ];
    this.options = options;
  }

  getRoles = async ({ ...options }) => {
    return getMixedResult(this.roles, { policy: this.options, ...options });
  };

  getScope = async ({ ...options }) => {
    return getMixedResult(this.scope, { policy: this.options, ...options });
  };

  grant = async ({ isotope, roles, scope, ...options }) => {
    // Retrieve the roles array for this policy
    const forRoles = await getMixedResult(this.roles, options);
    // Retrieve and build the roles array from the provided roles
    const againstRoles = await getMixedResult(roles, options);
    // Conduct a compare check of the two roles arrays
    const roleCheck = _.difference(againstRoles, forRoles);
    // If none of the provided roles were found and this policy does not allow wildcare then grant
    if (roleCheck.length === againstRoles.length && forRoles.indexOf('*') === -1) return true;
    // Retrieve the scope for this policy
    const forScopes = await getMixedResult(this.scope, options);
    // Retrieve the scope passed to this policy
    const againstScopes = await getMixedResult(scope, options);
    // Conduct a compare check of the two scope arrays
    const scopeCheck = _.difference(againstScopes, forScopes);
    // Return a grant pass if mismatch or wildcard is not located
    return (scopeCheck.length === againstScopes.length && forScopes.indexOf('*') === -1);
  };
}

export default (args) => (new Deny(args));
