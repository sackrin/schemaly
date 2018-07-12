import { expect } from "chai";
import { BOOLEAN } from "../";
import { Field, Nucleus } from "../../";

describe("Nucleus/Context/BOOLEAN", () => {
  const fakeNucleus: Nucleus = Field({
    machine: "example",
    context: BOOLEAN,
  });

  it("can add validators to the parent nucleus", () => {
    expect(fakeNucleus.sanitizers.sanitizers).to.deep.equal(BOOLEAN.sanitizers);
    expect(fakeNucleus.validators.validators).to.deep.equal(BOOLEAN.validators);
  });
});
