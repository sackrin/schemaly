import assert from 'assert';
import { expect } from 'chai';
import Nucleus from '../Nucleus';
import Nuclei from '../Nuclei';

describe('Nuclei', () => {
  const fakeNucleiGroup = [
    Nucleus({ label: 'first_name' }),
    Nucleus({ label: 'surname' }),
    Nucleus({ label: 'title' })
  ];

  const fakeOptions = {
    parent: Nucleus({ label: 'profile' })
  };

  it('can create a simple nucleus group', () => {
    const fakeNuclei = Nuclei(fakeNucleiGroup, { ...fakeOptions, testing: true });
    assert.equal(fakeNuclei.nuclei, fakeNucleiGroup);
    assert.equal(fakeNuclei.parent, fakeOptions.parent);
    assert.equal(fakeNuclei.options.testing, true);
  });

  it('can retrieve all nuclei using the all() shortcut', () => {
    const fakeNuclei = Nuclei(fakeNucleiGroup);
    expect(fakeNuclei.all()).to.deep.equal(fakeNucleiGroup);
  });
});
