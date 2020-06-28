import { expect } from "chai";
import { BOOLEAN } from "../index";
import { Field } from "../../index";
import { Blueprint } from "../../Types";

describe("Blueprint/Context/BOOLEAN", (): void => {
  const fakeBlueprint: Blueprint = Field({
    machine: "example",
    context: BOOLEAN
  });

  it("can add validators to the parent blueprint", () => {
    expect(fakeBlueprint.sanitizers.sanitizers).to.deep.equal(BOOLEAN.sanitizers);
    expect(fakeBlueprint.validators.validators).to.deep.equal(BOOLEAN.validators);
  });
});
