import { expect } from 'chai';
import { CONTAINER } from '../';
import { Field } from '../../';

describe('Blueprint/Context/CONTAINER', () => {
  const fakeBlueprint = Field({
    machine: 'example',
    context: CONTAINER,
  });

  it('can add sanitizers, validators to the parent blueprint', () => {
    expect(fakeBlueprint.sanitizers.sanitizers).to.deep.equal(
      CONTAINER.sanitizers
    );
    expect(fakeBlueprint.validators.validators).to.deep.equal(
      CONTAINER.validators
    );
  });
});
