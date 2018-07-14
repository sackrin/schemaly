import { expect } from "chai";
import { FLOAT } from "../";
import { Field } from "../../";
import { Hydrate, Isotope } from "../../../Isotope";
import {Schema} from "../../../Atom";
import {Reaction} from "../../../Reactor";
import {Fields, STRING} from "../../index";

describe("Nucleus/Context/FLOAT", () => {
  const fakeNucleus = Field({
    machine: "example",
    context: FLOAT,
  });

  const fakeAtom = Schema({
    machine: "test",
    roles: [ "user", "admin" ],
    scope: [ "read", "write" ],
    nuclei: Fields([
      Field({ machine: "example", context: STRING })
    ])
  });

  const fakeIsotope = (options: any = {}) => (Hydrate({
    reactor: Reaction({
      atom: fakeAtom,
      roles: [ "user", "admin" ],
      scope: [ "read", "write" ],
      values: { }
    }),
    nucleus: fakeAtom.nuclei.nuclei[0],
    ...options
  }));


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
