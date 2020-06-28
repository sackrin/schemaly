import RulesType from "./RulesType";
import { ValidatorResult, ValidatorValidateArgs } from "./index";

export interface Validator {
  rules: RulesType;
  options: any;
  getRules(options: any): Promise<string>;
  validate({
    effect,
    options
  }: ValidatorValidateArgs): Promise<ValidatorResult>;
}

export default Validator;
