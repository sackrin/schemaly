import _ from 'lodash';
import { buildRoles, buildScope } from './utils';
import { AllowPolicy, DenyPolicy } from './index';
import type { BuiltRoles, BuiltScope } from './utils';
import { Isotope } from '../Isotope';

export class GrantSinglePolicy {
  collect: Array<AllowPolicy | DenyPolicy> = [];

  options: Object = {};

  constructor ({ collect, ...options }: { collect: Array<AllowPolicy | DenyPolicy> }) {
    this.collect = collect;
    this.options = options;
  }

  async grant ({ isotope, roles, scope, ...options }: { isotope: Isotope, roles: Array<string | Function>, scope: Array<string | Function>}): Promise<boolean> {
    // If no collect then return a pass grant
    if (this.collect.length === 0) { return true; }
    // Retrieve the built passed scope and roles
    const builtScope: BuiltScope = await buildScope(scope, options);
    const builtRoles: BuiltRoles = await buildRoles(roles, options);
    // Loop through and search for a granting policy
    // Only one policy is required in order to achieve a policy grant
    // This is why best practice is to add a deny *, * policy to all policy groups
    return _.reduce(this.collect, async (flag: any, policy: any): Promise<boolean> => {
      const currFlag: Promise<boolean> = await flag;
      return await policy.grant({ isotope, roles: builtRoles, scope: builtScope, ...options }) ? true : currFlag;
    }, false);
  }
}
