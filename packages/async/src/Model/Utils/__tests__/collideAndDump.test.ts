import Schema from '../../Schema';
import { expect } from 'chai';
import { Field, Fields, STRING } from '../../../Blueprint';
import collideAndDump from '../collideAndDump';

describe('Model/Utils/collideAndDump', () => {
  const fakeArgs = {
    machine: 'person',
    label: 'Person Schema',
    scope: ['read', 'write'],
    roles: ['user', 'guest'],
    blueprints: Fields([
      Field({ context: STRING, machine: 'title' }),
      Field({
        context: STRING,
        machine: 'firstName'
      }),
      Field({
        context: STRING,
        machine: 'surname'
      })
    ])
  };

  it('can dump data from a schema', async () => {
    const fakeModel = Schema({
      ...fakeArgs
    });
    const dumpedValues = await collideAndDump({
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
});
