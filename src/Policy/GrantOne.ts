import _ from "lodash";
import { Policies, PoliciesArgs, Policy, PolicyGrantArgs } from "./Types";
import { getMixedResult } from "../Utils";

/**
 * Contains policies and grants only if --> ONE <-- policy return granted
 * To be used when defining policies for blueprint
 * Ensure that at least one DenyPolicy has roles and scope of * for security
 */
export class GrantOne implements Policies {
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
   * @param {Effect} effect
   * @param {RoleType | RolesType} roles
   * @param {ScopeType | ScopesType} scope
   * @param {any} options
   * @returns {Promise<boolean>}
   */
  public grant = async ({
    effect,
    roles,
    scope,
    options
  }: PolicyGrantArgs): Promise<boolean> => {
    if (this.policies.length === 0) {
      return true;
    }
    const builtScope: string[] = await getMixedResult(
      _.isArray(scope) ? scope : [scope],
      options
    );
    const builtRoles: string[] = await getMixedResult(
      _.isArray(roles) ? roles : [roles],
      options
    );
    return this.policies.reduce(
      async (flag: Promise<boolean>, policy: Policy) => {
        const curr: boolean = await flag;
        return (await policy.grant({
          effect,
          roles: builtRoles,
          scope: builtScope,
          options: { ...this.options, ...options }
        }))
          ? true
          : curr;
      },
      Promise.resolve(false)
    );
  };
}

/**
 * This is the typical way to create a new policy group.
 * Should be used in favour of using the primary policy group class
 * @param {Policy[]} policies
 * @param options
 * @returns {GrantOne}
 */
export default (policies: Policy[], options: any = {}) =>
  new GrantOne({ policies, options });
