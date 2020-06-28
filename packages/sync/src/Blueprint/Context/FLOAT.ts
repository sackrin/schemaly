import { SimpleSanitizer } from '../../Sanitize';
import { Context } from './Types';

export const FLOAT: Context = {
  code: 'float',
  children: false,
  repeater: false,
  sanitizers: [SimpleSanitizer({ filters: ['float'] })],
  validators: [],
};

export default FLOAT;
