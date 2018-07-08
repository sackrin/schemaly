import { Isotope } from "../Isotope/Isotope";
import { ValidatorInterface } from "./ValidatorInterface";
import { ValidatorResultInterface } from "./ValidatorResultInterface";
export interface ValidatorsInterface {
    validators: Array<ValidatorInterface>;
    options: Object;
    merge(additional: Array<ValidatorInterface>): void;
    validate({ isotope, ...options }: {
        isotope: Isotope;
        options?: Object;
    }): Promise<ValidatorResultInterface>;
}
export declare class Validators implements ValidatorsInterface {
    validators: Array<ValidatorInterface>;
    options: Object;
    constructor({ validators, options }: {
        validators: Array<ValidatorInterface>;
        options?: Object;
    });
    merge: (additional: ValidatorInterface[]) => void;
    validate: ({ isotope, ...options }: {
        isotope: Isotope;
        options?: Object | undefined;
    }) => Promise<ValidatorResultInterface>;
}
declare const _default: (validators: ValidatorInterface[], options?: Object) => ValidatorsInterface;
export default _default;
