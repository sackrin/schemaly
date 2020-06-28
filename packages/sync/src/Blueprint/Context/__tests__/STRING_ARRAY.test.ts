import { expect } from 'chai';
import { STRING_ARRAY } from '../index';
import { Field } from '../../index';
import { Hydrate } from '../../../Effect';
import { Schema } from '../../../Model';
import { Collision } from '../../../Interact';
import { Fields } from '../../index';

describe('Blueprint/Context/STRING_ARRAY', () => {
  const fakeBlueprint = Field({
    machine: 'example',
    context: STRING_ARRAY,
  });

  const fakeModel = Schema({
    machine: 'test',
    roles: ['user', 'admin'],
    scope: ['read', 'write'],
    blueprints: Fields([Field({ machine: 'example', context: STRING_ARRAY })]),
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
    expect(fakeBlueprint.sanitizers.sanitizers).to.deep.equal(
      STRING_ARRAY.sanitizers
    );
    expect(fakeBlueprint.validators.validators).to.deep.equal(
      STRING_ARRAY.validators
    );
  });

  it('can convert an array of numbers to an array of strings', () => {
    const fakeField = fakeEffect({ value: [42] });
    const sanitized = fakeBlueprint.sanitize({
      value: fakeField.getValue(),
      effect: fakeField,
    });
    expect(sanitized).to.deep.equal(['42']);
  });
});
