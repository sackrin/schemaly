import _ from 'lodash';
import { Policies, PoliciesArgs, Policy, PolicyGrantArgs } from './Types';
import { getMixedResult } from '../Utils';
import { Options } from '../Common';

/**
 * Contains policies and grants only if --> ONE <-- policy return granted
 * To be used when defining policies for blueprint
 * Ensure that at least one DenyPolicy has roles and scope of * for security
 */
export class GrantOne implements Policies {
  public policies: Policy[] = [];

  public options: Options = {};

  /**
   * @param {Policy[]} policies
   * @param {Options} options
   */
  constructor({ policies, options = {} }: PoliciesArgs) {
    this.policies = policies;
    this.options = options;
  }

  /**
   * Grant Challenge
   * Must be compatible with individual policy grant checks
   * @param {RoleType | RolesType} roles
   * @param {ScopeType | ScopesType} scope
   * @param {Options} options
   * @returns {Promise<boolean>}
   */
  public grant = ({ roles, scope, options }: PolicyGrantArgs): boolean => {
    if (this.policies.length === 0) {
      return true;
    }
    const builtScope: string[] = getMixedResult(
      _.isArray(scope) ? scope : [scope],
      options
    );
    const builtRoles: string[] = getMixedResult(
      _.isArray(roles) ? roles : [roles],
      options
    );
    return this.policies.reduce((curr: boolean, policy: Policy) => {
      return policy.grant({
        roles: builtRoles,
        scope: builtScope,
        options,
      })
        ? true
        : curr;
    }, false);
  };
}

/**
 * This is the typical way to create a new policy group.
 * Should be used in favour of using the primary policy group class
 * @param {Policy[]} policies
 * @param options
 * @returns {GrantOne}
 */
export default (policies: Policy[], options: Options = {}) =>
  new GrantOne({ policies, options });
