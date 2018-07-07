export declare class Isotopes {
    reactor: any;
    nuclei: any;
    values: any;
    parent: any;
    isotopes: never[];
    options: any;
    constructor({ parent, reactor, nuclei, values, ...options }: {
        [x: string]: any;
        parent: any;
        reactor: any;
        nuclei: any;
        values: any;
    });
    find: (criteria: any) => undefined;
    filter: (criteria: any) => never[];
    hydrate: (options?: {}) => Promise<this>;
    validate: (options?: {}) => Promise<{}>;
    sanitize: () => Promise<void>;
    dump: () => Promise<{}>;
}
declare const _default: (args: any) => Isotopes;
export default _default;
