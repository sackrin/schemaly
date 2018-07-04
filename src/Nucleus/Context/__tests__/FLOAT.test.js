import { expect } from 'chai';
import { FLOAT } from '../';
import { Nucleus } from '../../';

describe('Nucleus/Context/FLOAT', () => {
  const fakeNucleus = Nucleus({
    type: FLOAT
  });

  const fakeIsotope = (options = {}) => ({
    value: '',
    getValue: async function () { return this.value; },
    ...options
  });

  it('can add validators to the parent nucleus', () => {
    expect(fakeNucleus.sanitizers.filters).to.deep.equal(FLOAT.sanitizers);
    expect(fakeNucleus.validators.validators).to.deep.equal(FLOAT.validators);
  });

  it('can convert a non float to a float', () => {
    return fakeNucleus
      .sanitize({ isotope: fakeIsotope({ value: 2 }) })
      .then(sanitized => {
        expect(sanitized).to.equal(2.00);
      });
  });
});
