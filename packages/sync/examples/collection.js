import {
  Schema,
  Fields,
  Field,
  COLLECTION,
  BOOLEAN,
  STRING,
  Collision,
} from '../lib';

const profile = Schema({
  machine: 'profile',
  scope: ['r', 'w'],
  roles: ['guest', 'user'],
  blueprints: Fields([
    Field({
      machine: 'emails',
      label: 'Emails',
      // COLLECTION context allows for child blueprints
      context: COLLECTION,
      // Like container fields you can now use the blueprints property
      // Collections allow for multiple groups of child fields
      // This is useful for lists of data like emails, addresses etc
      blueprints: Fields([
        Field({
          machine: 'address',
          label: 'Address',
          context: STRING,
        }),
        Field({
          machine: 'is_primary',
          label: 'Primary',
          context: BOOLEAN,
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
    // emails needs to pass an array of value groups
    // Each value will be treated as an individual container
    emails: [
      {
        address: 'johnny@example.com',
        is_primary: false,
      },
      {
        address: 'johnny@work.com',
        is_primary: true,
      },
    ],
  })
  .collide();
// { emails:
//    [ { address: 'johnny@example.com', is_primary: false },
//        { address: 'johnny@work.com', is_primary: true } ] }
console.log(collider.dump());
