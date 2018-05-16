import assert from 'assert';
import { Atom } from '../Atom';
import { Nucleus, NucleusGroup, context } from '../../Nucleus/index';

describe('Atom', () => {
  const mockNucleusGroup = new NucleusGroup({ nuclei: [
    new Nucleus({ type: context.STRING, label: 'title' }),
    new Nucleus({ type: context.STRING, label: 'first_name' }),
    new Nucleus({ type: context.STRING, label: 'surname' })
  ] });

  it('can create an atom instance', () => {
    const atom = new Atom({
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
