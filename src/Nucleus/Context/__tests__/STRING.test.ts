import { expect } from "chai";
import { STRING } from "../";
import { Field } from "../../";
import { Isotope } from "../../../Isotope";

describe("Nucleus/Context/STRING", () => {
  const fakeNucleus = Field({
    machine: "example",
    context: STRING,
  });

  const fakeIsotope = (options: any = {}) => (Isotope(options));

  it("can add validators to the parent nucleus", () => {
    expect(fakeNucleus.sanitizers.sanitizers).to.deep.equal(STRING.sanitizers);
    expect(fakeNucleus.validators.validators).to.deep.equal(STRING.validators);
  });

  it("can convert a non string to a string", () => {
    const fakeField = fakeIsotope({ value: 2 });
    return fakeNucleus
      .sanitize({ value: fakeField.getValue(), isotope: fakeField })
      .then((sanitized) => {
        expect(sanitized).to.equal("2");
      });
  });
});
