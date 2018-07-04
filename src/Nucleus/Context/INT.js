import { SimpleSanitizer } from '../../Sanitize';

export const INT = {
  code: 'int',
  children: false,
  repeater: false,
  sanitizers: [
    SimpleSanitizer({ rules: ['int'] })
  ],
  validators: []
};

export default INT;
