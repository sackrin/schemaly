import {
  Schema,
  Fields,
  Field,
  STRING,
  ValidateAll,
  SimpleValidator,
  Collision,
} from '../lib';

const profile = Schema({
  machine: 'profile',
  scope: ['r', 'w'],
  roles: ['guest', 'user'],
  blueprints: Fields([
    Field({
      machine: 'first_name',
      label: 'First Name',
      context: STRING,
      // ValidateAll will check to ensure all validators return valid
      // You can create your own Validators container if you like
      validators: ValidateAll([
        // SimpleValidator uses the skaterdav85/validatorjs library
        // You can create your own or stack multiple validators here
        SimpleValidator({ rules: ['required|alpha'] }),
      ]),
    }),
  ]),
});

const reactor = Collision({
  model: profile,
  scope: ['guest'],
  roles: ['r'],
});

reactor
  .with({
    first_name: 'Johnny',
    surname: 'Smith',
  })
  .collide()
  .then(reactor.validate)
  .then(({ valid, results }) => {
    // Returns a boolean if validation was successful or not
    console.log(valid);
    // Returns a object containing all field validation results
    console.log(results);
    // What you want to do with validation results is up to you
    // You could throw an exception or let the reactor continue
  })
  .then(reactor.dump)
  .then((values) => {
    console.log(values);
  });
