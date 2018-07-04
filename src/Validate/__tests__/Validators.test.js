import assert from 'assert';
import Validators from '../Validators';
import SimpleValidator from '../SimpleValidator';

describe('Validators', () => {
  const simpleValidators = [
    SimpleValidator({ rules: ['required'] }),
    SimpleValidator({ rules: ['min:5'] })
  ];

  const johnByPromise = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, 'john');
  }));

  const johnnyByPromise = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, 'johnny');
  }));

  const fakeIsotope = (options) => ({
    value: '',
    getValue: async function () { return this.value; },
    ...options
  });

  it('can create a simple validator group', () => {
    const validators = Validators(simpleValidators, { test: true });
    assert.deepEqual(validators.validators, simpleValidators);
    assert.equal(validators.options.test, true);
  });

  it('can perform validation on a simple value and pass', () => {
    const validators = Validators(simpleValidators);
    return validators.validate({ isotope: fakeIsotope({ value: 'johnny' }) })
      .then(({ valid, messages }) => {
        assert.equal(valid, true);
        assert.deepEqual(messages, []);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('can perform validation on a simple value and fail', () => {
    const validators = Validators(simpleValidators);
    return validators.validate({ isotope: fakeIsotope({ value: 'john' }) })
      .then(({ valid, messages }) => {
        assert.equal(valid, false);
        assert.deepEqual(messages, [ 'The value must be at least 5 characters.' ]);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('can perform validation on a promise value and pass', () => {
    const validators = Validators(simpleValidators);
    return validators.validate({ isotope: fakeIsotope({ value: johnnyByPromise }) })
      .then(({ valid, messages }) => {
        assert.equal(valid, true);
        assert.deepEqual(messages, []);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('can perform validation on a promise value and fail', () => {
    const validators = Validators(simpleValidators);
    return validators.validate({ isotope: fakeIsotope({ value: johnByPromise }) })
      .then(({ valid, messages }) => {
        assert.equal(valid, false);
        assert.deepEqual(messages, [ 'The value must be at least 5 characters.' ]);
      }).catch((msg) => { throw new Error(msg); });
  });
});
