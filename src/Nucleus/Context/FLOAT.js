import { SimpleSanitizer } from '../../Sanitize';

export const FLOAT = {
  code: 'float',
  children: false,
  repeater: false,
  sanitizers: [
    SimpleSanitizer({ rules: ['float'] })
  ],
  validators: []
};

export default FLOAT;
