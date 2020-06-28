import { Schema, Fields, Field, STRING, Collision } from '../lib';

// Create your data schema
// This is a simple example with only one STRING field
// You can create complex fields with child fields (CONTAINER) or multiple groups of child fields (COLLECTION)
const profile = Schema({
  machine: 'profile',
  // Outline allowed scopes
  scope: ['r', 'w'],
  // Outline allowed roles
  roles: ['guest', 'user'],
  // Outline schema blueprints
  // In this case we are adding directly but best to create externally and import
  blueprints: Fields([
    Field({
      machine: 'first_name',
      label: 'First Name',
      context: STRING,
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
    first_name: 'Johnny',
    surname: 'Smith',
  })
  .collide();
// Returns { first_name: 'Johnny' }
console.log(collider.dump());
