import { PolicyInterface } from './PolicyInterface';
import { PolicyArgs, PolicyGrantArgs, RolesType, ScopesType } from './types';
/**
 * ALLOW POLICY
 * Use this policy to implicitly grant against roles and scope.
 * ie. new Allow({ roles: ['user', 'admin'], scope: ['read', 'write'] })
 * You should always define policies while creating your atom schema
 * Should be used within a Policies instance.
 * Use the grant method in order to grant against a provided set of roles, scope and isotope
 */
export declare class Allow implements PolicyInterface {
    roles: RolesType;
    scope: ScopesType;
    options: Object;
    constructor({ roles, scope, options }: PolicyArgs);
    getRoles: (options?: Object) => Promise<string[]>;
    getScope: (options?: Object) => Promise<string[]>;
    grant: ({ isotope, roles, scope, ...options }: PolicyGrantArgs) => Promise<boolean>;
}
declare const _default: (args: PolicyArgs) => Allow;
/**
 * FACTORY CALLBACK
 * This is the typical way to create a new policy.
 * Should be used in favour of using the primary policy class
 * @param {PolicyArgs} args
 * @returns {Allow}
 */
export default _default;
