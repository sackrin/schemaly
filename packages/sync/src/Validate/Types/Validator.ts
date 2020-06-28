import RulesType from './RulesType';
import { ValidatorResult, ValidatorValidateArgs } from './index';

export interface Validator {
  rules: RulesType;
  options: any;
  getRules(options: any): string;
  validate({ effect, options }: ValidatorValidateArgs): ValidatorResult;
}

export default Validator;
