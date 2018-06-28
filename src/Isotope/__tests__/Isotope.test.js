import assert from 'assert';
import { expect } from 'chai';
import { SimpleValidator, Validators } from '../../Validate';
import { AllowPolicy, DenyPolicy, GrantSinglePolicy } from '../../Policy';
import { Sanitizers, SimpleSanitizer } from '../../Sanitize';
import { Nucleus, context, Nuclei } from '../../Nucleus';
import Isotope from '../Isotope';
import { Reactor } from '../../Reactor';

describe.only('Isotope', () => {
  const mockSingleParams = {
    reactor: Reactor({
      scope: ['read'],
      roles: ['user']
    }),
    nucleus: Nucleus({
      type: context.STRING,
      machine: 'first_name',
      label: 'First Name',
      policies: GrantSinglePolicy([
        DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
        AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] })
      ]),
      sanitizers: Sanitizers([
        SimpleSanitizer({ rules: ['trim'] }),
        SimpleSanitizer({ rules: ['upper_case'] })
      ]),
      validators: Validators([
        SimpleValidator({ rules: ['required'] }),
        SimpleValidator({ rules: ['min:5'] })
      ]),
      setters: [
        ({ isotope, value }) => (value.toString().toUpperCase())
      ],
      getters: [
        ({ isotope, value }) => (value.toString().toUpperCase())
      ],
      test: true
    }),
    value: 'johnny'
  };

  const mockGroupParams = {
    reactor: Reactor({
      scope: ['read'],
      roles: ['user']
    }),
    nucleus: Nucleus({
      type: context.CONTAINER,
      machine: 'profile',
      label: 'Profile',
      policies: GrantSinglePolicy([
        DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
        AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] })
      ]),
      nuclei: Nuclei([
        Nucleus({
          type: context.STRING,
          machine: 'first_name',
          label: 'First Name',
          policies: GrantSinglePolicy([
            DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
            AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] })
          ]),
          sanitizers: Sanitizers([
            SimpleSanitizer({ rules: ['trim'] }),
            SimpleSanitizer({ rules: ['upper_case'] })
          ]),
          validators: Validators([
            SimpleValidator({ rules: ['required'] }),
            SimpleValidator({ rules: ['min:5'] })
          ])
        }),
        Nucleus({
          type: context.STRING,
          machine: 'surname',
          label: 'Surname',
          policies: GrantSinglePolicy([
            DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
            AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] })
          ]),
          sanitizers: Sanitizers([
            SimpleSanitizer({ rules: ['trim'] }),
            SimpleSanitizer({ rules: ['upper_case'] })
          ]),
          validators: Validators([
            SimpleValidator({ rules: ['required'] }),
            SimpleValidator({ rules: ['min:5'] })
          ])
        }),
        Nucleus({
          type: context.STRING,
          machine: 'secret',
          label: 'Admin Notes',
          policies: GrantSinglePolicy([
            DenyPolicy({ roles: ['*'], scope: ['*'] }),
            AllowPolicy({ roles: ['admin'], scope: ['*'] })
          ])
        })
      ]),
      test: true
    }),
    value: {
      first_name: 'Toby',
      surname: 'Smith',
      secret: 'notseethis'
    }
  };

  const mockCollectParams = {
    reactor: Reactor({
      scope: ['read'],
      roles: ['user']
    }),
    nucleus: Nucleus({
      type: context.COLLECTION,
      machine: 'emails',
      label: 'Emails',
      policies: GrantSinglePolicy([
        DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
        AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] })
      ]),
      nuclei: Nuclei([
        Nucleus({
          type: context.STRING,
          machine: 'label',
          label: 'Label',
          policies: GrantSinglePolicy([
            DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
            AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] })
          ]),
          sanitizers: Sanitizers([
            SimpleSanitizer({ rules: ['trim'] }),
            SimpleSanitizer({ rules: ['upper_case'] })
          ]),
          validators: Validators([
            SimpleValidator({ rules: ['required'] }),
            SimpleValidator({ rules: ['min:5'] })
          ])
        }),
        Nucleus({
          type: context.STRING,
          machine: 'address',
          label: 'Address',
          policies: GrantSinglePolicy([
            DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
            AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] })
          ]),
          sanitizers: Sanitizers([
            SimpleSanitizer({ rules: ['trim'] }),
            SimpleSanitizer({ rules: ['upper_case'] })
          ]),
          validators: Validators([
            SimpleValidator({ rules: ['required'] }),
            SimpleValidator({ rules: ['min:5'] })
          ])
        }),
        Nucleus({
          type: context.STRING,
          machine: 'secret',
          label: 'Admin Notes',
          policies: GrantSinglePolicy([
            DenyPolicy({ roles: ['*'], scope: ['*'] }),
            AllowPolicy({ roles: ['admin'], scope: ['*'] })
          ])
        })
      ])
    }),
    value: [
      {
        label: 'Home Address',
        address: 'test1@example.com',
        secret: 'notseethis'
      },
      {
        label: 'Home Address',
        address: 'test1@example.com',
        secret: 'notseethis'
      }
    ]
  };

  it('can create an isotope instance from a nucleus', () => {
    const isotope = Isotope({ ...mockSingleParams, testing: true });
    assert.equal(isotope.reactor, mockSingleParams.reactor);
    assert.equal(isotope.nucleus, mockSingleParams.nucleus);
    assert.equal(isotope.value, 'johnny');
    assert.equal(isotope.options.testing, true);
  });

  it('can use getters to retrieve a correctly formatted nucleus value', () => {
    const fakeIsotope = Isotope({
      ...mockSingleParams
    });
    return fakeIsotope.getValue()
      .then(value => {
        expect(fakeIsotope.value).to.equal('johnny');
        expect(value).to.equal('JOHNNY');
      });
  });

  it('can create an isotope with no value setters', () => {
    const fakeIsotope = Isotope({
      ...mockSingleParams
    });
    return fakeIsotope.setValue({ value: 'richard' })
      .then(value => {
        expect(value).to.equal('RICHARD');
        expect(fakeIsotope.value).to.equal('RICHARD');
      });
  });

  it('can hydrate an isotope against a single value set', () => {
    const fakeIsotope = Isotope({
      ...mockSingleParams
    });
    return fakeIsotope
      .hydrate()
      .then(() => {
        expect(fakeIsotope.value).to.equal('JOHNNY');
      });
  });

  it('can hydrate an isotope against a container set', () => {
    const fakeIsotope = Isotope({
      ...mockGroupParams
    });
    return fakeIsotope
      .hydrate()
      .then(() => {
        expect(fakeIsotope.find({ machine: 'secret' })).to.be.undefined;
        expect(fakeIsotope.find({ machine: 'first_name' }).value).to.equal('Toby');
        expect(fakeIsotope.find({ machine: 'surname' }).value).to.equal('Smith');
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can hydrate an isotope against a collection set', () => {
    const fakeIsotope = Isotope({
      ...mockCollectParams
    });
    return fakeIsotope
      .hydrate()
      .then(() => {
        expect(fakeIsotope.filter({ machine: 'label' })).to.have.length(2);
        expect(fakeIsotope.filter({ machine: 'address' })).to.have.length(2);
        expect(fakeIsotope.filter({ machine: 'secret' })).to.have.length(0);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it.only('can validate against a simple value and pass', () => {
    const fakeIsotope = Isotope({
      ...mockSingleParams
    });
    return fakeIsotope.validate()
      .then(({ result, messages }) => {
        assert.equal(result, true);
        assert.deepEqual(messages, []);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can validate against a simple value and pass', () => {
    const fakeIsotope = Isotope({
      ...mockSingleParams
    });
    return fakeIsotope.validate()
      .then(({ result, messages }) => {
        assert.equal(result, true);
        assert.deepEqual(messages, []);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can validate against a simple value and fail', () => {
    const fakeIsotope = Isotope({
      ...mockSingleParams,
      value: 'John'
    });
    return fakeIsotope.validate()
      .then(({ result, messages }) => {
        assert.equal(result, false);
        assert.deepEqual(messages, [ 'The value must be at least 5 characters.' ]);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can apply sanitizers to its value and produce a new value', () => {
    const fakeIsotope = Isotope({
      ...mockSingleParams,
      value: ' Johnny '
    });
    return fakeIsotope.sanitize()
      .then(() => {
        assert.equal(fakeIsotope.value, 'JOHNNY');
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can use the find method to find the first child isotope matching the criteria');

  it('can use the filter method to find all of the children isotopes matching the criteria');
});
