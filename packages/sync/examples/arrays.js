import { Schema, Fields, Field, STRING_ARRAY, Collision } from '../lib';

// Create your data schema
// This is a simple example with only one ARRAY field
const profile = Schema({
  machine: 'product',
  // Outline allowed scopes
  scope: ['r', 'w'],
  // Outline allowed roles
  roles: ['guest', 'user'],
  // Outline schema blueprints
  // In this case we are adding directly but best to create externally and import
  blueprints: Fields([
    Field({
      machine: 'tags',
      label: 'Tags',
      context: STRING_ARRAY,
    }),
  ]),
});
// Create a collider to handle applying data to the schema
const collider = Collision({
  // Add the profile we are colliding with
  model: profile,
  // Add the scope for this collide
  scope: ['r'],
  // Add the roles for this collide
  roles: ['guest'],
});
// Apply the data to the schema and dump the values
collider
  .with({
    tags: ['GREEN', 'BLUE']
  })
  .collide();
// Returns ['GREEN', 'BLUE']
console.log(collider.dump());
