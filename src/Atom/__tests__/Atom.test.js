import assert from 'assert';
import Atom from '../Atom';
import { Nucleus, NucleusGroup, context } from '../../Nucleus';

describe('Atom', () => {
  const mockNucleusGroup = new NucleusGroup([
    Nucleus({ type: context.STRING, label: 'title' }),
    Nucleus({ type: context.STRING, label: 'first_name' }),
    Nucleus({ type: context.STRING, label: 'surname' })
  ]);

  it('can create an atom instance', () => {
    const atom = Atom({
      machine: 'person',
      label: 'Person Schema',
      nuclei: mockNucleusGroup,
      testing: true
    });
    assert.equal(atom.config.label, 'Person Schema');
    assert.equal(atom.config.machine, 'person');
    assert.equal(atom.nuclei, mockNucleusGroup);
    assert.equal(atom.options.testing, true);
  });
});
