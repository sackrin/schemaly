import { getMixedResult } from '../Utils';

export class GrantAllPolicies {
  policies = [];

  options = {};

  constructor ({ policies, ...options }) {
    this.policies = policies;
    this.options = options;
  }

  grant = async ({ isotope, roles, scope, ...options }) => {
    if (this.policies.length === 0) { return true; }
    const builtScope = await getMixedResult(scope, options);
    const builtRoles = await getMixedResult(roles, options);
    // Loop through and search for a granting policy
    // Only one policy is required in order to achieve a policy grant
    // This is why best practice is to add a deny *, * policy to all policy groups
    return this.policies.reduce(async (flag, policy) => {
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
