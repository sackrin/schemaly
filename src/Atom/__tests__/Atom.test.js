import assert from 'assert';
import Atom from '../Atom';
import { Nucleus, Nuclei, context } from '../../Nucleus';

describe('Atom', () => {
  const fakeArgs = {
    machine: 'person',
    label: 'Person Schema',
    scope: ['read', 'write'],
    roles: ['user', 'guest'],
    nuclei: Nuclei([
      Nucleus({ type: context.STRING, label: 'title' }),
      Nucleus({ type: context.STRING, label: 'first_name' }),
      Nucleus({ type: context.STRING, label: 'surname' })
    ])
  };

  it('can create an atom instance', () => {
    const fakeAtom = Atom({
      ...fakeArgs,
      testing: true
    });
    assert.equal(fakeAtom.config.label, 'Person Schema');
    assert.equal(fakeAtom.config.machine, 'person');
    assert.equal(fakeAtom.nuclei, fakeArgs.nuclei);
    assert.equal(fakeAtom.roles, fakeArgs.roles);
    assert.equal(fakeAtom.scope, fakeArgs.scope);
    assert.equal(fakeAtom.options.testing, true);
  });
});
