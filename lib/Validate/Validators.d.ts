export declare class Validators {
    validators: never[];
    options: {};
    constructor({ validators, ...options }: {
        [x: string]: any;
        validators: any;
    });
    merge: (additional: any) => void;
    validate: ({ isotope, ...options }: {
        [x: string]: any;
        isotope: any;
    }) => Promise<any>;
}
declare const _default: (validators: any, options?: {}) => Validators;
export default _default;
