import {
  Schema,
  Fields,
  Field,
  CONTAINER,
  STRING,
  Collision,
  LookForOne,
  Depends,
  ValidateAll,
  SimpleValidator,
} from '../lib';

const onlyForMr = (collider, blueprint, hydrate, options) => {
  // Use the collider to retrieve values of other fields
  return collider.values.name.title === 'Mr';
};

const profile = Schema({
  machine: 'profile',
  scope: ['r', 'w'],
  roles: ['guest', 'user'],
  blueprints: Fields([
    Field({
      machine: 'name',
      label: 'Name',
      // CONTAINER context allows for child blueprints
      context: CONTAINER,
      // You can now add a blueprints property
      // All blueprints must be wrapped in a Blueprints class
      // In this case we are using the bundled Fields class
      blueprints: Fields([
        // Add your child fields
        // There is no limit to nesting so can add more container and collection fields
        Field({
          machine: 'title',
          label: 'Title',
          context: STRING,
        }),
        Field({
          machine: 'first_name',
          label: 'First Name',
          conditions: LookForOne([Depends({ checks: [onlyForMr] })]),
          context: STRING,
          validators: ValidateAll([
            SimpleValidator({ rules: ['required|alpha'] }),
          ]),
        }),
        Field({
          machine: 'surname',
          label: 'Surname',
          context: STRING,
          validators: ValidateAll([
            SimpleValidator({ rules: ['required|alpha'] }),
          ]),
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
    // Name data can now be passed inside a name property
    name: {
      title: 'Mrs',
      // first_name: 'Johnny',
      surname: 'Smith',
    },
  })
  .collide()
  .then(collider.refine)
  .then(collider.validate)
  .then(({ valid, results }) => {
    // Returns a boolean if validation was successful or not
    console.log('The data is valid', valid);
    // Returns a object containing all field validation results
    console.log(results);
    // What you want to do with validation results is up to you
    // You could throw an exception or let the reactor continue
  })
  .then(collider.dump)
  .then((values) => {
    // Returns { name: { title: 'Mr', surname: 'Smith' } }
    console.log(values);
  });
