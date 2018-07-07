export declare class Sanitizers {
    filters: never[];
    options: {};
    constructor({ filters, ...options }: {
        [x: string]: any;
        filters: any;
    });
    merge: (additional: any) => void;
    filter: ({ isotope, ...options }: {
        [x: string]: any;
        isotope: any;
    }) => Promise<any>;
}
declare const _default: (filters: any, options?: {}) => Sanitizers;
export default _default;
