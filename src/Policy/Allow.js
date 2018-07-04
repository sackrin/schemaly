import _ from 'lodash';
import { getMixedResult } from '../Utils';

export class Allow {
  roles = [];

  scope = [];

  options = {};

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
    const forRoles = await getMixedResult(this.roles, options);
    const againstRoles = await getMixedResult(roles, options);
    const roleCheck = _.difference(againstRoles, forRoles);
    if (roleCheck.length === againstRoles.length && forRoles.indexOf('*') === -1) return false;
    const forScopes = await getMixedResult(this.scope, options);
    const againstScopes = await getMixedResult(scope, options);
    const scopeCheck = _.difference(againstScopes, forScopes);
    return (!(scopeCheck.length === againstScopes.length && forScopes.indexOf('*') === -1));
  };
}

export default (args) => (new Allow(args));
