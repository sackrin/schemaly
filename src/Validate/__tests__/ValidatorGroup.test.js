import assert from 'assert';
import { ValidatorGroup } from '../ValidatorGroup';
import { SimpleValidator } from '../SimpleValidator';

describe('Validator Group', () => {
  const simpleValidators = [
    new SimpleValidator({ rules: ['required'] }),
    new SimpleValidator({ rules: ['min:5'] })
  ];

  const johnByPromise = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, 'john');
  }));

  const johnnyByPromise = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, 'johnny');
  }));

  it('can create a simple validator group', () => {
    const validatorGroup = new ValidatorGroup({ validators: simpleValidators, test: true });
    assert.deepEqual(validatorGroup.validators, simpleValidators);
    assert.equal(validatorGroup.options.test, true);
  });

  it('can perform validation on a simple value and pass', () => {
    const validatorGroup = new ValidatorGroup({ validators: simpleValidators });
    return validatorGroup.validate({ value: 'johnny' })
      .then(({ result, messages }) => {
        assert.equal(result, true);
        assert.deepEqual(messages, []);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('can perform validation on a simple value and fail', () => {
    const validatorGroup = new ValidatorGroup({ validators: simpleValidators });
    return validatorGroup.validate({ value: 'john' })
      .then(({ result, messages }) => {
        assert.equal(result, false);
        assert.deepEqual(messages, [ 'The value must be at least 5 characters.' ]);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('can perform validation on a promise value and pass', () => {
    const validatorGroup = new ValidatorGroup({ validators: simpleValidators });
    return validatorGroup.validate({ value: johnnyByPromise })
      .then(({ result, messages }) => {
        assert.equal(result, true);
        assert.deepEqual(messages, []);
      }).catch((msg) => { throw new Error(msg); });
  });

  it('can perform validation on a promise value and fail', () => {
    const validatorGroup = new ValidatorGroup({ validators: simpleValidators });
    return validatorGroup.validate({ value: johnByPromise })
      .then(({ result, messages }) => {
        assert.equal(result, false);
        assert.deepEqual(messages, [ 'The value must be at least 5 characters.' ]);
      }).catch((msg) => { throw new Error(msg); });
  });
});
