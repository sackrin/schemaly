import _ from 'lodash';
import { buildRoles, buildScope } from './utils';

export class PolicyGroup {
  policies = []

  constructor (policies) {
    this.policies = policies;
  }

  async grant (isotope, roles, scope) {
    if (this.policies.length === 0) { return true; }

    const builtScope = await buildScope(scope);
    const builtRoles = await buildRoles(roles);

    return _.reduce(this.policies, async (flag, policy) => {
      const currFlag = await flag;
      return await policy.grant(isotope, builtScope, builtRoles) ? true : currFlag;
    }, false);
  }
}
