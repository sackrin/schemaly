import _ from "lodash";
import { getMixedResult } from "../Utils";
import { Policies, PoliciesArgs, Policy, PolicyGrantArgs } from "./Types";

/**
 * GRANT ALL POLICIES
 * Contains policies and grants only if --> ALL <-- policies return granted
 * To be used when defining policies for nucleus
 * Ensure that at least one DenyPolicy has roles and scope of * for security
 */
export class GrantAll implements Policies {
  public policies: Policy[] = [];

  public options: any = {};

  /**
   * @param {Policy[]} policies
   * @param {any} options
   */
  constructor({ policies, options = {} }: PoliciesArgs) {
    this.policies = policies;
    this.options = options;
  }

  /**
   * Grant Challenge
   * Must be compatible with individual policy grant checks
   * @param {Isotope} isotope
   * @param {RoleType | RolesType} roles
   * @param {ScopeType | ScopesType} scope
   * @param {any} options
   * @returns {Promise<boolean>}
   */
  public grant = async ({ isotope, roles, scope, options }: PolicyGrantArgs): Promise<boolean> => {
    if (this.policies.length === 0) { return true; }
    const builtScope: string[] = await getMixedResult(_.isArray(scope) ? scope : [ scope ], options);
    const builtRoles: string[] = await getMixedResult(_.isArray(roles) ? roles : [ roles ], options);
    return this.policies.reduce(async (flag: Promise<boolean>, policy: Policy) => {
      const curr: boolean = await flag;
      return await policy.grant({
        isotope,
        roles: builtRoles,
        scope: builtScope,
        options: { ...this.options, ...options},
      }) ? curr : false;
    }, Promise.resolve(true));
  }
}

/**
 * FACTORY CALLBACK
 * This is the typical way to create a new policy group.
 * Should be used in favour of using the primary policy group class
 * @param {Policy[]} policies
 * @param options
 * @returns {GrantAll}
 */
export default (policies: Policy[], options: any = {}) => (new GrantAll({ policies, options }));
