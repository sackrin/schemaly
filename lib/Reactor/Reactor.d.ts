export declare class Reactor {
    atom: any;
    roles: never[];
    scope: never[];
    isotopes: any;
    values: any;
    options: any;
    constructor({ atom, roles, scope, ...options }: {
        [x: string]: any;
        atom: any;
        roles: any;
        scope: any;
    });
    with: ({ values }: {
        values: any;
    }) => this;
    and: ({ values, ids }: {
        values: any;
        ids?: never[];
    }) => this;
    react: () => Promise<any>;
    sanitize: () => Promise<any>;
    validate: () => Promise<{
        valid: {};
        results: any;
    }>;
    dump: () => Promise<any>;
}
declare const _default: (args: any) => Reactor;
export default _default;
