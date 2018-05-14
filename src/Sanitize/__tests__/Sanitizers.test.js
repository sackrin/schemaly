import assert from 'assert';
import { SimpleSanitizer } from '../SimpleSanitizer';
import { Sanitizers } from '../Sanitizers';

describe.only('Sanitizers', () => {
  const mockSanitizers = [
    new SimpleSanitizer({ rules: ['trim'] }),
    new SimpleSanitizer({ rules: ['upper_case'] })
  ];

  it('can create a basic sanitizer group', () => {
    const sanitizers = new Sanitizers({ filters: mockSanitizers, test: true });
    assert.deepEqual(sanitizers.filters, mockSanitizers);
    assert.deepEqual(sanitizers.options.test, true);
  });

  it('can sanitize a simple value', () => {
    const sanitizers = new Sanitizers({ filters: mockSanitizers });
    sanitizers.filter({ value: ' johnny ' })
      .then(filteredValue => {
        assert.equal(filteredValue, 'JOHNNY');
      });
  });

});
