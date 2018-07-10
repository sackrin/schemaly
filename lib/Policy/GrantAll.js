"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Utils_1 = require("../Utils");
/**
 * GRANT ALL POLICIES
 * Contains policies and grants only if --> ALL <-- policies return granted
 * To be used when defining policies for nucleus
 * Ensure that at least one DenyPolicy has roles and scope of * for security
 */
class GrantAll {
    /**
     * @param {Policy[]} policies
     * @param {any} options
     */
    constructor({ policies, options = {} }) {
        this.policies = [];
        this.options = {};
        /**
         * Grant Challenge
         * Must be compatible with individual policy grant checks
         * @param {Isotope} isotope
         * @param {RoleType | RolesType} roles
         * @param {ScopeType | ScopesType} scope
         * @param {any} options
         * @returns {Promise<boolean>}
         */
        this.grant = async ({ isotope, roles, scope, options }) => {
            if (this.policies.length === 0) {
                return true;
            }
            const builtScope = await Utils_1.getMixedResult(lodash_1.default.isArray(scope) ? scope : [scope], options);
            const builtRoles = await Utils_1.getMixedResult(lodash_1.default.isArray(roles) ? roles : [roles], options);
            return this.policies.reduce(async (flag, policy) => {
                const curr = await flag;
                return await policy.grant({
                    isotope,
                    roles: builtRoles,
                    scope: builtScope,
                    options: { ...this.options, ...options },
                }) ? curr : false;
            }, Promise.resolve(true));
        };
        this.policies = policies;
        this.options = options;
    }
}
exports.GrantAll = GrantAll;
/**
 * FACTORY CALLBACK
 * This is the typical way to create a new policy group.
 * Should be used in favour of using the primary policy group class
 * @param {Policy[]} policies
 * @param options
 * @returns {GrantAll}
 */
exports.default = (policies, options = {}) => (new GrantAll({ policies, options }));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhbnRBbGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvUG9saWN5L0dyYW50QWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQXVCO0FBQ3ZCLG9DQUEwQztBQUcxQzs7Ozs7R0FLRztBQUNIO0lBS0U7OztPQUdHO0lBQ0gsWUFBWSxFQUFFLFFBQVEsRUFBRSxPQUFPLEdBQUcsRUFBRSxFQUFnQjtRQVI3QyxhQUFRLEdBQWEsRUFBRSxDQUFDO1FBRXhCLFlBQU8sR0FBUSxFQUFFLENBQUM7UUFXekI7Ozs7Ozs7O1dBUUc7UUFDSSxVQUFLLEdBQUcsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFtQixFQUFvQixFQUFFO1lBQzdGLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUFFLE9BQU8sSUFBSSxDQUFDO2FBQUU7WUFDaEQsTUFBTSxVQUFVLEdBQWEsTUFBTSxzQkFBYyxDQUFDLGdCQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUUsS0FBSyxDQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDakcsTUFBTSxVQUFVLEdBQWEsTUFBTSxzQkFBYyxDQUFDLGdCQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUUsS0FBSyxDQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDakcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBc0IsRUFBRSxNQUFjLEVBQUUsRUFBRTtnQkFDM0UsTUFBTSxJQUFJLEdBQVksTUFBTSxJQUFJLENBQUM7Z0JBQ2pDLE9BQU8sTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDO29CQUN4QixPQUFPO29CQUNQLEtBQUssRUFBRSxVQUFVO29CQUNqQixLQUFLLEVBQUUsVUFBVTtvQkFDakIsT0FBTyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsT0FBTyxFQUFDO2lCQUN4QyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3BCLENBQUMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFBO1FBMUJDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7Q0F5QkY7QUFyQ0QsNEJBcUNDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILGtCQUFlLENBQUMsUUFBa0IsRUFBRSxVQUFlLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMifQ==