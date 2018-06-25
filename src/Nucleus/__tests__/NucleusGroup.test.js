import assert from 'assert';
import { expect } from 'chai';
import Nucleus from '../Nucleus';
import NucleusGroup from '../NucleusGroup';

describe('Nucleus Group', () => {
  const fakeNuclei = [
    Nucleus({ label: 'first_name' }),
    Nucleus({ label: 'surname' }),
    Nucleus({ label: 'title' })
  ];

  const fakeOptions = {
    parent: Nucleus({ label: 'profile' })
  };

  it('can create a simple nucleus group', () => {
    const nucleusGroup = NucleusGroup(fakeNuclei, { ...fakeOptions, testing: true });
    assert.equal(nucleusGroup.nuclei, fakeNuclei);
    assert.equal(nucleusGroup.parent, fakeOptions.parent);
    assert.equal(nucleusGroup.options.testing, true);
  });

  it('can retrieve all nuclei using the all() shortcut', () => {
    const nucleusGroup = NucleusGroup(fakeNuclei);
    expect(nucleusGroup.all()).to.deep.equal(fakeNuclei);
  });
});
