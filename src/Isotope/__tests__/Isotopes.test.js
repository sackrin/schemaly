import { expect } from 'chai';
import { NucleusGroup } from '../../Nucleus';
import { Isotopes } from '../';
import { Reactor } from '../../Reactor';

describe.only('Isotopes', () => {
  const fakeArgs = {
    reactor: Reactor({}),
    nuclei: NucleusGroup({}),
    roles: ['user', 'admin'],
    scope: ['r'],
    test: true
  };

  it('can create an Isotopes group with standard arguments', () => {
    const fakeIsotopes = Isotopes({ ...fakeArgs });
    expect(fakeIsotopes.reactor).to.deep.equal(fakeArgs.reactor);
    expect(fakeIsotopes.nuclei).to.deep.equal(fakeArgs.nuclei);
    expect(fakeIsotopes.roles).to.deep.equal(fakeArgs.roles);
    expect(fakeIsotopes.scope).to.deep.equal(fakeArgs.scope);
    expect(fakeIsotopes.options).to.deep.equal({ test: true });
  });
});
