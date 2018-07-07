import assert from 'assert';
import { SimpleValidator } from '../';

describe('Validate/SimpleValidator', function () {
  const simpleStringRule = 'required|min:5';
  const simplePromiseRule = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, ['email']);
  }));

  const fakeIsotope = (options) => ({
    value: '',
    getValue: async function () { return this.value; },
    ...options
  });

  it('can create a simple rule validator', () => {
    const validator = SimpleValidator({ rules: [simpleStringRule], test: true });
    assert.deepEqual(validator.rules, [simpleStringRule]);
    assert.deepEqual(validator.options.test, true);
  });

  it('can create a mixed rule validator', () => {
    const validator = SimpleValidator({ rules: [simpleStringRule, simplePromiseRule] });
    assert.deepEqual(validator.rules, [simpleStringRule, simplePromiseRule]);
  });

  it('get rules produces a usable validator string', () => {
    const validator = SimpleValidator({ rules: [simpleStringRule, simplePromiseRule] });
    return validator.getRules().then(rules => {
      assert.deepEqual(rules, 'required|min:5|email');
    }).catch((msg) => { throw new Error(msg); });
  });

  it('validates against a simple value and passes', () => {
    const validator = SimpleValidator({ rules: [simpleStringRule] });
    const isotope = fakeIsotope({ value: 'Johnny' });
    return validator
      .validate({ isotope })
      .then(({ valid, messages }) => {
        assert.equal(valid, true);
        assert.deepEqual(messages, []);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('validates against a simple value and fails', () => {
    const validator = SimpleValidator({ rules: [simpleStringRule] });
    const isotope = fakeIsotope({ value: 'John' });
    return validator
      .validate({ isotope })
      .then(({ valid, messages }) => {
        assert.equal(valid, false);
        assert.deepEqual(messages, [ 'The value must be at least 5 characters.' ]);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('validates against a promise value and passes', () => {
    const simplePromiseValue = () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, 'Johnny');
    }));
    const validator = SimpleValidator({ rules: [simpleStringRule] });
    const isotope = fakeIsotope({ value: simplePromiseValue });
    return validator
      .validate({ isotope })
      .then(({ valid, messages }) => {
        assert.equal(valid, true);
        assert.deepEqual(messages, []);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('validates against a promise value and fails', () => {
    const simplePromiseValue = () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, 'John');
    }));
    const validator = SimpleValidator({ rules: [simpleStringRule] });
    const isotope = fakeIsotope({ value: simplePromiseValue });
    return validator
      .validate({ isotope })
      .then(({ valid, messages }) => {
        assert.equal(valid, false);
        assert.deepEqual(messages, [ 'The value must be at least 5 characters.' ]);
      }).catch((msg) => { throw new Error(msg); });
  });
});
