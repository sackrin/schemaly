import { expect } from 'chai';
import Fields from '../Fields';
import Field from '../Field';
import * as Context from '../Context';

describe('Blueprint/Fields', () => {
  const fakeBlueprintsGroup = [
    Field({ machine: 'first_name', context: Context.STRING }),
    Field({ machine: 'surname', context: Context.STRING }),
    Field({ machine: 'title', context: Context.STRING }),
  ];

  const fakeOptions = {
    parent: Field({ machine: 'profile', context: Context.CONTAINER }),
  };

  it('can create a simple blueprint group', () => {
    const fakeBlueprints = Fields(fakeBlueprintsGroup, {
      ...fakeOptions,
      options: { testing: true },
    });
    expect(fakeBlueprints.blueprints).to.equal(fakeBlueprintsGroup);
    expect(fakeBlueprints.parent).to.equal(fakeOptions.parent);
    expect(fakeBlueprints.options).to.deep.equal({ testing: true });
  });

  it('can retrieve all blueprints using the all() shortcut', () => {
    const fakeBlueprints = Fields(fakeBlueprintsGroup);
    expect(fakeBlueprints.all()).to.deep.equal(fakeBlueprintsGroup);
  });
});
