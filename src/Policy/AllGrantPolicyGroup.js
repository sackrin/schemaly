import _ from 'lodash';
import { buildRoles, buildScope } from './utils';

export class AllGrantPolicyGroup {
  policies = [];

  constructor (policies) {
    this.policies = policies;
  }

  async grant (isotope, roles, scope) {
    // If no policies then return a pass grant
    if (this.policies.length === 0) { return true; }
    // Retrieve the built passed scope and roles
    const builtScope = await buildScope(scope);
    const builtRoles = await buildRoles(roles);
    // Loop through and search for a granting policy
    // Only one policy is required in order to achieve a policy grant
    // This is why best practice is to add a deny *, * policy to all policy groups
    return _.reduce(this.policies, async (flag, policy) => {
      const currFlag = await flag;
      return await policy.grant(isotope, builtRoles, builtScope) ? currFlag : false;
    }, true);
  }
}
