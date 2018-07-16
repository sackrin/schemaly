import { expect } from "chai";
import { CONTAINER } from "../";
import { Field } from "../../";

describe("Nucleus/Context/CONTAINER", () => {
  const fakeNucleus = Field({
    machine: "example",
    context: CONTAINER
  });

  it("can add sanitizers, validators to the parent nucleus", () => {
    expect(fakeNucleus.sanitizers.sanitizers).to.deep.equal(
      CONTAINER.sanitizers
    );
    expect(fakeNucleus.validators.validators).to.deep.equal(
      CONTAINER.validators
    );
  });
});
