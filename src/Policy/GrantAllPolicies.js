import _ from 'lodash';
import { buildRoles, buildScope } from './utils';

export class GrantAllPolicies {
  policies = [];

  options = {};

  constructor ({ policies, ...options }) {
    this.policies = policies;
    this.options = options;
  }

  grant = async ({ isotope, roles, scope, ...options }) => {
    // If no policies then return a pass grant
    if (this.policies.length === 0) { return true; }
    // Retrieve the built passed scope and roles
    const builtScope = await buildScope(scope, options);
    const builtRoles = await buildRoles(roles, options);
    // Loop through and search for a granting policy
    // Only one policy is required in order to achieve a policy grant
    // This is why best practice is to add a deny *, * policy to all policy groups
    return _.reduce(this.policies, async (flag, policy) => {
      const currFlag = await flag;
      return await policy.grant({
        isotope,
        roles: builtRoles,
        scope: builtScope,
        ...options
      }) ? currFlag : false;
    }, true);
  };
}

export default (policies, options = {}) => (new GrantAllPolicies({ policies, ...options }));
