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
            SimpleValidator({ rules: ['min:3'] })
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
            SimpleValidator({ rules: ['min:3'] })
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
        expect(fakeIsotope.value).to.equal('johnny');
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

  it('can hydrate an isotope against a repeater set', () => {
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

  it('can use the find method on a container', () => {
    const fakeIsotope = Isotope({
      ...mockGroupParams
    });
    return fakeIsotope
      .hydrate()
      .then(() => {
        expect(fakeIsotope.find({ machine: 'first_name' })).to.not.be.undefined;
        expect(fakeIsotope.find({ machine: 'first_name' }).value).to.equal('Toby');
        expect(fakeIsotope.find({ machine: 'surname' })).to.not.be.undefined;
        expect(fakeIsotope.find({ machine: 'surname' }).value).to.equal('Smith');
        expect(fakeIsotope.find({ machine: 'secret' })).to.be.undefined;
        expect(fakeIsotope.find({ machine: 'notexists' })).to.be.undefined;
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can use the find method on a repeater', () => {
    const fakeIsotope = Isotope({
      ...mockCollectParams
    });
    return fakeIsotope
      .hydrate()
      .then(() => {
        expect(fakeIsotope.find({ machine: 'label' })).to.not.be.undefined;
        expect(fakeIsotope.find({ machine: 'label' }).value).to.equal('Home Address');
        expect(fakeIsotope.find({ machine: 'address' })).to.not.be.undefined;
        expect(fakeIsotope.find({ machine: 'address' }).value).to.equal('test1@example.com');
        expect(fakeIsotope.find({ machine: 'secret' })).to.be.undefined;
        expect(fakeIsotope.find({ machine: 'notexists' })).to.be.undefined;
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can use the filter method on a container', () => {
    const fakeIsotope = Isotope({
      ...mockGroupParams
    });
    return fakeIsotope
      .hydrate()
      .then(() => {
        expect(fakeIsotope.filter({ machine: 'first_name' })).to.have.length(1);
        expect(fakeIsotope.filter({ machine: 'first_name' })[0].value).to.equal('Toby');
        expect(fakeIsotope.filter({ machine: 'surname' })).to.have.length(1);
        expect(fakeIsotope.filter({ machine: 'surname' })[0].value).to.equal('Smith');
        expect(fakeIsotope.filter({ machine: 'secret' })).to.have.length(0);
        expect(fakeIsotope.filter({ machine: 'notexists' })).to.have.length(0);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can use the filter method on a collection', () => {
    const fakeIsotope = Isotope({
      ...mockCollectParams
    });
    return fakeIsotope
      .hydrate()
      .then(() => {
        expect(fakeIsotope.filter({ machine: 'label' })).to.have.length(2);
        expect(fakeIsotope.filter({ machine: 'label' })[0].value).to.equal('Home Address');
        expect(fakeIsotope.filter({ machine: 'address' })).to.have.length(2);
        expect(fakeIsotope.filter({ machine: 'address' })[0].value).to.equal('test1@example.com');
        expect(fakeIsotope.filter({ machine: 'secret' })).to.have.length(0);
        expect(fakeIsotope.filter({ machine: 'notexists' })).to.have.length(0);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can sanitize a simple isotope', () => {
    const fakeIsotope = Isotope({
      ...mockSingleParams,
      value: '  johNSton '
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.sanitize)
      .then(() => {
        assert.equal(fakeIsotope.value, 'JOHNSTON');
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can sanitize a container isotope', () => {
    const fakeIsotope = Isotope({
      ...mockGroupParams,
      value: {
        first_name: '  JessIca ',
        surname: ' Smitherson '
      }
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.sanitize)
      .then(() => {
        expect(fakeIsotope.find({ machine: 'first_name' }).value).to.equal('JESSICA');
        expect(fakeIsotope.find({ machine: 'surname' }).value).to.equal('SMITHERSON');
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can sanitize a repeater isotope', () => {
    const fakeIsotope = Isotope({
      ...mockCollectParams,
      value: [
        {
          label: 'Home Address',
          address: 'bill@example.com  '
        },
        {
          label: ' Work Address   ',
          address: '  john@example.com',
        }
      ]
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.sanitize)
      .then(() => {
        expect(fakeIsotope.filter({ machine: 'label' })[0].value).to.equal('HOME ADDRESS');
        expect(fakeIsotope.filter({ machine: 'address' })[0].value).to.equal('BILL@EXAMPLE.COM');
        expect(fakeIsotope.filter({ machine: 'label' })[1].value).to.equal('WORK ADDRESS');
        expect(fakeIsotope.filter({ machine: 'address' })[1].value).to.equal('JOHN@EXAMPLE.COM');
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can validate against a simple and PASS', () => {
    const fakeIsotope = Isotope({
      ...mockSingleParams
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.validate)
      .then(({ valid, messages, children }) => {
        assert.equal(valid, true);
        assert.deepEqual(messages, []);
        assert.deepEqual(children, []);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can validate against a simple and FAIL', () => {
    const fakeIsotope = Isotope({
      ...mockSingleParams,
      value: 'bill'
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.validate)
      .then(({ valid, messages, children }) => {
        assert.equal(valid, false);
        assert.deepEqual(messages, [ 'The value must be at least 5 characters.' ]);
        assert.deepEqual(children, []);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can validate against a container and PASS', () => {
    const fakeIsotope = Isotope({
      ...mockGroupParams
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.validate)
      .then(({ valid, messages, children }) => {
        expect(valid).to.equal(true);
        expect(messages).to.have.length(0);
        expect(children).to.have.length(1);
        expect(children[0].first_name.valid).to.equal(true);
        expect(children[0].surname.valid).to.equal(true);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can validate against a container and FAIL', () => {
    const fakeIsotope = Isotope({
      ...mockGroupParams,
      value: {
        first_name: 'Yi',
        surname: 'Gi',
        secret: 'notseethis'
      }
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.validate)
      .then(({ valid, messages, children }) => {
        expect(valid).to.equal(false);
        expect(messages).to.have.length(0);
        expect(children).to.have.length(1);
        expect(children[0].first_name.valid).to.equal(false);
        expect(children[0].first_name.messages).to.have.length(1);
        expect(children[0].surname.valid).to.equal(false);
        expect(children[0].surname.messages).to.have.length(1);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can validate against a repeater and PASS', () => {
    const fakeIsotope = Isotope({
      ...mockCollectParams
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.validate)
      .then(({ valid, messages, children }) => {
        expect(valid).to.equal(true);
        expect(messages).to.have.length(0);
        expect(children).to.have.length(2);
        expect(children[0].address.valid).to.equal(true);
        expect(children[0].label.valid).to.equal(true);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can validate against a repeater value and FAIL', () => {
    const fakeIsotope = Isotope({
      ...mockCollectParams,
      value: [
        {
          label: 'Fail',
          address: 'Fail',
          secret: 'notseethis'
        },
        {
          label: 'Fail',
          address: 'Fail',
          secret: 'notseethis'
        }
      ]
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.validate)
      .then(({ valid, messages, children }) => {
        expect(valid).to.equal(false);
        expect(messages).to.have.length(0);
        expect(children).to.have.length(2);
        expect(children[0].address.valid).to.equal(false);
        expect(children[0].address.messages).to.have.length(1);
        expect(children[0].label.valid).to.equal(false);
        expect(children[0].label.messages).to.have.length(1);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it('can generate a simple values object', () => {
    const fakeIsotope = Isotope({
      ...mockSingleParams
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.dump)
      .then(dumped => {
        expect(dumped).to.equal('JOHNNY');
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it.only('can generate a container values object', () => {
    const fakeIsotope = Isotope({
      ...mockGroupParams
    });
    return fakeIsotope
      .hydrate()
      .then(fakeIsotope.dump)
      .then(dumped => {
        console.log(dumped);
        expect(dumped).to.deep.equal({
          first_name: 'Toby',
          surname: 'Smith'
        });
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

});
