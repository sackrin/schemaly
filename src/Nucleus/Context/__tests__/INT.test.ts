import { expect } from "chai";
import { INT } from "../";
import { Field } from "../../";
import { Isotope } from "../../../Isotope";

describe("Nucleus/Context/INT", () => {
  const fakeNucleus = Field({
    machine: "example",
    context: INT,
  });

  const fakeIsotope = (options: any = {}) => (Isotope(options));

  it("can add validators to the parent nucleus", () => {
    expect(fakeNucleus.sanitizers.sanitizers).to.deep.equal(INT.sanitizers);
    expect(fakeNucleus.validators.validators).to.deep.equal(INT.validators);
  });

  it("can convert a non int to an int", () => {
    const fakeField = fakeIsotope({ value: "2" });
    return fakeNucleus
      .sanitize({ value: fakeField.getValue(), isotope: fakeField })
      .then((sanitized) => {
        expect(sanitized).to.equal(2);
      });
  });
});
