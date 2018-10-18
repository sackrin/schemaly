import { expect } from 'chai';
import Schema from '../Schema';
import { STRING, Fields, Field } from '../../Blueprint';
import { ValidatorResult } from '../../Validate/Types';
import { SimpleValidator, ValidateAll } from '../../Validate';

describe('Model/Schema', () => {
  const getRequiredValidator = () =>
    ValidateAll([SimpleValidator({ rules: ['required'] })]);

  const fakeArgs = {
    machine: 'person',
    label: 'Person Schema',
    scope: ['read', 'write'],
    roles: ['user', 'guest'],
    blueprints: Fields([
      Field({ context: STRING, machine: 'title' }),
      Field({
        context: STRING,
        machine: 'firstName',
        validators: getRequiredValidator()
      }),
      Field({
        context: STRING,
        machine: 'surname',
        validators: getRequiredValidator()
      })
    ])
  };

  it('can create an model instance', () => {
    const fakeModel = Schema({
      ...fakeArgs,
      options: {
        testing: true
      }
    });
    expect(fakeModel.label).to.equal('Person Schema');
    expect(fakeModel.machine).to.equal('person');
    expect(fakeModel.blueprints).to.equal(fakeArgs.blueprints);
    expect(fakeModel.roles).to.equal(fakeArgs.roles);
    expect(fakeModel.scope).to.equal(fakeArgs.scope);
    expect(fakeModel.options).to.deep.equal({ testing: true });
  });

  it('can create and output a collider', async () => {
    const fakeModel = Schema({
      ...fakeArgs
    });
    const collision = await fakeModel
      .collide({
        roles: ['user'],
        scope: ['read']
      })
      .with({
        title: 'Mr',
        firstName: 'Ryan',
        surname: 'Smith'
      })
      .collide();
    const dumpedValues = await collision.dump();
    expect(dumpedValues).to.deep.equal({
      title: 'Mr',
      firstName: 'Ryan',
      surname: 'Smith'
    });
  });

  it('can receive a data object and output a validated and sanitized data object', async () => {
    const fakeModel = Schema({
      ...fakeArgs
    });
    const dumpedValues = await fakeModel.handle({
      roles: ['user'],
      scope: ['read'],
      values: {
        title: 'Mr',
        firstName: 'Ryan',
        surname: 'Smith'
      },
      options: {}
    });
    expect(dumpedValues).to.deep.equal({
      title: 'Mr',
      firstName: 'Ryan',
      surname: 'Smith'
    });
  });

  it('can receive a data object and output a validation object', async () => {
    const fakeModel = Schema({
      ...fakeArgs
    });
    const dumpedValues = (await fakeModel.handle({
      roles: ['user'],
      scope: ['read'],
      values: {
        title: 'Mr',
        firstName: '',
        surname: ''
      },
      options: {}
    })) as ValidatorResult;
    expect(dumpedValues.valid).to.equal(false);
  });
});
