import assert from 'assert';
import SimpleSanitizer from '../SimpleSanitizer';
import Sanitizers from '../Sanitizers';

describe('Sanitize/Sanitizers', () => {
  const mockSanitizers = [
    SimpleSanitizer({ rules: ['trim'] }),
    SimpleSanitizer({ rules: ['upper_case'] })
  ];

  const mockPromiseValue = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, '  johnny ');
  }));

  const fakeIsotope = (options = {}) => ({
    value: '',
    getValue: async function () { return this.value; },
    ...options
  });

  it('can create a basic sanitizer group', () => {
    const sanitizers = Sanitizers(mockSanitizers, { test: true });
    assert.deepEqual(sanitizers.filters, mockSanitizers);
    assert.deepEqual(sanitizers.options.test, true);
  });

  it('can sanitize a simple value', () => {
    const sanitizers = Sanitizers(mockSanitizers);
    return sanitizers.filter({ isotope: fakeIsotope({ value: ' johnny ' }) })
      .then(filteredValue => {
        assert.equal(filteredValue, 'JOHNNY');
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('can sanitize a simple value with no sanitizes', () => {
    const sanitizers = Sanitizers([]);
    return sanitizers.filter({ isotope: fakeIsotope({ value: '  johnny  ' }) })
      .then(filteredValue => {
        assert.equal(filteredValue, '  johnny  ');
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('can sanitize a promise value', () => {
    const sanitizers = Sanitizers(mockSanitizers);
    return sanitizers.filter({ isotope: fakeIsotope({ value: mockPromiseValue }) })
      .then(filteredValue => {
        assert.equal(filteredValue, 'JOHNNY');
      })
      .catch((msg) => { throw new Error(msg); });
  });

});
