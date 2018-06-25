import { expect } from 'chai';
import { Nucleus, NucleusGroup, context } from '../../Nucleus';
import { Isotopes } from '../';
import { Reactor } from '../../Reactor';
import { Atom } from '../../Atom';

describe('Isotopes', () => {
  const fakeArgs = {
    reactor: Reactor({
      atom: Atom({}),
      roles: ['user', 'admin'],
      scope: ['r', 'w']
    }),
    roles: ['user', 'admin'],
    scope: ['r'],
    nuclei: NucleusGroup([
      Nucleus({ type: context.STRING, machine: 'first_name', label: 'First Name' }),
      Nucleus({ type: context.STRING, machine: 'last_name', label: 'Last Name' }),
      Nucleus({
        type: context.CONTAINER,
        machine: 'company',
        label: 'Company',
        nuclei: NucleusGroup([
          Nucleus({ type: context.STRING, machine: 'name', label: 'Company Name' })
        ])
      }),
      Nucleus({
        type: context.COLLECTION,
        machine: 'emails',
        label: 'Emails',
        nuclei: NucleusGroup([
          Nucleus({ type: context.STRING, machine: 'label', label: 'Label' }),
          Nucleus({ type: context.STRING, machine: 'address', label: 'Address' })
        ])
      })
    ])
  };

  const fakeValues = {
    first_name: 'Thomas',
    last_name: 'Tank Engine',
    company: {
      name: 'Acme Company',
      address: '1 Engine Road'
    },
    emails: [
      {
        label: 'Home Email',
        address: 'example@home.com'
      },
      {
        label: 'Work Email',
        address: 'example@work.com'
      }
    ]
  };

  it('can create an Isotopes group with standard arguments', () => {
    const fakeIsotopes = Isotopes({ ...fakeArgs, test: true });
    expect(fakeIsotopes.reactor).to.deep.equal(fakeArgs.reactor);
    expect(fakeIsotopes.nuclei).to.deep.equal(fakeArgs.nuclei);
    expect(fakeIsotopes.roles).to.deep.equal(fakeArgs.roles);
    expect(fakeIsotopes.scope).to.deep.equal(fakeArgs.scope);
    expect(fakeIsotopes.options).to.deep.equal({ test: true });
  });

  it('can hydrate against a set of nuclei, provided values and generate isotopes', () => {
    const fakeIsotopes = Isotopes({ ...fakeArgs });
    return fakeIsotopes.hydrate({ values: fakeValues })
      .then(() => {
        expect(fakeIsotopes.find({ machine: 'first_name' })).to.not.be.undefined;
        expect(fakeIsotopes.find({ machine: 'last_name' })).to.not.be.undefined;
        expect(fakeIsotopes.find({ machine: 'company' })).to.not.be.undefined;
        expect(fakeIsotopes.find({ machine: 'company' }).isotopes.find({ machine: 'name' })).to.not.be.undefined;
        expect(fakeIsotopes.find({ machine: 'company' }).isotopes.find({ machine: 'address' })).to.be.undefined;
        expect(fakeIsotopes.find({ machine: 'emails' })).to.not.be.undefined;
        expect(fakeIsotopes.isotopes).to.have.length(4);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can throw an exception when a child bearing nucleus has no children');
});
