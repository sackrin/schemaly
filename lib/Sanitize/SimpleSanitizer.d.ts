export declare const trimFilter: (value: any) => any;
export declare const uppercaseFilter: (value: any) => any;
export declare const lowercaseFilter: (value: any) => any;
export declare const stringFilter: (value: any) => any;
export declare const intFilter: (value: any) => number;
export declare const floatFilter: (value: any) => number;
export declare class SimpleSanitizer {
    config: {
        rules: never[];
    };
    options: any;
    constructor({ rules, ...options }: {
        [x: string]: any;
        rules: any;
    });
    getRules: ({ ...options }?: {}) => Promise<any>;
    apply: ({ value, isotope, ...options }: {
        [x: string]: any;
        value: any;
        isotope: any;
    }) => Promise<any>;
}
declare const _default: (args: any) => SimpleSanitizer;
export default _default;
