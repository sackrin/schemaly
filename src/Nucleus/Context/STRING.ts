import { SimpleSanitizer } from '../../Sanitize';

export const STRING = {
  code: 'string',
  children: false,
  repeater: false,
  sanitizers: [
    SimpleSanitizer({ rules: ['string'] })
  ],
  validators: []
};

export default STRING;
