import assert from 'assert';
import { expect } from 'chai';
import { SimpleValidator, Validators } from '../../Validate';
import { AllowPolicy, DenyPolicy, GrantSinglePolicy } from '../../Policy';
import { Sanitizers, SimpleSanitizer } from '../../Sanitize';
import { Nucleus, context } from '../../Nucleus';
import Isotope from '../Isotope';
import { Reactor } from '../../Reactor';

describe('Isotope', () => {
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
      sanitizers: Sanitizers({ filters: [
        SimpleSanitizer({ rules: ['trim'] }),
        SimpleSanitizer({ rules: ['upper_case'] })
      ] }),
      validators: Validators({ validators: [
        SimpleValidator({ rules: ['required'] }),
        SimpleValidator({ rules: ['min:5'] })
      ] }),
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

  it('can create an isotope instance from a nucleus', () => {
    const isotope = Isotope({ ...mockParams, testing: true });
    assert.equal(isotope.reactor, mockParams.reactor);
    assert.equal(isotope.nucleus, mockParams.nucleus);
    assert.equal(isotope.value, 'johnny');
    assert.equal(isotope.options.testing, true);
  });

  it('can use getters to retrieve a correctly formatted nucleus value', () => {
    const fakeIsotope = Isotope({
      ...mockParams
    });
    return fakeIsotope.getValue()
      .then(value => {
        expect(fakeIsotope.value).to.equal('johnny');
        expect(value).to.equal('JOHNNY');
      });
  });

  it('can create an isotope with no value setters', () => {
    const fakeIsotope = Isotope({
      ...mockParams
    });
    return fakeIsotope.setValue({ value: 'richard' })
      .then(value => {
        expect(value).to.equal('RICHARD');
        expect(fakeIsotope.value).to.equal('RICHARD');
      });
  });

  it('can validate against a simple value and pass', () => {
    const fakeIsotope = Isotope({
      ...mockParams
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
      ...mockParams,
      value: 'Johnny'
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
      ...mockParams,
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
      ...mockParams,
      value: ' Johnny '
    });
    return fakeIsotope.sanitize()
      .then(() => {
        assert.equal(fakeIsotope.value, 'JOHNNY');
      }).catch((msg) => {
        throw new Error(msg);
      });
  });
});
