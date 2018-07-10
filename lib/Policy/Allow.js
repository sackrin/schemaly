"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Utils_1 = require("../Utils");
/**
 * ALLOW POLICY
 * Use this policy to implicitly grant against roles and scope.
 * ie. new Allow({ roles: ['user', 'admin'], scope: ['read', 'write'] })
 * You should always define policies while creating your atom schema
 * Should be used within a Policies instance.
 * Use the grant method in order to grant against a provided set of roles, scope and isotope
 */
class Allow {
    /**
     * @param {RoleType | RolesType} roles
     * @param {ScopeType | ScopesType} scope
     * @param {any} options
     */
    constructor({ roles, scope, options = {} }) {
        this.roles = [];
        this.scope = [];
        this.options = {};
        /**
         * Get Constructed Roles
         * @param options
         * @returns {Promise<string[]>}
         */
        this.getRoles = async (options = {}) => {
            return Utils_1.getMixedResult(this.roles, { ...this.options, ...options });
        };
        /**
         * Get Constructed Scope
         * @param options
         * @returns {Promise<string[]>}
         */
        this.getScope = async (options = {}) => {
            return Utils_1.getMixedResult(this.scope, { ...this.options, ...options });
        };
        /**
         * Grant Challenge
         * @param {Isotope} isotope
         * @param {RoleType | RolesType} roles
         * @param {ScopeType | ScopesType} scope
         * @param {{options?: any} | any} options
         * @returns {Promise<boolean>}
         */
        this.grant = async ({ isotope, roles, scope, ...options }) => {
            const forRoles = await Utils_1.getMixedResult(this.roles, options);
            const againstRoles = await Utils_1.getMixedResult(lodash_1.default.isArray(roles) ? roles : [roles], options);
            const roleCheck = lodash_1.default.difference(againstRoles, forRoles);
            if (roleCheck.length === againstRoles.length && forRoles.indexOf("*") === -1) {
                return false;
            }
            const forScopes = await Utils_1.getMixedResult(this.scope, options);
            const againstScopes = await Utils_1.getMixedResult(lodash_1.default.isArray(scope) ? scope : [scope], options);
            const scopeCheck = lodash_1.default.difference(againstScopes, forScopes);
            return (!(scopeCheck.length === againstScopes.length && forScopes.indexOf("*") === -1));
        };
        this.roles = lodash_1.default.isArray(roles) ? roles : [roles];
        this.scope = lodash_1.default.isArray(scope) ? scope : [scope];
        this.options = options;
    }
}
exports.Allow = Allow;
/**
 * FACTORY CALLBACK
 * This is the typical way to create a new policy.
 * Should be used in favour of using the primary policy class
 * @param {PolicyArgs} args
 * @returns {Allow}
 */
exports.default = (args) => (new Allow(args));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWxsb3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvUG9saWN5L0FsbG93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQXVCO0FBQ3ZCLG9DQUEwQztBQVMxQzs7Ozs7OztHQU9HO0FBQ0g7SUFPRTs7OztPQUlHO0lBQ0gsWUFBWSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBYztRQVgvQyxVQUFLLEdBQWMsRUFBRSxDQUFDO1FBRXRCLFVBQUssR0FBZSxFQUFFLENBQUM7UUFFdkIsWUFBTyxHQUFRLEVBQUUsQ0FBQztRQWF6Qjs7OztXQUlHO1FBQ0ksYUFBUSxHQUFHLEtBQUssRUFBRSxVQUFlLEVBQUUsRUFBcUIsRUFBRTtZQUMvRCxPQUFPLHNCQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDckUsQ0FBQyxDQUFBO1FBRUQ7Ozs7V0FJRztRQUNJLGFBQVEsR0FBRyxLQUFLLEVBQUUsVUFBZSxFQUFFLEVBQXFCLEVBQUU7WUFDL0QsT0FBTyxzQkFBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQTtRQUVEOzs7Ozs7O1dBT0c7UUFDSSxVQUFLLEdBQUcsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxPQUFPLEVBQW1CLEVBQW9CLEVBQUU7WUFDaEcsTUFBTSxRQUFRLEdBQWEsTUFBTSxzQkFBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDckUsTUFBTSxZQUFZLEdBQWEsTUFBTSxzQkFBYyxDQUFDLGdCQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUUsS0FBSyxDQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDbkcsTUFBTSxTQUFTLEdBQWEsZ0JBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2pFLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxZQUFZLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQUUsT0FBTyxLQUFLLENBQUM7YUFBRTtZQUMvRixNQUFNLFNBQVMsR0FBYSxNQUFNLHNCQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN0RSxNQUFNLGFBQWEsR0FBYSxNQUFNLHNCQUFjLENBQUMsZ0JBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBRSxLQUFLLENBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNwRyxNQUFNLFVBQVUsR0FBYSxnQkFBQyxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDcEUsT0FBTyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLGFBQWEsQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUYsQ0FBQyxDQUFBO1FBeENDLElBQUksQ0FBQyxLQUFLLEdBQUcsZ0JBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBRSxLQUFLLENBQUUsQ0FBQztRQUNsRCxJQUFJLENBQUMsS0FBSyxHQUFHLGdCQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUUsS0FBSyxDQUFFLENBQUM7UUFDbEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztDQXNDRjtBQXRERCxzQkFzREM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxrQkFBZSxDQUFDLElBQWdCLEVBQVUsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyJ9