import {
  Schema,
  Fields,
  Field,
  STRING,
  INT,
  ValidateAll,
  SimpleValidator,
  FunctionalValidator,
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
    Field({
      machine: 'phone',
      label: 'Phone Number',
      context: INT,
      validators: ValidateAll([
        // FunctionalValidator allows you to implement more complex validation
        // using custom functions.
        FunctionalValidator([
          (value) => {
            if (`${value}`.length !== 8) {
              return {
                valid: false,
                message: ['Phone numbers must be exactly 8 digits long'],
              };
            } else {
              return {
                valid: true,
                message: [],
              };
            }
          },
        ]),
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
  .collide();
const { valid, results } = reactor.validate();
// Returns a boolean if validation was successful or not
console.log(valid);
// Returns a object containing all field validation results
console.log(results);
// What you want to do with validation results is up to you
// You could throw an exception or let the reactor continue
console.log(reactor.dump());
