export declare class SimpleValidator {
    rules: never[];
    options: any;
    constructor({ rules, ...options }: {
        [x: string]: any;
        rules: any;
    });
    getRules: ({ ...options }?: {}) => Promise<any>;
    validate: ({ isotope, ...options }: {
        [x: string]: any;
        isotope: any;
    }) => Promise<{
        valid: boolean;
        messages: any[];
        children: never[];
    }>;
}
declare const _default: (args: any) => SimpleValidator;
export default _default;
