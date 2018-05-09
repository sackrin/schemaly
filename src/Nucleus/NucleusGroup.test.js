import assert from 'assert';
import { Nucleus } from './Nucleus';
import { NucleusGroup } from './NucleusGroup';

describe('Nucleus Group', () => {
  it('can create a simple nucleus group', () => {
    const nucleusOne = new Nucleus({ label: 'first_name' });
    const nucleusTwo = new Nucleus({ label: 'surname' });
    const nucleusThree = new Nucleus({ label: 'title' });
    const nucleusList = [nucleusOne, nucleusTwo, nucleusThree];
    const nucleusGroup = new NucleusGroup(nucleusList);
    assert.equal(nucleusGroup.nuclei, nucleusList);
  });
});
