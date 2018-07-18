import { expect } from "chai";
import { COLLECTION } from "../";
import { Field } from "../../";

describe("Nucleus/Context/COLLECTION", () => {
  const fakeNucleus = Field({
    machine: "example",
    context: COLLECTION
  });

  it("can add sanitizers, validators to the parent nucleus", () => {
    expect(fakeNucleus.sanitizers.sanitizers).to.deep.equal(
      COLLECTION.sanitizers
    );
    expect(fakeNucleus.validators.validators).to.deep.equal(
      COLLECTION.validators
    );
  });
});
