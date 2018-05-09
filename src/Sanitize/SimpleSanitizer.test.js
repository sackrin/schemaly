import assert from 'assert';
import { SimpleSanitizer } from './SimpleSanitizer';

describe('Simple Sanitizer', () => {
  const simplePromiseRule = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, ['sanitize_string']);
  }));

  it('can create a simple rules santizer', () => {
    const rules = ['trim|sanitize_string'];
    const sanitizer = new SimpleSanitizer({ rules: rules, options: { test: true } });
    assert.deepEqual(sanitizer.config.rules, rules);
    assert.deepEqual(sanitizer.options.test, true);
  });

  it('can create a mixed rule santizer', () => {
    const rules = ['trim', simplePromiseRule];
    const sanitizer = new SimpleSanitizer({ rules: rules });
    assert.deepEqual(sanitizer.config.rules, rules);
  });

  it('get rules produces a usable santizer string', () => {
    const rules = ['trim', simplePromiseRule];
    const sanitizer = new SimpleSanitizer({ rules: rules });
    return sanitizer
      .getRules()
      .then(builtRules => {
        assert.equal(builtRules, 'trim|sanitize_string');
      });
  });
});
