import { Schema } from '../../Model';
import { Field, Fields, STRING } from '../../Blueprint';
import { Hydrate } from '../../Effect';
import { Collision } from '../../Interact';
import { expect } from 'chai';
import { OneOfValidator } from '../index';

describe('Validate/OneOfValidator', (): void => {
  const simpleStringRule = 'red|green|blue';

  const simplePromiseRule = () =>
    new Promise(resolve => {
      setTimeout(resolve, 100, ['orange']);
    });

  const fakeModel = Schema({
    machine: 'test',
    roles: ['user', 'admin'],
    scope: ['read', 'write'],
    blueprints: Fields([Field({ machine: 'first_name', context: STRING })])
  });

  const fakeEffect = (options: any = {}) =>
    Hydrate({
      collider: Collision({
        model: fakeModel,
        roles: ['user', 'admin'],
        scope: ['read', 'write']
      }),
      blueprint: fakeModel.blueprints.blueprints[0],
      value: 'John',
      ...options
    });

  it('can create a simple rule validator', () => {
    const validator = OneOfValidator({
      rules: [simpleStringRule],
      options: { test: true }
    });
    expect(validator.rules).to.deep.equal([simpleStringRule]);
    expect(validator.options).to.deep.equal({ test: true });
  });

  it('can create a mixed rule validator', () => {
    const validator = OneOfValidator({
      rules: [simpleStringRule, simplePromiseRule]
    });
    expect(validator.rules).to.deep.equal([
      simpleStringRule,
      simplePromiseRule
    ]);
  });

  it('get rules produces a usable validator string', () => {
    const validator = OneOfValidator({
      rules: [simpleStringRule, simplePromiseRule]
    });
    return validator
      .getRules()
      .then(rules => {
        expect(rules).to.equal('red|green|blue|orange');
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it('validates against a simple value and passes', () => {
    const validator = OneOfValidator({ rules: [simpleStringRule] });
    const effect = fakeEffect({ value: 'red' });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(true);
        expect(messages).to.deep.equal([]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it('validates against a simple value and fails', () => {
    const validator = OneOfValidator({ rules: [simpleStringRule] });
    const effect = fakeEffect({ value: 'yellow' });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(false);
        expect(messages).to.deep.equal([
          'the value must match one of the allowed values.'
        ]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it('validates against a promise value and passes', () => {
    const simplePromiseValue = () =>
      new Promise(resolve => {
        setTimeout(resolve, 100, 'red');
      });
    const validator = OneOfValidator({ rules: [simpleStringRule] });
    const effect = fakeEffect({ value: simplePromiseValue });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(true);
        expect(messages).to.deep.equal([]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it('validates against a promise value and fails', () => {
    const simplePromiseValue = () =>
      new Promise(resolve => {
        setTimeout(resolve, 100, 'yellow');
      });
    const validator = OneOfValidator({ rules: [simpleStringRule] });
    const effect = fakeEffect({ value: simplePromiseValue });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(false);
        expect(messages).to.deep.equal([
          'the value must match one of the allowed values.'
        ]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });
});
