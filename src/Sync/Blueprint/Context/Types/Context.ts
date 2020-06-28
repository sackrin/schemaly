import { Sanitizer } from '../../../Sanitize/Types';
import { Validator } from '../../../Validate/Types';

export interface Context {
  code: string;
  children: boolean;
  repeater: boolean;
  sanitizers: Sanitizer[];
  validators: Validator[];
  options?: any;
}

export default Context;
