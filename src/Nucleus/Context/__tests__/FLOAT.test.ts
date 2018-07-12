import { expect } from "chai";
import { FLOAT } from "../";
import { Field } from "../../";
import { Isotope } from "../../../Isotope";

describe("Nucleus/Context/FLOAT", () => {
  const fakeNucleus = Field({
    machine: "example",
    context: FLOAT,
  });

  const fakeIsotope = (options: any = {}) => (Isotope(options));

  it("can add validators to the parent nucleus", () => {
    expect(fakeNucleus.sanitizers.sanitizers).to.deep.equal(FLOAT.sanitizers);
    expect(fakeNucleus.validators.validators).to.deep.equal(FLOAT.validators);
  });

  it("can convert a non float to a float", () => {
    const fakeField = fakeIsotope({ value: 2 });
    return fakeNucleus
      .sanitize({ value: fakeField.getValue(), isotope: fakeField })
      .then((sanitized) => {
        expect(sanitized).to.equal(2.00);
      });
  });
});
