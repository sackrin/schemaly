import { expect } from 'chai';
import { INT } from '../index';
import { Field } from '../../index';
import { Hydrate } from '../../../Effect';
import { Schema } from '../../../Model';
import { Collision } from '../../../Interact';
import { Fields, STRING } from '../../index';

describe('Blueprint/Context/INT', () => {
  const fakeBlueprint = Field({
    machine: 'example',
    context: INT,
  });

  const fakeModel = Schema({
    machine: 'test',
    roles: ['user', 'admin'],
    scope: ['read', 'write'],
    blueprints: Fields([Field({ machine: 'example', context: STRING })]),
  });

  const fakeEffect = (options: any = {}) =>
    Hydrate({
      collider: Collision({
        model: fakeModel,
        roles: ['user', 'admin'],
        scope: ['read', 'write'],
      }),
      blueprint: fakeModel.blueprints.blueprints[0],
      ...options,
    });

  it('can add validators to the parent blueprint', () => {
    expect(fakeBlueprint.sanitizers.sanitizers).to.deep.equal(INT.sanitizers);
    expect(fakeBlueprint.validators.validators).to.deep.equal(INT.validators);
  });

  it('can convert a non int to an int', () => {
    const fakeField = fakeEffect({ value: '2' });
    const sanitized = fakeBlueprint.sanitize({
      value: fakeField.getValue(),
      effect: fakeField,
    });
    expect(sanitized).to.equal(2);
  });
});
