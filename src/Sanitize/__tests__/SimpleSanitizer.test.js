import assert from 'assert';
import SimpleSanitizer from '../SimpleSanitizer';

describe('Simple Sanitizer', () => {
  const simplePromiseRule = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, ['sanitize_string']);
  }));

  const mockPromiseValue = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, '  johnny ');
  }));

  it('can create a simple rules santizer', () => {
    const rules = ['trim|sanitize_string'];
    const sanitizer = SimpleSanitizer({ rules: rules, test: true });
    assert.deepEqual(sanitizer.config.rules, rules);
    assert.deepEqual(sanitizer.options.test, true);
  });

  it('can create a mixed rule santizer', () => {
    const rules = ['trim', simplePromiseRule];
    const sanitizer = SimpleSanitizer({ rules: rules });
    assert.deepEqual(sanitizer.config.rules, rules);
  });

  it('get rules produces a usable santizer string', () => {
    const rules = ['trim', simplePromiseRule];
    const sanitizer = SimpleSanitizer({ rules: rules });
    return sanitizer.getRules()
      .then(builtRules => {
        assert.equal(builtRules, 'trim|sanitize_string');
      });
  });

  it('sanitize a string using a single trim and upper_case filters', () => {
    const rules = ['trim|upper_case'];
    const sanitizer = SimpleSanitizer({ rules: rules });
    return sanitizer.apply({ value: ' johnny ' })
      .then(sanitized => {
        assert.equal(sanitized, 'JOHNNY');
      });
  });

  it('sanitize a promise value using a single trim and upper_case filters', () => {
    const rules = ['trim|upper_case'];
    const sanitizer = SimpleSanitizer({ rules: rules });
    return sanitizer.apply({ value: mockPromiseValue })
      .then(sanitized => {
        assert.equal(sanitized, 'JOHNNY');
      });
  });

  it('sanitize a string using the trim filter', () => {
    const rules = ['trim'];
    const sanitizer = SimpleSanitizer({ rules: rules });
    return sanitizer.apply({ value: ' johnny ' })
      .then(sanitized => {
        assert.equal(sanitized, 'johnny');
      });
  });

  it('sanitize a string using the upper_case filter', () => {
    const rules = ['upper_case'];
    const sanitizer = SimpleSanitizer({ rules: rules });
    return sanitizer.apply({ value: 'johnny' })
      .then(sanitized => {
        assert.equal(sanitized, 'JOHNNY');
      });
  });

  it('sanitize a string using the lower_case filter', () => {
    const rules = ['lower_case'];
    const sanitizer = SimpleSanitizer({ rules: rules });
    return sanitizer.apply({ value: 'JOHNNY' })
      .then(sanitized => {
        assert.equal(sanitized, 'johnny');
      });
  });

  it('sanitize a string using an invalid sanitizer filter', () => {
    const rules = ['invalidSanitizer'];
    const sanitizer = SimpleSanitizer({ rules: rules });
    return sanitizer.apply({ value: 'johnny' })
      .then(sanitized => {
        assert.equal(sanitized, 'johnny');
      });
  });
});
