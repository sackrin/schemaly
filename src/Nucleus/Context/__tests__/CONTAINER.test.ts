import { expect } from 'chai';
import { CONTAINER } from '../';
import { Nucleus } from '../../';

describe('Nucleus/Context/CONTAINER', () => {
  const fakeNucleus = Nucleus({
    type: CONTAINER
  });

  it('can add sanitizers, validators to the parent nucleus', () => {
    expect(fakeNucleus.sanitizers.filters).to.deep.equal(CONTAINER.sanitizers);
    expect(fakeNucleus.validators.validators).to.deep.equal(CONTAINER.validators);
  });
});
