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
    constructor({ roles, scope, options = {} }) {
        this.roles = [];
        this.scope = [];
        this.options = {};
        this.getRoles = async (options = {}) => {
            return Utils_1.getMixedResult(this.roles, options);
        };
        this.getScope = async (options = {}) => {
            return Utils_1.getMixedResult(this.scope, options);
        };
        this.grant = async ({ isotope, roles, scope, ...options }) => {
            const forRoles = await Utils_1.getMixedResult(this.roles, options);
            const againstRoles = await Utils_1.getMixedResult(lodash_1.default.isArray(roles) ? roles : [roles], options);
            const roleCheck = lodash_1.default.difference(againstRoles, forRoles);
            if (roleCheck.length === againstRoles.length && forRoles.indexOf('*') === -1)
                return false;
            const forScopes = await Utils_1.getMixedResult(this.scope, options);
            const againstScopes = await Utils_1.getMixedResult(lodash_1.default.isArray(scope) ? scope : [scope], options);
            const scopeCheck = lodash_1.default.difference(againstScopes, forScopes);
            return (!(scopeCheck.length === againstScopes.length && forScopes.indexOf('*') === -1));
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
