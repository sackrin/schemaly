"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Utils_1 = require("../Utils");
/**
 * DENY POLICY
 * Use this policy to deny grant against roles and scope.
 * ie. new Deny({ roles: ['user', 'admin'], scope: ['read', 'write'] })
 * You should always define policies while creating your atom schema
 * Should be used within a Policies instance.
 * Use the grant method in order to grant against a provided set of roles, scope and isotope
 */
class Deny {
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
                return true;
            }
            const forScopes = await Utils_1.getMixedResult(this.scope, options);
            const againstScopes = await Utils_1.getMixedResult(lodash_1.default.isArray(scope) ? scope : [scope], options);
            const scopeCheck = lodash_1.default.difference(againstScopes, forScopes);
            return (scopeCheck.length === againstScopes.length && forScopes.indexOf("*") === -1);
        };
        this.roles = lodash_1.default.isArray(roles) ? roles : [roles];
        this.scope = lodash_1.default.isArray(scope) ? scope : [scope];
        this.options = options;
    }
}
exports.Deny = Deny;
/**
 * FACTORY CALLBACK
 * This is the typical way to create a new policy.
 * Should be used in favour of using the primary policy class
 * @param {PolicyArgs} args
 * @returns {Allow}
 */
exports.default = (args) => (new Deny(args));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVueS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Qb2xpY3kvRGVueS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUF1QjtBQUN2QixvQ0FBMEM7QUFTMUM7Ozs7Ozs7R0FPRztBQUNIO0lBT0U7Ozs7T0FJRztJQUNILFlBQVksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQWM7UUFYL0MsVUFBSyxHQUFjLEVBQUUsQ0FBQztRQUV0QixVQUFLLEdBQWUsRUFBRSxDQUFDO1FBRXZCLFlBQU8sR0FBUSxFQUFFLENBQUM7UUFhekI7Ozs7V0FJRztRQUNJLGFBQVEsR0FBRyxLQUFLLEVBQUUsVUFBZSxFQUFFLEVBQXFCLEVBQUU7WUFDL0QsT0FBTyxzQkFBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQTtRQUVEOzs7O1dBSUc7UUFDSSxhQUFRLEdBQUcsS0FBSyxFQUFFLFVBQWUsRUFBRSxFQUFxQixFQUFFO1lBQy9ELE9BQU8sc0JBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNyRSxDQUFDLENBQUE7UUFFRDs7Ozs7OztXQU9HO1FBQ0ksVUFBSyxHQUFHLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxFQUFtQixFQUFvQixFQUFFO1lBQ2hHLE1BQU0sUUFBUSxHQUFhLE1BQU0sc0JBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sWUFBWSxHQUFhLE1BQU0sc0JBQWMsQ0FBQyxnQkFBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFFLEtBQUssQ0FBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ25HLE1BQU0sU0FBUyxHQUFhLGdCQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNqRSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssWUFBWSxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUFFLE9BQU8sSUFBSSxDQUFDO2FBQUU7WUFDOUYsTUFBTSxTQUFTLEdBQWEsTUFBTSxzQkFBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdEUsTUFBTSxhQUFhLEdBQWEsTUFBTSxzQkFBYyxDQUFDLGdCQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUUsS0FBSyxDQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDcEcsTUFBTSxVQUFVLEdBQWEsZ0JBQUMsQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3BFLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLGFBQWEsQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZGLENBQUMsQ0FBQztRQXhDQSxJQUFJLENBQUMsS0FBSyxHQUFHLGdCQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUUsS0FBSyxDQUFFLENBQUM7UUFDbEQsSUFBSSxDQUFDLEtBQUssR0FBRyxnQkFBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFFLEtBQUssQ0FBRSxDQUFDO1FBQ2xELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7Q0FzQ0Y7QUF0REQsb0JBc0RDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsa0JBQWUsQ0FBQyxJQUFnQixFQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMifQ==