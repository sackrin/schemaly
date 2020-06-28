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
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(true);
        expect(messages).to.deep.equal([]);
      })
      .catch((msg) => {
        throw new Error(msg);
      });
  });

  it('fails when using an alwaysFalse function', () => {
    const alwaysFalse = (value: string) => ({ valid: false, messages: [] });
    const validator = FunctionalValidator([alwaysFalse]);
    const effect = fakeEffect({ value: 'Johnny' });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(false);
        expect(messages).to.deep.equal([]);
      })
      .catch((msg) => {
        throw new Error(msg);
      });
  });

  it('fails given alwaysTrue and alwaysFalse', () => {
    const alwaysFalse = (value: string) => ({ valid: false, messages: [] });
    const alwaysTrue = (value: string) => ({ valid: true, messages: [] });
    const validator = FunctionalValidator([alwaysFalse, alwaysTrue]);
    const effect = fakeEffect({ value: 'Johnny' });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(false);
        expect(messages).to.deep.equal([]);
      })
      .catch((msg) => {
        throw new Error(msg);
      });
  });

  it('passes when given no functions', () => {
    const validator = FunctionalValidator([]);
    const effect = fakeEffect({ value: 'Johnny' });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(true);
        expect(messages).to.deep.equal([]);
      })
      .catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can fail with messages', () => {
    const alwaysFalseWithMessage = (value: string) => ({
      valid: false,
      messages: ['validation failed'],
    });
    const validator = FunctionalValidator([alwaysFalseWithMessage]);
    const effect = fakeEffect({ value: 'Johnny' });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(false);
        expect(messages).to.deep.equal(['validation failed']);
      })
      .catch((msg) => {
        throw new Error(msg);
      });
  });

  const mustBeJohnny = (value: string) => {
    if (value === 'Johnny') {
      return {
        valid: true,
        messages: [],
      };
    } else {
      return {
        valid: false,
        messages: ['Where is Johnny'],
      };
    }
  };

  const simplePromiseValue = (name: string) =>
    new Promise((resolve) => {
      setTimeout(resolve, 100, name);
    });

  it('can read an async value (as valid)', () => {
    const validator = FunctionalValidator([mustBeJohnny]);
    const effect = fakeEffect({ value: simplePromiseValue('Johnny') });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(true);
        expect(messages).to.deep.equal([]);
      })
      .catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can read an async value (as invalid)', () => {
    const validator = FunctionalValidator([mustBeJohnny]);
    const effect = fakeEffect({ value: simplePromiseValue('Bill') });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(false);
        expect(messages).to.deep.equal(['Where is Johnny']);
      })
      .catch((msg) => {
        throw new Error(msg);
      });
  });

  const simplePromiseFunctionalValue = (name: string) =>
    new Promise((resolve) => {
      setTimeout(resolve, 100, (args: any) => name);
    });

  it('can read an async functional value (as invalid)', () => {
    const validator = FunctionalValidator([mustBeJohnny]);
    const effect = fakeEffect({
      value: simplePromiseFunctionalValue('Johnny'),
    });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(true);
        expect(messages).to.deep.equal([]);
      })
      .catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can read an async functional value (as invalid)', () => {
    const validator = FunctionalValidator([mustBeJohnny]);
    const effect = fakeEffect({ value: simplePromiseFunctionalValue('Bill') });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(false);
        expect(messages).to.deep.equal(['Where is Johnny']);
      })
      .catch((msg) => {
        throw new Error(msg);
      });
  });
});
