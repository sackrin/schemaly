import { expect } from 'chai';
import { Nucleus, Nuclei, context } from '../../Nucleus';
import { Isotopes } from '../';
import { Reactor } from '../../Reactor';
import { Atom } from '../../Atom';
import { GrantSinglePolicy, DenyPolicy, AllowPolicy } from '../../Policy';
import { Validators, SimpleValidator } from '../../Validate';

describe('Isotopes', () => {
  const fakeArgs = {
    reactor: Reactor({
      atom: Atom({}),
      roles: ['user', 'admin'],
      scope: ['r', 'w']
    }),
    values: {
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
    }
  };

  it('can create an Isotopes group with standard arguments', () => {
    const fakeIsotopes = Isotopes({ ...fakeArgs, test: true });
    expect(fakeIsotopes.reactor).to.deep.equal(fakeArgs.reactor);
    expect(fakeIsotopes.options).to.deep.equal({ test: true });
  });

  it('can hydrate against a set of nuclei, provided values and generate isotopes', () => {
    const fakeIsotopes = Isotopes({
      ...fakeArgs,
      nuclei: Nuclei([
        Nucleus({ type: context.STRING, machine: 'first_name', label: 'First Name' }),
        Nucleus({ type: context.STRING, machine: 'last_name', label: 'Last Name' }),
        Nucleus({
          type: context.CONTAINER,
          machine: 'company',
          label: 'Company',
          nuclei: Nuclei([
            Nucleus({ type: context.STRING, machine: 'name', label: 'Company Name' })
          ])
        }),
        Nucleus({
          type: context.COLLECTION,
          machine: 'emails',
          label: 'Emails',
          nuclei: Nuclei([
            Nucleus({ type: context.STRING, machine: 'label', label: 'Label' }),
            Nucleus({ type: context.STRING, machine: 'address', label: 'Address' })
          ])
        })
      ])
    });
    return fakeIsotopes.hydrate()
      .then(() => {
        expect(fakeIsotopes.find({ machine: 'first_name' })).to.not.be.undefined;
        expect(fakeIsotopes.find({ machine: 'last_name' })).to.not.be.undefined;
        expect(fakeIsotopes.find({ machine: 'company' }).find({ machine: 'name' })).to.not.be.undefined;
        expect(fakeIsotopes.find({ machine: 'emails' }).find({ machine: 'address' })).to.not.be.undefined;
        expect(fakeIsotopes.find({ machine: 'emails' }).filter({ machine: 'address' })).to.have.length(2);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can throw an exception when a child bearing nucleus has no children', () => {
    const fakeIsotopes = Isotopes({
      ...fakeArgs,
      nuclei: Nuclei([
        Nucleus({ type: context.STRING, machine: 'first_name', label: 'First Name' }),
        Nucleus({ type: context.STRING, machine: 'last_name', label: 'Last Name' }),
        Nucleus({
          type: context.CONTAINER,
          machine: 'company',
          label: 'Company'
        })
      ])
    });
    return fakeIsotopes.hydrate()
      .then(() => {
        throw new Error('should not have reached here');
      }).catch(error => {
        expect(error.message).to.equal('NUCLEUS_EXPECTS_CHILDREN');
      });
  });

  it('can not create isotopes for nuclei failing policy checks', () => {
    const fakeIsotopes = Isotopes({
      ...fakeArgs,
      nuclei: Nuclei([
        Nucleus({
          type: context.STRING,
          machine: 'first_name',
          label: 'First Name',
          policies: GrantSinglePolicy([
            DenyPolicy({ roles: ['*'], scope: ['r', 'w'] }),
            AllowPolicy({ roles: ['user'], scope: ['r', 'w'] })
          ])
        }),
        Nucleus({ type: context.STRING,
          machine: 'last_name',
          label: 'Last Name',
          policies: GrantSinglePolicy([
            DenyPolicy({ roles: ['*'], scope: ['r', 'w'] }),
            AllowPolicy({ roles: ['owner'], scope: ['r', 'w'] })
          ])
        }),
        Nucleus({
          type: context.CONTAINER,
          machine: 'company',
          label: 'Company',
          nuclei: Nuclei([
            Nucleus({ type: context.STRING, machine: 'name', label: 'Company Name' })
          ]),
          policies: GrantSinglePolicy([
            DenyPolicy({ roles: ['*'], scope: ['r', 'w'] }),
            AllowPolicy({ roles: ['owner'], scope: ['r', 'w'] })
          ])
        }),
        Nucleus({
          type: context.COLLECTION,
          machine: 'emails',
          label: 'Emails',
          nuclei: Nuclei([
            Nucleus({
              type: context.STRING,
              machine: 'label',
              label: 'Label',
              policies: GrantSinglePolicy([
                DenyPolicy({ roles: ['*'], scope: ['r', 'w'] }),
                AllowPolicy({ roles: ['user'], scope: ['r', 'w'] })
              ])
            }),
            Nucleus({
              type: context.STRING,
              machine: 'address',
              label: 'Address',
              policies: GrantSinglePolicy([
                DenyPolicy({ roles: ['*'], scope: ['r', 'w'] }),
                AllowPolicy({ roles: ['owner'], scope: ['r', 'w'] })
              ])
            })
          ]),
          policies: GrantSinglePolicy([
            DenyPolicy({ roles: ['*'], scope: ['r', 'w'] }),
            AllowPolicy({ roles: ['user'], scope: ['r', 'w'] })
          ])
        })
      ])
    });
    return fakeIsotopes.hydrate()
      .then(() => {
        expect(fakeIsotopes.find({ machine: 'first_name' })).to.not.be.undefined;
        expect(fakeIsotopes.find({ machine: 'last_name' })).to.be.undefined;
        expect(fakeIsotopes.find({ machine: 'company' })).to.be.undefined;
        expect(fakeIsotopes.find({ machine: 'emails' })).to.not.be.undefined;
        expect(fakeIsotopes.find({ machine: 'emails' }).filter({ machine: 'label' })).to.have.length(2);
        expect(fakeIsotopes.find({ machine: 'emails' }).filter({ machine: 'address' })).to.have.length(0);
        expect(fakeIsotopes.isotopes).to.have.length(2);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can perform validation against hydrated isotopes and PASS', () => {
    const fakeIsotopes = Isotopes({
      ...fakeArgs,
      nuclei: Nuclei([
        Nucleus({
          type: context.STRING,
          machine: 'first_name',
          label: 'First Name',
          validators: Validators([
            SimpleValidator({ rules: ['required', 'min:5'] })
          ])
        }),
        Nucleus({
          type: context.STRING,
          machine: 'last_name',
          label: 'Last Name',
          validators: Validators([
            SimpleValidator({ rules: ['required', 'min:5'] })
          ])
        }),
        Nucleus({
          type: context.CONTAINER,
          machine: 'company',
          label: 'Company',
          nuclei: Nuclei([
            Nucleus({
              type: context.STRING,
              machine: 'name',
              label: 'Company Name',
              validators: Validators([
                SimpleValidator({ rules: ['required', 'min:5'] })
              ])
            })
          ])
        }),
        Nucleus({
          type: context.COLLECTION,
          machine: 'emails',
          label: 'Emails',
          nuclei: Nuclei([
            Nucleus({
              type: context.STRING,
              machine: 'label',
              label: 'Label',
              validators: Validators([
                SimpleValidator({ rules: ['required', 'min:5'] })
              ])
            }),
            Nucleus({
              type: context.STRING,
              machine: 'address',
              label: 'Address',
              validators: Validators([
                SimpleValidator({ rules: ['required', 'min:5'] })
              ])
            })
          ])
        })
      ])
    });
    return fakeIsotopes
      .hydrate()
      .then(fakeIsotopes.validate)
      .then(result => {
        expect(result.first_name.valid).to.equal(true);
        expect(result.last_name.valid).to.equal(true);
        expect(result.company.valid).to.equal(true);
        expect(result.company.children[0].name.valid).to.equal(true);
        expect(result.emails.valid).to.equal(true);
        expect(result.emails.children[0].label.valid).to.equal(true);
        expect(result.emails.children[0].address.valid).to.equal(true);
        expect(result.emails.children[1].label.valid).to.equal(true);
        expect(result.emails.children[1].address.valid).to.equal(true);
      });
  });

  it('can perform validation against hydrated isotopes and FAIL', () => {
    const fakeIsotopes = Isotopes({
      ...fakeArgs,
      nuclei: Nuclei([
        Nucleus({
          type: context.STRING,
          machine: 'first_name',
          label: 'First Name',
          validators: Validators([
            SimpleValidator({ rules: ['required', 'min:5'] })
          ])
        }),
        Nucleus({
          type: context.STRING,
          machine: 'last_name',
          label: 'Last Name',
          validators: Validators([
            SimpleValidator({ rules: ['required', 'min:5'] })
          ])
        }),
        Nucleus({
          type: context.CONTAINER,
          machine: 'company',
          label: 'Company',
          nuclei: Nuclei([
            Nucleus({
              type: context.STRING,
              machine: 'name',
              label: 'Company Name',
              validators: Validators([
                SimpleValidator({ rules: ['required', 'min:25'] })
              ])
            })
          ])
        }),
        Nucleus({
          type: context.COLLECTION,
          machine: 'emails',
          label: 'Emails',
          nuclei: Nuclei([
            Nucleus({
              type: context.STRING,
              machine: 'label',
              label: 'Label',
              validators: Validators([
                SimpleValidator({ rules: ['required', 'min:5'] })
              ])
            }),
            Nucleus({
              type: context.STRING,
              machine: 'address',
              label: 'Address',
              validators: Validators([
                SimpleValidator({ rules: ['required', 'min:25'] })
              ])
            })
          ])
        })
      ])
    });
    return fakeIsotopes
      .hydrate()
      .then(fakeIsotopes.validate)
      .then(result => {
        expect(result.first_name.valid).to.equal(true);
        expect(result.last_name.valid).to.equal(true);
        expect(result.company.valid).to.equal(false);
        expect(result.company.children[0].name.valid).to.equal(false);
        expect(result.emails.valid).to.equal(false);
        expect(result.emails.children[0].label.valid).to.equal(true);
        expect(result.emails.children[0].address.valid).to.equal(false);
        expect(result.emails.children[1].label.valid).to.equal(true);
        expect(result.emails.children[1].address.valid).to.equal(false);
      });
  });

  it('can generate a value object with policies');
});
