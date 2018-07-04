import { expect } from 'chai';
import { STRING } from '../';
import { Nucleus } from '../../';

describe('Nucleus/Context/STRING', () => {
  const fakeNucleus = Nucleus({
    type: STRING
  });

  const fakeIsotope = (options = {}) => ({
    value: '',
    getValue: async function () { return this.value; },
    ...options
  });

  it('can add validators to the parent nucleus', () => {
    expect(fakeNucleus.sanitizers.filters).to.deep.equal(STRING.sanitizers);
    expect(fakeNucleus.validators.validators).to.deep.equal(STRING.validators);
  });

  it('can convert a non string to a string', () => {
    return fakeNucleus
      .sanitize({ isotope: fakeIsotope({ value: 2 }) })
      .then(sanitized => {
        expect(sanitized).to.equal('2');
      });
  });
});
