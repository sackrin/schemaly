import { expect } from 'chai';
import { SimpleValidator } from '../';
import { Hydrate, Effect } from '../../Effect';
import { Schema } from '../../Model';
import { Collision } from '../../Interact';
import { Field, Fields, STRING } from '../../Blueprint';

describe('Validate/SimpleValidator', (): void => {
  const simpleStringRule = 'required|min:5';

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
    const validator = SimpleValidator({
      rules: [simpleStringRule],
      options: { test: true },
    });
    expect(validator.rules).to.deep.equal([simpleStringRule]);
    expect(validator.options).to.deep.equal({ test: true });
  });

  it('validates against a simple value and passes', () => {
    const validator = SimpleValidator({ rules: [simpleStringRule] });
    const effect = fakeEffect({ value: 'Johnny' });
    const { valid, messages } = validator.validate({ effect });
    expect(valid).to.equal(true);
    expect(messages).to.deep.equal([]);
  });

  it('validates against a simple value and fails', () => {
    const validator = SimpleValidator({ rules: [simpleStringRule] });
    const effect = fakeEffect({ value: 'John' });
    const { valid, messages } = validator.validate({ effect });
    expect(valid).to.equal(false);
    expect(messages).to.deep.equal([
      'The value must be at least 5 characters.',
    ]);
  });
});
