import { expect } from "chai";
import { COLLECTION } from "../";
import { Field } from "../../";

describe("Blueprint/Context/COLLECTION", () => {
  const fakeBlueprint = Field({
    machine: "example",
    context: COLLECTION
  });

  it("can add sanitizers, validators to the parent blueprint", () => {
    expect(fakeBlueprint.sanitizers.sanitizers).to.deep.equal(
      COLLECTION.sanitizers
    );
    expect(fakeBlueprint.validators.validators).to.deep.equal(
      COLLECTION.validators
    );
  });
});
