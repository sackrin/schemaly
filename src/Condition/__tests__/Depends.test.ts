import { expect } from 'chai';
import Depends from '../Depends';
import { Schema } from '../../Model';
import Fields from '../../Blueprint/Fields';
import Field from '../../Blueprint/Field';
import { STRING } from '../../Blueprint/Context';
import { Hydrate } from '../../Effect';
import { Collider, Collision } from '../../Interact';
import { Blueprint } from '../../Blueprint/Types';

describe('Condition/Depends', (): void => {
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

  it('can return truthy for a simple check', async () => {
    const fakeCondition = Depends({ checks: [() => true] });
    const collider = await fakeCollider();
    const hydrate = await getEffect(collider, fakeField, 'Johnny');
    const result = await fakeCondition.check({
      collider,
      blueprint: fakeField,
      hydrate,
    });
    expect(result).to.equal(true);
  });

  it('can return truthy for a set of simple checks', async () => {
    const fakeCondition = Depends({ checks: [() => true, () => true] });
    const collider = await fakeCollider();
    const hydrate = await getEffect(collider, fakeField, 'Johnny');
    const result = await fakeCondition.check({
      collider,
      blueprint: fakeField,
      hydrate,
    });
    expect(result).to.equal(true);
  });

  it('can return falsey for a simple check', async () => {
    const fakeCondition = Depends({ checks: [() => false] });
    const collider = await fakeCollider();
    const hydrate = await getEffect(collider, fakeField, 'Johnny');
    const result = await fakeCondition.check({
      collider,
      blueprint: fakeField,
      hydrate,
    });
    expect(result).to.equal(false);
  });

  it('can return falsey for a set of simple checks', async () => {
    const fakeCondition = Depends({ checks: [() => false, () => true] });
    const collider = await fakeCollider();
    const hydrate = await getEffect(collider, fakeField, 'Johnny');
    const result = await fakeCondition.check({
      collider,
      blueprint: fakeField,
      hydrate,
    });
    expect(result).to.equal(false);
  });

  it('can return truthy for a async check', async () => {
    const fakeCondition = Depends({ checks: [async () => true] });
    const collider = await fakeCollider();
    const hydrate = await getEffect(collider, fakeField, 'Johnny');
    const result = await fakeCondition.check({
      collider,
      blueprint: fakeField,
      hydrate,
    });
    expect(result).to.equal(true);
  });

  it('can return truthy for a set of async checks', async () => {
    const fakeCondition = Depends({ checks: [async () => true, async () => true] });
    const collider = await fakeCollider();
    const hydrate = await getEffect(collider, fakeField, 'Johnny');
    const result = await fakeCondition.check({
      collider,
      blueprint: fakeField,
      hydrate,
    });
    expect(result).to.equal(true);
  });

  it('can return falsey for a async check', async () => {
    const fakeCondition = Depends({ checks: [async () => false] });
    const collider = await fakeCollider();
    const hydrate = await getEffect(collider, fakeField, 'Johnny');
    const result = await fakeCondition.check({
      collider,
      blueprint: fakeField,
      hydrate,
    });
    expect(result).to.equal(false);
  });

  it('can return falsey for a set of async checks', async () => {
    const fakeCondition = Depends({ checks: [async () => false, async () => true] });
    const collider = await fakeCollider();
    const hydrate = await getEffect(collider, fakeField, 'Johnny');
    const result = await fakeCondition.check({
      collider,
      blueprint: fakeField,
      hydrate,
    });
    expect(result).to.equal(false);
  });

  it('can return truthy for a set of mixed checks', async () => {
    const fakeCondition = Depends({ checks: [async () => true, () => true] });
    const collider = await fakeCollider();
    const hydrate = await getEffect(collider, fakeField, 'Johnny');
    const result = await fakeCondition.check({
      collider,
      blueprint: fakeField,
      hydrate,
    });
    expect(result).to.equal(true);
  });

  it('can return falsey for a set of mixed checks', async () => {
    const fakeCondition = Depends({ checks: [async () => false, () => true] });
    const collider = await fakeCollider();
    const hydrate = await getEffect(collider, fakeField, 'Johnny');
    const result = await fakeCondition.check({
      collider,
      blueprint: fakeField,
      hydrate,
    });
    expect(result).to.equal(false);
  });
});
