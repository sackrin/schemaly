import { Schema, Fields, Field, STRING, Collision } from '../lib';
import { SimpleValidator } from '../src/Validate';

const ARRAY = {
  code: "array",
  children: false,
  repeater: false,
  sanitizers: [],
  validators: []
};

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
      context: ARRAY,
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
  .collide()
  .then(collider.dump)
  .then((values) => {
    // Returns ['GREEN', 'BLUE']
    console.log(values);
  });
