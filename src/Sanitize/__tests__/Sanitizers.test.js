import assert from 'assert';
import { SimpleSanitizer } from '../SimpleSanitizer';
import { Sanitizers } from '../Sanitizers';

describe('Sanitizers', () => {
  const mockSanitizers = [
    new SimpleSanitizer({ rules: ['trim'] }),
    new SimpleSanitizer({ rules: ['upper_case'] })
  ];

  const mockPromiseValue = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, '  johnny ');
  }));

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

  it('can sanitize a promise value', () => {
    const sanitizers = new Sanitizers({ filters: mockSanitizers });
    sanitizers.filter({ value: mockPromiseValue })
      .then(filteredValue => {
        assert.equal(filteredValue, 'JOHNNY');
      });
  });

});
