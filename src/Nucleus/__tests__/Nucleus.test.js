import assert from 'assert';
import { expect } from 'chai';
import { Nucleus } from '../Nucleus';
import * as context from '../context';
import { NucleusGroup } from '../NucleusGroup';
import { Sanitizers } from '../../Sanitize/Sanitizers';
import { Validators } from '../../Validate/Validators';
import { GrantSinglePolicy, DenyPolicy, AllowPolicy } from '../../Policy';
import { SimpleSanitizer } from '../../Sanitize';
import { SimpleValidator } from '../../Validate';

describe('Nucleus', function () {
  const mockPolicies = new GrantSinglePolicy({ policies: [
    new DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
    new AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] })
  ] });

  const mockSanitisers = new Sanitizers({ filters: [
    new SimpleSanitizer({ rules: ['trim'] }),
    new SimpleSanitizer({ rules: ['upper_case'] })
  ] });

  const mockValidators = new Validators({ validators: [
    new SimpleValidator({ rules: ['required'] }),
    new SimpleValidator({ rules: ['min:5'] })
  ] });

  it('can be created and with config, parent and options', () => {
    const parent = {};
    const nucleus = new Nucleus({
      type: context.STRING,
      machine: 'first_name',
      label: 'First Name',
      parent: parent,
      policies: mockPolicies,
      sanitizers: mockSanitisers,
      validators: mockValidators,
      test: true
    });
    assert.equal(nucleus.parent, parent);
    assert.equal(nucleus.config.type, context.STRING);
    assert.equal(nucleus.config.machine, 'first_name');
    assert.equal(nucleus.config.label, 'First Name');
    assert.equal(nucleus.options.test, true);
    assert.equal(nucleus.policies, mockPolicies);
    assert.equal(nucleus.sanitizers, mockSanitisers);
    assert.equal(nucleus.validators, mockValidators);
  });

  it('collection nucleus can have a group of nuclei added', () => {
    const nucleusOne = new Nucleus({ type: context.STRING, label: 'first_name' });
    const nucleusTwo = new Nucleus({ type: context.STRING, label: 'surname' });
    const nucleusThree = new Nucleus({ type: context.STRING, label: 'title' });
    const nucleusGroup = new NucleusGroup({ nuclei: [nucleusOne, nucleusTwo, nucleusThree] });
    const nucleus = new Nucleus({ type: context.COLLECTION, machine: 'people' });
    nucleus.addNuclei({ nuclei: nucleusGroup });
    assert.equal(nucleus.nuclei, nucleusGroup);
    assert.equal(nucleus.nuclei.parent, nucleus);
  });

  it('string nucleus cannot have a group of nuclei added', () => {
    const nucleusOne = new Nucleus({ type: context.STRING, label: 'first_name' });
    const nucleusTwo = new Nucleus({ type: context.STRING, label: 'surname' });
    const nucleusThree = new Nucleus({ type: context.STRING, label: 'title' });
    const nucleusGroup = new NucleusGroup({ nuclei: [nucleusOne, nucleusTwo, nucleusThree] });
    const nucleus = new Nucleus({ type: context.STRING, machine: 'email_address' });
    expect(() => nucleus.addNuclei({ nuclei: nucleusGroup })).to.throw('CANNOT_HAVE_CHILDREN');
  });
});
