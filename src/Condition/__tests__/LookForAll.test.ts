import { expect } from 'chai';
import LookForAll from '../LookForAll';
import Field from '../../Blueprint/Field';
import { STRING } from '../../Blueprint/Context';
import { Schema } from '../../Model';
import Fields from '../../Blueprint/Fields';
import { Collider, Collision } from '../../Interact';
import { Blueprint } from '../../Blueprint/Types';
import { Hydrate } from '../../Effect';
import Depends from '../Depends';

describe('Condition/LookForAll', (): void => {
  const fakeField = Field({ machine: 'example', context: STRING });

  const fakeModel = Schema({
    machine: 'test',
    roles: ['user', 'admin'],
    scope: ['read', 'write'],
    blueprints: Fields([fakeField]),
  });

  const fakeCollider = async () => {
    // Create a collider to handle applying data to the schema
    const collider = Collision({
      // Add the profile we are colliding with
      model: fakeModel,
      // Add the scope for this collide
      scope: ['read'],
      // Add the roles for this collide
      roles: ['user'],
    });
    // Return the collider instance
    return collider.with({
      example: 'Johnny',
    });
  };

  const getEffect = (collider: Collider, blueprint: Blueprint, value: any) =>
    Hydrate({
      collider,
      blueprint,
      value,
    });

  it('can return truthy for a set of conditions which return truthy results', async () => {
    const fakeConditions = LookForAll([
      Depends({ checks: [() => true] }),
      Depends({ checks: [() => true] }),
    ]);
    const collider = await fakeCollider();
    const hydrate = await getEffect(collider, fakeField, 'Johnny');
    const result = await fakeConditions.check({
      collider,
      blueprint: fakeField,
      hydrate,
    });
    expect(result).to.equal(true);
  });

  it('can return falsey for a set of conditions which return mixed results', async () => {
    const fakeConditions = LookForAll([
      Depends({ checks: [() => true] }),
      Depends({ checks: [() => false] }),
    ]);
    const collider = await fakeCollider();
    const hydrate = await getEffect(collider, fakeField, 'Johnny');
    const result = await fakeConditions.check({
      collider,
      blueprint: fakeField,
      hydrate,
    });
    expect(result).to.equal(false);
  });

  it('can return falsey for a set of conditions which all return false', async () => {
    const fakeConditions = LookForAll([
      Depends({ checks: [() => false] }),
      Depends({ checks: [() => false] }),
    ]);
    const collider = await fakeCollider();
    const hydrate = await getEffect(collider, fakeField, 'Johnny');
    const result = await fakeConditions.check({
      collider,
      blueprint: fakeField,
      hydrate,
    });
    expect(result).to.equal(false);
  });
});
