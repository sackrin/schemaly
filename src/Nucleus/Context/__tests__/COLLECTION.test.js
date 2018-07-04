import { expect } from 'chai';
import { COLLECTION } from '../';
import { Nucleus } from '../../';

describe('Nucleus/Context/COLLECTION', () => {
  const fakeNucleus = Nucleus({
    type: COLLECTION
  });

  it('can add sanitizers, validators to the parent nucleus', () => {
    expect(fakeNucleus.sanitizers.filters).to.deep.equal(COLLECTION.sanitizers);
    expect(fakeNucleus.validators.validators).to.deep.equal(COLLECTION.validators);
  });
});
