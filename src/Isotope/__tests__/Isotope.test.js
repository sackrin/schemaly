import assert from 'assert';
import { SimpleValidator, Validators } from '../../Validate';
import { AllowPolicy, DenyPolicy, GrantSinglePolicy } from '../../Policy';
import { Sanitizers, SimpleSanitizer } from '../../Sanitize';
import { Nucleus, context } from '../../Nucleus';
import { Isotope } from '../Isotope';
import { Reactor } from '../../Reactor/Reactor';

describe.only('Isotope', () => {
  ///
  const mockReactor = new Reactor({});

  const mockPolicies = ;

  const mockSanitisers = new Sanitizers({ filters: [
    new SimpleSanitizer({ rules: ['trim'] }),
    new SimpleSanitizer({ rules: ['upper_case'] })
  ] });

  const mockValidators = new Validators({ validators: [
    new SimpleValidator({ rules: ['required'] }),
    new SimpleValidator({ rules: ['min:5'] })
  ] });

  const mockSimpleGetters = [
    ({ isotope, value }) => (value.toString().toUpperCase())
  ];

  const mockSimpleSetters = [
    ({ isotope, value }) => (value.toString().toUpperCase())
  ];

  ///
  const mockSimpleNucleus = new Nucleus({
    type: context.STRING,
    machine: 'first_name',
    label: 'First Name',
    policies: mockPolicies,
    sanitizers: mockSanitisers,
    validators: mockValidators,
    test: true
  });

  const mockParams = {
    reactor: new Reactor({}),
    nucleus: new Nucleus({
      type: context.STRING,
      machine: 'first_name',
      label: 'First Name',
      policies: new GrantSinglePolicy({
        policies: [
          new DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
          new AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] })
        ]
      }),
      sanitizers: mockSanitisers,
      validators: mockValidators,
      test: true
    }),
    value: 'johnny',
    testing: true
  };

  it('can create an isotope instance from a nucleus', () => {
    const isotope = new Isotope({
      reactor: mockReactor,
      nucleus: mockSimpleNucleus,
      value: 'johnny',
      testing: true
    });
    assert.equal(isotope.reactor, mockReactor);
    assert.equal(isotope.nucleus, mockSimpleNucleus);
    assert.equal(isotope.value, 'johnny');
    assert.equal(isotope.options.testing, true);
  });

  it('can create an isotope with no value getters', () => {
    const isotope = new Isotope({
      reactor: mockReactor,
      nucleus: mockSimpleNucleus,
      value: 'johnny',
      getters: []
    });
    return isotope.getValue()
      .then(value => {
        assert.equal(isotope.value, 'johnny');
        assert.equal(value, 'johnny');
      });
  });

  it('can create an isotope with no value setters', () => {
    const isotope = new Isotope({
      reactor: mockReactor,
      nucleus: mockSimpleNucleus,
      value: 'john',
      setters: []
    });
    return isotope.setValue({ value: 'richard' })
      .then(value => {
        assert.equal(value, 'richard');
        assert.equal(isotope.value, 'richard');
      });
  });

  it('can create an isotope with simple value getters', () => {
    const isotope = new Isotope({
      reactor: mockReactor,
      nucleus: mockSimpleNucleus,
      value: 'johnny',
      getters: mockSimpleGetters
    });
    return isotope.getValue()
      .then(value => {
        assert.equal(isotope.value, 'johnny');
        assert.equal(value, 'JOHNNY');
      });
  });

  it('can create an isotope with simple value setters', () => {
    const isotope = new Isotope({
      reactor: mockReactor,
      nucleus: mockSimpleNucleus,
      value: 'john',
      setters: mockSimpleSetters
    });
    return isotope.setValue({ value: 'richard' })
      .then(value => {
        assert.equal(value, 'RICHARD');
        assert.equal(isotope.value, 'RICHARD');
      });
  });

  it('can validate against a simple value and pass', () => {
    const isotope = new Isotope({
      reactor: mockReactor,
      nucleus: mockSimpleNucleus,
      value: 'john'
    });
    return isotope.validate()
      .then(({ result, messages }) => {
        assert.equal(result, true);
        assert.deepEqual(messages, []);
      }).catch((msg) => { throw new Error(msg); });
  });
});
