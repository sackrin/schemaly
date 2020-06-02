import { expect } from 'chai';
import { STRING_ARRAY } from '../';
import { Field } from '../../';
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
    return fakeBlueprint
      .sanitize({ value: fakeField.getValue(), effect: fakeField })
      .then((sanitized) => {
        expect(sanitized).to.deep.equal(['42']);
      });
  });
});
