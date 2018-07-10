"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Utils_1 = require("../Utils");
/**
 * GRANT ONE POLICY
 * Contains policies and grants only if --> ONE <-- policy return granted
 * To be used when defining policies for nucleus
 * Ensure that at least one DenyPolicy has roles and scope of * for security
 */
class GrantOne {
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
                }) ? true : curr;
            }, Promise.resolve(false));
        };
        this.policies = policies;
        this.options = options;
    }
}
exports.GrantOne = GrantOne;
/**
 * FACTORY CALLBACK
 * This is the typical way to create a new policy group.
 * Should be used in favour of using the primary policy group class
 * @param {Policy[]} policies
 * @param options
 * @returns {GrantOne}
 */
exports.default = (policies, options = {}) => (new GrantOne({ policies, options }));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhbnRPbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvUG9saWN5L0dyYW50T25lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQXVCO0FBRXZCLG9DQUEwQztBQUUxQzs7Ozs7R0FLRztBQUNIO0lBS0U7OztPQUdHO0lBQ0gsWUFBWSxFQUFFLFFBQVEsRUFBRSxPQUFPLEdBQUcsRUFBRSxFQUFnQjtRQVI3QyxhQUFRLEdBQWEsRUFBRSxDQUFDO1FBRXhCLFlBQU8sR0FBUSxFQUFFLENBQUM7UUFXekI7Ozs7Ozs7O1dBUUc7UUFDSSxVQUFLLEdBQUcsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFtQixFQUFvQixFQUFFO1lBQzdGLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUFFLE9BQU8sSUFBSSxDQUFDO2FBQUU7WUFDaEQsTUFBTSxVQUFVLEdBQWEsTUFBTSxzQkFBYyxDQUFDLGdCQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUUsS0FBSyxDQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDakcsTUFBTSxVQUFVLEdBQWEsTUFBTSxzQkFBYyxDQUFDLGdCQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUUsS0FBSyxDQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDakcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBc0IsRUFBRSxNQUFjLEVBQUUsRUFBRTtnQkFDM0UsTUFBTSxJQUFJLEdBQVksTUFBTSxJQUFJLENBQUM7Z0JBQ2pDLE9BQU8sTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDO29CQUN4QixPQUFPO29CQUNQLEtBQUssRUFBRSxVQUFVO29CQUNqQixLQUFLLEVBQUUsVUFBVTtvQkFDakIsT0FBTyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsT0FBTyxFQUFFO2lCQUN6QyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ25CLENBQUMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFBO1FBMUJDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7Q0F5QkY7QUFyQ0QsNEJBcUNDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILGtCQUFlLENBQUMsUUFBa0IsRUFBRSxVQUFlLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMifQ==