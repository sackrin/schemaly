import Schema from '../../Schema';
import { expect } from 'chai';
import { Field, Fields, STRING } from '../../../Blueprint';
import collideAndValidate from '../collideAndValidate';
import { SimpleValidator, ValidateAll } from '../../../Validate';

describe('Model/Utils/collideAndValidate', () => {
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

  it('can validate an return a successful validation result', async () => {
    const fakeModel = Schema({
      ...fakeArgs
    });
    const validationResult = await collideAndValidate({
      model: fakeModel,
      roles: ['user'],
      scope: ['read'],
      values: {
        title: 'Mr',
        firstName: 'Ryan',
        surname: 'Smith'
      },
      options: {}
    });
    expect(validationResult.valid).to.equal(true);
  });

  it('can validate an return a failed validation result', async () => {
    const fakeModel = Schema({
      ...fakeArgs
    });
    const validationResult = await collideAndValidate({
      model: fakeModel,
      roles: ['user'],
      scope: ['read'],
      values: {
        title: 'Mr',
        firstName: '',
        surname: ''
      },
      options: {}
    });
    expect(validationResult.valid).to.equal(false);
  });
});
