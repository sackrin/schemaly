import { Schema } from '../../Model';
import { Field, Fields, STRING } from '../../Blueprint';
import { Hydrate } from '../../Effect';
import { Collision } from '../../Interact';
import { expect } from 'chai';
import { OneOfValidator } from '../index';

describe('Validate/OneOfValidator', (): void => {
  const simpleStringRule = 'red|green|blue';

  const fakeModel = Schema({
    machine: 'test',
    roles: ['user', 'admin'],
    scope: ['read', 'write'],
    blueprints: Fields([Field({ machine: 'first_name', context: STRING })]),
  });

  const fakeEffect = (options: any = {}) =>
    Hydrate({
      collider: Collision({
        model: fakeModel,
        roles: ['user', 'admin'],
        scope: ['read', 'write'],
      }),
      blueprint: fakeModel.blueprints.blueprints[0],
      value: 'John',
      ...options,
    });

  it('can create a simple rule validator', () => {
    const validator = OneOfValidator({
      rules: [simpleStringRule],
      options: { test: true },
    });
    expect(validator.rules).to.deep.equal([simpleStringRule]);
    expect(validator.options).to.deep.equal({ test: true });
  });

  it('validates against a simple value and passes', () => {
    const validator = OneOfValidator({ rules: [simpleStringRule] });
    const effect = fakeEffect({ value: 'red' });
    const { valid, messages } = validator.validate({ effect });
    expect(valid).to.equal(true);
    expect(messages).to.deep.equal([]);
  });

  it('validates against a simple value and fails', () => {
    const validator = OneOfValidator({ rules: [simpleStringRule] });
    const effect = fakeEffect({ value: 'yellow' });
    const { valid, messages } = validator.validate({ effect });
    expect(valid).to.equal(false);
    expect(messages).to.deep.equal([
      'the value must match one of the allowed values.',
    ]);
  });
});
