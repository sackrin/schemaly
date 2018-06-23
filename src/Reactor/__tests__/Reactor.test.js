import assert from 'assert';
import { Atom } from '../../Atom';
import Reactor from '../Reactor';

describe('Reactor', () => {

  const fakeArgs = {
    atom: Atom({}),
    roles: ['user', 'admin'],
    scope: ['r']
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
        console.log(isotopes);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });
});
