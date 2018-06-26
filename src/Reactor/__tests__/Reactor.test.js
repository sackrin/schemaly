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
        Nucleus({ type: context.STRING, label: 'title' }),
        Nucleus({ type: context.STRING, label: 'first_name' }),
        Nucleus({ type: context.STRING, label: 'surname' })
      ])
    }),
    roles: ['user', 'admin'],
    scope: ['read']
  };

  const fakeValues = {
    firstName: 'Johnny',
    lastName: 'Worth',
    emails: [
      {
        primary: false,
        address: 'johnny.worth@example.com'
      },
      {
        primary: false,
        address: 'johnny.worth@example.com'
      }
    ]
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
    return fakeReactor.with({ ...fakeValues })
      .then(isotopes => {
        // console.log(isotopes);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can throw an exception if roles are provided that are not in the provided Atom', () => {
    const fakeReactor = Reactor({ ...fakeArgs, roles: ['user', 'guest'] });
    return fakeReactor.with({ ...fakeValues })
      .then(() => {
        throw new Error('should not have reached here');
      }).catch((error) => {
        expect(error.message).to.equal('REACTOR_INVALID_ROLES');
      });
  });

  it('can throw an exception if scope are provided that are not in the provided Atom', () => {
    const fakeReactor = Reactor({ ...fakeArgs, scope: ['update'] });
    return fakeReactor.with({ ...fakeValues })
      .then(() => {
        throw new Error('should not have reached here');
      }).catch((error) => {
        expect(error.message).to.equal('REACTOR_INVALID_SCOPE');
      });
  });
});
