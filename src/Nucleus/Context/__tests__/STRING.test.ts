import { expect } from "chai";
import { STRING } from "../";
import { Field } from "../../";
import { Hydrate } from "../../../Isotope";
import {Schema} from "../../../Atom";
import {Reaction} from "../../../Reactor";
import {Fields} from "../../index";

describe("Nucleus/Context/STRING", () => {
  const fakeNucleus = Field({
    machine: "example",
    context: STRING,
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
      scope: [ "read", "write" ]
    }),
    nucleus: fakeAtom.nuclei.nuclei[0],
    ...options
  }));


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
