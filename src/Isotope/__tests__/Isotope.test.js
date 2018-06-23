import assert from 'assert';
import { SimpleValidator, Validators } from '../../Validate';
import { AllowPolicy, DenyPolicy, GrantSinglePolicy } from '../../Policy';
import { Sanitizers, SimpleSanitizer } from '../../Sanitize';
import { Nucleus, context } from '../../Nucleus';
import Isotope from '../Isotope';
import { Reactor } from '../../Reactor';

describe.skip('Isotope', () => {
  ///
  const mockReactor = Reactor({});

  const mockPolicies = GrantSinglePolicy({
    policies: [
      DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
      AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] })
    ]
  });

  const mockSanitisers = Sanitizers({ filters: [
    SimpleSanitizer({ rules: ['trim'] }),
    SimpleSanitizer({ rules: ['upper_case'] })
  ] });

  const mockValidators = Validators({ validators: [
    SimpleValidator({ rules: ['required'] }),
    SimpleValidator({ rules: ['min:5'] })
  ] });

  const mockSimpleGetters = [
    ({ isotope, value }) => (value.toString().toUpperCase())
  ];

  const mockSimpleSetters = [
    ({ isotope, value }) => (value.toString().toUpperCase())
  ];

  ///
  const mockSimpleNucleus = Nucleus({
    type: context.STRING,
    machine: 'first_name',
    label: 'First Name',
    policies: mockPolicies,
    sanitizers: mockSanitisers,
    validators: mockValidators,
    test: true
  });

  const mockParams = {
    reactor: Reactor({}),
    nucleus: Nucleus({
      type: context.STRING,
      machine: 'first_name',
      label: 'First Name',
      policies: GrantSinglePolicy({
        policies: [
          DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
          AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] })
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
    const isotope = Isotope({
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
    const isotope = Isotope({
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
    const isotope = Isotope({
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
    const isotope = Isotope({
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
    const isotope = Isotope({
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
    const isotope = Isotope({
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
