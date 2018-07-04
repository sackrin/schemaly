import { expect } from 'chai';
import { INT } from '../';
import { Nucleus } from '../../';

describe('Nucleus/Context/INT', () => {
  const fakeNucleus = Nucleus({
    type: INT
  });

  const fakeIsotope = (options = {}) => ({
    value: '',
    getValue: async function () { return this.value; },
    ...options
  });

  it('can add validators to the parent nucleus', () => {
    expect(fakeNucleus.sanitizers.filters).to.deep.equal(INT.sanitizers);
    expect(fakeNucleus.validators.validators).to.deep.equal(INT.validators);
  });

  it('can convert a non int to an int', () => {
    return fakeNucleus
      .sanitize({ isotope: fakeIsotope({ value: '2' }) })
      .then(sanitized => {
        expect(sanitized).to.equal(2);
      });
  });
});
