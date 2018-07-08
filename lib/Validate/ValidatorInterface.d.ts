import { Isotope } from "../Isotope/Isotope";
export interface ValidatorInterface {
    rules: Array<string | Function>;
    options: any;
    getRules(options: Object): Object;
    validate({ isotope, ...options }: {
        isotope: Isotope;
        options?: Object;
    }): Promise<{
        valid: boolean;
        messages: Array<string>;
        children: Array<any>;
    }>;
}
