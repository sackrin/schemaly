import assert from 'assert';
import { Nucleus } from './Nucleus';
import { SingleGrantPolicyGroup } from '../Policy';
import * as types from './types';
import { NucleusGroup } from './NucleusGroup';

describe('Nucleus', function () {
  it('can be created and with config, parent and options', () => {
    const parent = {};
    const nucleus = new Nucleus({ type: types.STRING, machine: 'first_name', label: 'First Name', parent: parent, options: { test: true } });
    assert.equal(nucleus.parent, parent);
    assert.equal(nucleus.config.type, types.STRING);
    assert.equal(nucleus.config.machine, 'first_name');
    assert.equal(nucleus.config.label, 'First Name');
    assert.equal(nucleus.options.test, true);
  });

  it('can be created with policies', () => {
    const policyGroup = new SingleGrantPolicyGroup([]);
    const nucleus = (new Nucleus({
      type: types.STRING,
      machine: 'first_name',
      label: 'First Name',
      policies: policyGroup
    }));
    assert.deepEqual(nucleus.policies, policyGroup);
  });

  it('can have a group of nuclei added', () => {
    const nucleusOne = new Nucleus({ label: 'first_name' });
    const nucleusTwo = new Nucleus({ label: 'surname' });
    const nucleusThree = new Nucleus({ label: 'title' });
    const nucleusGroup = new NucleusGroup([nucleusOne, nucleusTwo, nucleusThree]);
    const nucleus = new Nucleus({ type: types.COLLECTION, machine: 'emails' });
    nucleus.addNuclei(nucleusGroup);
    assert.equal(nucleus.nuclei, nucleusGroup);
    assert.equal(nucleus.nuclei.parent, nucleus);
  });
});
