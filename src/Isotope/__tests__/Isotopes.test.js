import { expect } from 'chai';
import { Nucleus, NucleusGroup, context } from '../../Nucleus';
import { Isotopes } from '../';
import { Reactor } from '../../Reactor';

describe.only('Isotopes', () => {
  const fakeArgs = {
    reactor: Reactor({}),
    nuclei: NucleusGroup({
      nuclei: [
        Nucleus({ type: context.STRING, machine: 'first_name', label: 'First Name' }),
        Nucleus({ type: context.STRING, machine: 'last_name', label: 'Last Name' })
      ]
    }),
    roles: ['user', 'admin'],
    scope: ['r'],
    test: true
  };

  const fakeValues = {
    first_name: 'Thomas',
    last_name: 'Tank Engine'
  };

  it('can create an Isotopes group with standard arguments', () => {
    const fakeIsotopes = Isotopes({ ...fakeArgs });
    expect(fakeIsotopes.reactor).to.deep.equal(fakeArgs.reactor);
    expect(fakeIsotopes.nuclei).to.deep.equal(fakeArgs.nuclei);
    expect(fakeIsotopes.roles).to.deep.equal(fakeArgs.roles);
    expect(fakeIsotopes.scope).to.deep.equal(fakeArgs.scope);
    expect(fakeIsotopes.options).to.deep.equal({ test: true });
  });

  it('can hydrate against provided values and generate isotopes', () => {
    const fakeIsotopes = Isotopes({ ...fakeArgs });
    return fakeIsotopes.hydrate({ values: fakeValues })
      .then(hydrated => {
        expect(fakeIsotopes.isotopes).to.have.length(2);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });
});
