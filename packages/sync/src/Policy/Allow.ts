import _ from 'lodash';
import { getMixedResult } from '../Utils';
import {
  Policy,
  PolicyArgs,
  PolicyGrantArgs,
  RolesType,
  ScopesType,
} from './Types';
import { Options } from '../Common';

/**
 * Use this policy to implicitly grant against roles and scope.
 * ie. new Allow({ roles: ["user", "admin"], scope: ["read", "write"] })
 * You should always define policies while creating your model schema
 * Should be used within a Policies instance.
 * Use the grant method in order to grant against a provided set of roles, scope and effect
 */
export class Allow implements Policy {
  public roles: RolesType = [];

  public scope: ScopesType = [];

  public options: Options = {};

  /**
   * @param {RoleType | RolesType} roles
   * @param {ScopeType | ScopesType} scope
   * @param {Options} options
   */
  constructor({ roles, scope, options = {} }: PolicyArgs) {
    this.roles = _.isArray(roles) ? roles : [roles];
    this.scope = _.isArray(scope) ? scope : [scope];
    this.options = options;
    this.verify();
  }

  /**
   * Checks to ensure that roles and scope have been correctly provided
   */
  public verify = (): void => {
    if (
      !_.isArray(this.roles) ||
      !_.isArray(this.scope) ||
      this.roles.length < 1 ||
      this.scope.length < 1
    ) {
      throw new Error('POLICY_NEEDS_SCOPE_AND_ROLES');
    }
  };

  /**
   * Get Constructed Roles
   * @param options
   * @returns {Promise<string[]>}
   */
  public getRoles = (options: Options = {}): string[] => {
    return getMixedResult(this.roles, options);
  };

  /**
   * Get Constructed Scope
   * @param options
   * @returns {Promise<string[]>}
   */
  public getScope = (options: Options = {}): string[] => {
    return getMixedResult(this.scope, options);
  };

  /**
   * Grant Challenge
   * @param {RoleType | RolesType} roles
   * @param {ScopeType | ScopesType} scope
   * @param {{options?: Options} | Options} options
   * @returns {Promise<boolean>}
   */
  public grant = ({ roles, scope, ...options }: PolicyGrantArgs): boolean => {
    this.verify();
    const forRoles: string[] = getMixedResult(this.roles, options);
    const againstRoles: string[] = getMixedResult(
      _.isArray(roles) ? roles : [roles],
      options
    );
    const roleCheck: string[] = _.difference(againstRoles, forRoles);
    if (
      roleCheck.length === againstRoles.length &&
      forRoles.indexOf('*') === -1
    ) {
      return false;
    }
    const forScopes: string[] = getMixedResult(this.scope, options);
    const againstScopes: string[] = getMixedResult(
      _.isArray(scope) ? scope : [scope],
      options
    );
    const scopeCheck: string[] = _.difference(againstScopes, forScopes);
    return !(
      scopeCheck.length === againstScopes.length &&
      forScopes.indexOf('*') === -1
    );
  };
}

/**
 * This is the typical way to create a new policy.
 * Should be used in favour of using the primary policy class
 * @param {PolicyArgs} args
 * @returns {Allow}
 */
export default (args: PolicyArgs): Allow => new Allow(args);
