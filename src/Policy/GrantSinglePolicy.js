import _ from 'lodash';
import { buildRoles, buildScope } from './utils';
import { AllowPolicy, DenyPolicy } from './index';
import type { BuiltRoles, BuiltScope } from './utils';
import { Isotope } from '../Isotope';

export class GrantSinglePolicy {
  policies: Array<AllowPolicy | DenyPolicy> = [];

  options: Object = {};

  constructor ({ policies, ...options }: { policies: Array<AllowPolicy | DenyPolicy> }) {
    this.policies = policies;
    this.options = options;
  }

  async grant ({ isotope, roles, scope, ...options }: { isotope: Isotope, roles: Array<string | Function>, scope: Array<string | Function>}): Promise<boolean> {
    // If no policies then return a pass grant
    if (this.policies.length === 0) { return true; }
    // Retrieve the built passed scope and roles
    const builtScope: BuiltScope = await buildScope(scope, options);
    const builtRoles: BuiltRoles = await buildRoles(roles, options);
    // Loop through and search for a granting policy
    // Only one policy is required in order to achieve a policy grant
    // This is why best practice is to add a deny *, * policy to all policy groups
    return _.reduce(this.policies, async (flag: any, policy: any): Promise<boolean> => {
      const currFlag: Promise<boolean> = await flag;
      return await policy.grant({ isotope, roles: builtRoles, scope: builtScope, ...options }) ? true : currFlag;
    }, false);
  }
}
