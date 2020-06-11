import { Schema, Fields, Field, CONTAINER, STRING, Collision } from '../lib';

const profile = Schema({
  machine: 'profile',
  scope: ['r', 'w'],
  roles: ['guest', 'user'],
  blueprints: Fields([
    Field({
      machine: 'name',
      label: 'Name',
      context: CONTAINER,
      blueprints: Fields([
        Field({
          machine: 'title',
          label: 'Title',
          context: STRING,
        }),
        Field({
          machine: 'first_name',
          label: 'First Name',
          context: STRING,
        }),
        Field({
          machine: 'surname',
          label: 'Surname',
          context: STRING,
        }),
      ]),
    }),
  ]),
});

const collider = Collision({
  model: profile,
  scope: ['r'],
  roles: ['guest'],
});

collider
  .with({
    name: {
      title: 'Mr',
      first_name: 'Johnny',
      surname: 'Smith',
    },
  })
  .collide()
  .then(collider.refine)
  .then(collider.dump)
  .then(() => {
    // Returns a flattened list of hydrated fields
    console.log('paths', Object.keys(collider.flatten()));
    console.log('full', collider.flatten());
  });
