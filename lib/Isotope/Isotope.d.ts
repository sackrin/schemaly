export declare class Isotope {
    reactor: any;
    nucleus: any;
    parent: any;
    value: any;
    children: never[];
    options: any;
    readonly machine: any;
    readonly type: any;
    readonly label: any;
    constructor({ parent, reactor, nucleus, value, ...options }: {
        [x: string]: any;
        parent: any;
        reactor: any;
        nucleus: any;
        value: any;
    });
    getValue: ({ ...options }?: {}) => Promise<any>;
    setValue: ({ value, ...options }: {
        [x: string]: any;
        value: any;
    }) => Promise<any>;
    find: (criteria: any) => any;
    filter: (criteria: any) => any;
    grant: () => Promise<any>;
    hydrate: (options?: {}) => Promise<this>;
    sanitize: () => Promise<any[] | undefined>;
    validate: ({ ...options }?: {}) => Promise<any>;
    dump: () => Promise<any>;
}
declare const _default: (args: any) => Isotope;
export default _default;
