import Schema from '../../Schema';
import { expect } from 'chai';
import { Field, Fields, STRING } from '../../../Blueprint';
import collideAndProcess from '../collideAndProcess';
import { SimpleValidator, ValidateAll, ValidatorResult } from '../../../Validate';

describe('Model/Utils/collideAndProcess', () => {
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

  it('can return a valid set of data', async () => {
    const fakeModel = Schema({
      ...fakeArgs
    });
    const dumpedValues = await collideAndProcess({
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
    expect(dumpedValues).to.deep.equal({
      title: 'Mr',
      firstName: 'Ryan',
      surname: 'Smith'
    });
  });

  it('can validate an return a failed validation result', async () => {
    const fakeModel = Schema({
      ...fakeArgs
    });
    const dumpedValues = await collideAndProcess({
      model: fakeModel,
      roles: ['user'],
      scope: ['read'],
      values: {
        title: 'Mr',
        firstName: '',
        surname: ''
      },
      options: {}
    }) as { valid: boolean; results: { [s: string]: ValidatorResult } };
    expect(dumpedValues.valid).to.equal(false);
  });
});
