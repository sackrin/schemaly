export declare class Deny {
    roles: never[];
    scope: never[];
    options: any;
    constructor({ roles, scope, ...options }: {
        [x: string]: any;
        roles: any;
        scope: any;
    });
    getRoles: ({ ...options }: {
        [x: string]: any;
    }) => Promise<any>;
    getScope: ({ ...options }: {
        [x: string]: any;
    }) => Promise<any>;
    grant: ({ isotope, roles, scope, ...options }: {
        [x: string]: any;
        isotope: any;
        roles: any;
        scope: any;
    }) => Promise<boolean>;
}
declare const _default: (args: any) => Deny;
export default _default;
