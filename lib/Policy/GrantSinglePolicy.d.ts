export declare class GrantSinglePolicy {
    policies: never[];
    options: {};
    constructor({ policies, ...options }: {
        [x: string]: any;
        policies: any;
    });
    grant: ({ isotope, roles, scope, ...options }: {
        [x: string]: any;
        isotope: any;
        roles: any;
        scope: any;
    }) => Promise<any>;
}
declare const _default: (policies: any, options?: {}) => GrantSinglePolicy;
export default _default;
