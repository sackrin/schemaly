import { SimpleSanitizer } from '../../Sanitize';
import { Context } from './Types';

export const INT: Context = {
  code: 'int',
  children: false,
  repeater: false,
  sanitizers: [SimpleSanitizer({ filters: ['int'] })],
  validators: [],
};

export default INT;
