import { Isotope } from "../Isotope/Isotope";
import { ValidatorInterface } from "./ValidatorInterface";
import { ValidatorResultInterface } from "./ValidatorResultInterface";
export declare class SimpleValidator implements ValidatorInterface {
    rules: Array<string | Function>;
    options: any;
    constructor({ rules, ...options }: {
        rules: Array<string | Function>;
        options?: any;
    });
    getRules: (options?: any) => Promise<any>;
    validate: ({ isotope, ...options }: {
        isotope: Isotope;
        options?: Object | undefined;
    }) => Promise<ValidatorResultInterface>;
}
declare const _default: (args: {
    rules: (string | Function)[];
    options?: any;
}) => SimpleValidator;
export default _default;
