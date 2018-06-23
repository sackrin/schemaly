import assert from 'assert';
import { expect } from 'chai';
import Nucleus from '../Nucleus';
import * as context from '../context';
import NucleusGroup from '../NucleusGroup';
import { Sanitizers, SimpleSanitizer } from '../../Sanitize';
import { Validators, SimpleValidator } from '../../Validate';
import { GrantSinglePolicy, DenyPolicy, AllowPolicy } from '../../Policy';

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
    ] }),
    setters: [
      ({ value, isotope }) => (value.toString().toUpperCase())
    ],
    getters: [
      ({ value, isotope }) => (value.toString().toUpperCase())
    ]
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

  it('can validate a value against provided validators and expect a pass', () => {
    const fakeNucleus = Nucleus(fakeArgs);
    return fakeNucleus.validate({ value: 'Jennifer' })
      .then(check => {
        expect(check.result).to.equal(true);
        expect(check.messages).to.deep.equal([]);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can validate a value against provided validators and expect a fail', () => {
    const fakeNucleus = Nucleus(fakeArgs);
    return fakeNucleus.validate({ value: 'Tom' })
      .then(check => {
        expect(check.result).to.equal(false);
        expect(check.messages).to.deep.equal([ 'The value must be at least 5 characters.' ]);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can sanitize a value against provided sanitizes', () => {
    const fakeNucleus = Nucleus(fakeArgs);
    return fakeNucleus.sanitize({ value: ' Jennifer ' })
      .then(value => {
        expect(value).to.equal('JENNIFER');
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can transform a value using getters', () => {
    const fakeNucleus = Nucleus(fakeArgs);
    return fakeNucleus.getter({ value: 'example', isotope: {} })
      .then(value => {
        expect(value).to.equal('EXAMPLE');
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can transform a value using setters', () => {
    const fakeNucleus = Nucleus(fakeArgs);
    return fakeNucleus.setter({ value: 'example', isotope: {} })
      .then(value => {
        expect(value).to.equal('EXAMPLE');
      }).catch((msg) => {
        throw new Error(msg);
      });
  });
});
