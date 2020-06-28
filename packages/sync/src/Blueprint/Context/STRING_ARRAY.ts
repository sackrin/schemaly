import { SimpleSanitizer } from '../../Sanitize';
import { Context } from './Types';

export const STRING_ARRAY: Context = {
  code: 'array',
  children: false,
  repeater: false,
  sanitizers: [SimpleSanitizer({ filters: ['string_array'] })],
  validators: [],
};

export default STRING_ARRAY;
