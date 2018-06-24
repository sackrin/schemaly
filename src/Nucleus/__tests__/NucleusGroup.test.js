import assert from 'assert';
import { expect } from 'chai';
import Nucleus from '../Nucleus';
import NucleusGroup from '../NucleusGroup';

describe('Nucleus Group', () => {

  const fakeArgs = {
    parent: Nucleus({ label: 'profile' }),
    nuclei: [
      Nucleus({ label: 'first_name' }),
      Nucleus({ label: 'surname' }),
      Nucleus({ label: 'title' })
    ]
  };

  it('can create a simple nucleus group', () => {
    const nucleusGroup = NucleusGroup({ ...fakeArgs, testing: true });
    assert.equal(nucleusGroup.nuclei, fakeArgs.nuclei);
    assert.equal(nucleusGroup.parent, fakeArgs.parent);
    assert.equal(nucleusGroup.options.testing, true);
  });

  it('can retrieve all nuclei using the all() shortcut', () => {
    const nucleusGroup = NucleusGroup({ ...fakeArgs });
    expect(nucleusGroup.all()).to.deep.equal(fakeArgs.nuclei);
  });
});
