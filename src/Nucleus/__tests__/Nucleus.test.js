import assert from 'assert';
import { expect } from 'chai';
import Nucleus from '../Nucleus';
import * as context from '../context';
import NucleusGroup from '../NucleusGroup';
import { Sanitizers } from '../../Sanitize/Sanitizers';
import { Validators } from '../../Validate/Validators';
import { GrantSinglePolicy, DenyPolicy, AllowPolicy } from '../../Policy';
import { SimpleSanitizer } from '../../Sanitize';
import { SimpleValidator } from '../../Validate';

describe('Nucleus', function () {
  const fakeArgs = {
    parent: {},
    type: context.STRING,
    machine: 'first_name',
    label: 'First Name',
    policies: GrantSinglePolicy({ policies: [
      DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
      AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] })
    ] }),
    sanitizers: Sanitizers({ filters: [
      SimpleSanitizer({ rules: ['trim'] }),
      SimpleSanitizer({ rules: ['upper_case'] })
    ] }),
    validators: Validators({ validators: [
      SimpleValidator({ rules: ['required'] }),
      SimpleValidator({ rules: ['min:5'] })
    ] })
  };

  it('can be created and with config, parent and options', () => {
    const nucleus = Nucleus({
      ...fakeArgs,
      test: true
    });
    assert.equal(nucleus.parent, fakeArgs.parent);
    assert.equal(nucleus.config.type, context.STRING);
    assert.equal(nucleus.config.machine, 'first_name');
    assert.equal(nucleus.config.label, 'First Name');
    assert.equal(nucleus.options.test, true);
    assert.equal(nucleus.policies, fakeArgs.policies);
    assert.equal(nucleus.sanitizers, fakeArgs.sanitizers);
    assert.equal(nucleus.validators, fakeArgs.validators);
  });

  it('collection nucleus can have a group of nuclei added', () => {
    const nucleusOne = Nucleus({ ...fakeArgs, label: 'first_name' });
    const nucleusTwo = Nucleus({ ...fakeArgs, label: 'surname' });
    const nucleusThree = Nucleus({ ...fakeArgs, label: 'title' });
    const nucleusGroup = NucleusGroup({ nuclei: [nucleusOne, nucleusTwo, nucleusThree] });
    const nucleus = Nucleus({ ...fakeArgs, type: context.COLLECTION, machine: 'people' });
    nucleus.addNuclei({ nuclei: nucleusGroup });
    assert.equal(nucleus.nuclei, nucleusGroup);
    assert.equal(nucleus.nuclei.parent, nucleus);
  });

  it('string nucleus cannot have a group of nuclei added', () => {
    const nucleusOne = Nucleus({ ...fakeArgs, label: 'first_name' });
    const nucleusTwo = Nucleus({ ...fakeArgs, label: 'surname' });
    const nucleusThree = Nucleus({ ...fakeArgs, label: 'title' });
    const nucleusGroup = NucleusGroup({ nuclei: [nucleusOne, nucleusTwo, nucleusThree] });
    const nucleus = Nucleus({ ...fakeArgs, machine: 'email_address' });
    expect(() => nucleus.addNuclei({ nuclei: nucleusGroup })).to.throw('CANNOT_HAVE_CHILDREN');
  });
});
