import { expect } from 'chai';
import { Hydrate } from '../../Effect';
import { Schema } from '../../Model';
import { Collision } from '../../Interact';
import { Field, Fields, STRING } from '../../Blueprint';
import FunctionalValidator from '../FunctionalValidator';

describe('Validate/FunctionalValidator', (): void => {
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

  it('passes when using an alwaysTrue function', () => {
    const alwaysTrue = (value: string) => ({ valid: true, messages: [] });
    const validator = FunctionalValidator([alwaysTrue]);
    const effect = fakeEffect({ value: 'Johnny' });
    const { valid, messages } = validator.validate({ effect });
    expect(valid).to.equal(true);
    expect(messages).to.deep.equal([]);
  });

  it('fails when using an alwaysFalse function', () => {
    const alwaysFalse = (value: string) => ({ valid: false, messages: [] });
    const validator = FunctionalValidator([alwaysFalse]);
    const effect = fakeEffect({ value: 'Johnny' });
    const { valid, messages } = validator.validate({ effect });
    expect(valid).to.equal(false);
    expect(messages).to.deep.equal([]);
  });

  it('fails given alwaysTrue and alwaysFalse', () => {
    const alwaysFalse = (value: string) => ({ valid: false, messages: [] });
    const alwaysTrue = (value: string) => ({ valid: true, messages: [] });
    const validator = FunctionalValidator([alwaysFalse, alwaysTrue]);
    const effect = fakeEffect({ value: 'Johnny' });
    const { valid, messages } = validator.validate({ effect });
    expect(valid).to.equal(false);
    expect(messages).to.deep.equal([]);
  });

  it('passes when given no functions', () => {
    const validator = FunctionalValidator([]);
    const effect = fakeEffect({ value: 'Johnny' });
    const { valid, messages } = validator.validate({ effect });
    expect(valid).to.equal(true);
    expect(messages).to.deep.equal([]);
  });

  it('can fail with messages', () => {
    const alwaysFalseWithMessage = (value: string) => ({
      valid: false,
      messages: ['validation failed'],
    });
    const validator = FunctionalValidator([alwaysFalseWithMessage]);
    const effect = fakeEffect({ value: 'Johnny' });
    const { valid, messages } = validator.validate({ effect });
    expect(valid).to.equal(false);
    expect(messages).to.deep.equal(['validation failed']);
  });
});
