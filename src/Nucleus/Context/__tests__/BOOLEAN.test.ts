import { expect } from 'chai';
import { BOOLEAN } from '../';
import { Nucleus } from '../../';

describe('Nucleus/Context/BOOLEAN', () => {
  const fakeNucleus = Nucleus({
    type: BOOLEAN
  });

  it('can add validators to the parent nucleus', () => {
    expect(fakeNucleus.sanitizers.filters).to.deep.equal(BOOLEAN.sanitizers);
    expect(fakeNucleus.validators.validators).to.deep.equal(BOOLEAN.validators);
  });
});
