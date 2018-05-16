import assert from 'assert';
import { SimpleValidator, Validators } from '../../Validate';
import { AllowPolicy, DenyPolicy, GrantSinglePolicy } from '../../Policy';
import { Sanitizers, SimpleSanitizer } from '../../Sanitize';
import { Nucleus, context } from '../../Nucleus';
import { Isotope } from '../Isotope';
import { Reactor } from '../../Reactor';

describe('Isotope', () => {
  const mockReactor = new Reactor({});

  const mockPolicies = new GrantSinglePolicy({ policies: [
    new DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
    new AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] })
  ] });

  const mockSanitisers = new Sanitizers({ filters: [
    new SimpleSanitizer({ rules: ['trim'] }),
    new SimpleSanitizer({ rules: ['upper_case'] })
  ] });

  const mockValidators = new Validators({ validators: [
    new SimpleValidator({ rules: ['required'] }),
    new SimpleValidator({ rules: ['min:5'] })
  ] });

  const mockSimpleNucleus = new Nucleus({
    type: context.STRING,
    machine: 'first_name',
    label: 'First Name',
    policies: mockPolicies,
    sanitizers: mockSanitisers,
    validators: mockValidators,
    test: true
  });

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
});
