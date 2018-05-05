import assert from 'assert';
import { Nucleus } from './Nucleus';
import { PolicyGroup } from '../Policy';

describe('Nucleus', function () {
  it('can be created and with a type, label and options', () => {
    const nucleus = new Nucleus({ type: 'first_name', label: 'First Name', options: { test: true } });
    assert.equal(nucleus.config.type, 'first_name');
    assert.equal(nucleus.config.label, 'First Name');
    assert.equal(nucleus.options.test, true);
  });

  it('can be created with policies', () => {
    const policyGroup = new PolicyGroup([]);
    const nucleus = (new Nucleus({
      type: 'first_name',
      label: 'First Name',
      policies: policyGroup
    }));
    assert.deepEqual(nucleus.policies, policyGroup);
  });
});
