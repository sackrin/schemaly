import assert from 'assert';
import { expect } from 'chai';
import { Atom } from '../../Atom';
import Reactor from '../Reactor';
import { context, Nuclei, Nucleus } from '../../Nucleus';

describe('Reactor', () => {
  const fakeArgs = {
    atom: Atom({
      machine: 'person',
      label: 'Person Schema',
      scope: ['read', 'write'],
      roles: ['user', 'admin'],
      nuclei: Nuclei([
        Nucleus({
          type: context.STRING,
          label: 'Title',
          machine: 'title'
        }),
        Nucleus({
          type: context.STRING,
          label: 'First Name',
          machine: 'first_name'
        }),
        Nucleus({
          type: context.STRING,
          label: 'Surname',
          machine: 'surname'
        })
      ])
    }),
    roles: ['user', 'admin'],
    scope: ['read']
  };

  const fakeWithArgs = {
    values: {
      title: 'Mr',
      first_name: 'Johnny',
      surname: 'Worth',
    }
  };

  it('can create a reactor instance with an atom', () => {
    const fakeReactor = Reactor({ ...fakeArgs, testing: true });
    assert.equal(fakeReactor.atom, fakeArgs.atom);
    assert.equal(fakeReactor.roles, fakeArgs.roles);
    assert.equal(fakeReactor.scope, fakeArgs.scope);
    assert.equal(fakeReactor.options.testing, true);
  });

  it('can react with values to produce a hydrated set of isotopes', () => {
    const fakeReactor = Reactor({ ...fakeArgs });
    return fakeReactor.with({ ...fakeWithArgs })
      .then(isotopes => {
        expect(isotopes.find({ machine: 'title' })).to.not.be.undefined;
        expect(isotopes.find({ machine: 'first_name' })).to.not.be.undefined;
        expect(isotopes.find({ machine: 'surname' })).to.not.be.undefined;
      }).catch((msg) => {
        throw new Error(msg);
      });
  });
});
