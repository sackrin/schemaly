import assert from 'assert';
import Nucleus from '../Nucleus';
import NucleusGroup from '../NucleusGroup';

describe('Nucleus Group', () => {
  it('can create a simple nucleus group', () => {
    const nucleusParent = Nucleus({ label: 'profile' });
    const nucleusOne = Nucleus({ label: 'first_name' });
    const nucleusTwo = Nucleus({ label: 'surname' });
    const nucleusThree = Nucleus({ label: 'title' });
    const nucleusList = [nucleusOne, nucleusTwo, nucleusThree];
    const nucleusGroup = NucleusGroup({ nuclei: nucleusList, parent: nucleusParent, testing: true });
    assert.equal(nucleusGroup.nuclei, nucleusList);
    assert.equal(nucleusGroup.parent, nucleusParent);
    assert.equal(nucleusGroup.options.testing, true);
  });
});
