import assert from 'assert';
import { Atom } from '../../Atom';
import Reactor from '../Reactor';

describe('Reactor', () => {
  const mockAtom = Atom({});

  const mockSimpleRoles = ['user', 'admin'];

  const mockSimpleScope = ['r'];

  it('can create a reactor instance with an atom', () => {
    const reactor = Reactor({ atom: mockAtom, roles: mockSimpleRoles, scope: mockSimpleScope, testing: true });
    assert.equal(reactor.atom, mockAtom);
    assert.equal(reactor.roles, mockSimpleRoles);
    assert.equal(reactor.scope, mockSimpleScope);
    assert.equal(reactor.options.testing, true);
  });
});
