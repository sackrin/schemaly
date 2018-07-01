import _ from 'lodash';
import { buildRoles, buildScope } from './utils';
import { AllowPolicy, DenyPolicy } from './index';
import { Isotope } from '../Isotope';
import type { BuiltRoles, BuiltScope } from './utils';

export type GrantAllPoliciesArgs = {
  policies: Array<AllowPolicy | DenyPolicy>
};

export type GrantAllPoliciesGrantArgs = {
  isotope: Isotope,
  roles: Array<string | Function>,
  scope: Array<string | Function>
};

export class GrantAllPolicies {
  policies: Array<AllowPolicy | DenyPolicy> = [];

  options: Object = {};

  constructor ({ policies, ...options }: GrantAllPoliciesArgs) {
    this.policies = policies;
    this.options = options;
  }

  grant = async ({ isotope, roles, scope, ...options }: GrantAllPoliciesGrantArgs): Promise<boolean> => {
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
      return await policy.grant({
        isotope,
        roles: builtRoles,
        scope: builtScope,
        ...options
      }) ? currFlag : false;
    }, true);
  };
}

export default (policies: Array<AllowPolicy | DenyPolicy>, options: Object = {}): GrantAllPolicies => (new GrantAllPolicies({ policies, ...options }));
