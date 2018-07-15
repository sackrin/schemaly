import { expect } from "chai";
import Field from "../Field";
import * as Context from "../Context";
import Fields from "../Fields";
import { SanitizeAll, SimpleSanitizer } from "../../Sanitize";
import { ValidateAll, SimpleValidator } from "../../Validate";
import { GrantOne, DenyPolicy, AllowPolicy } from "../../Policy";
import { NucleusArgs } from "../Types";
import { Hydrate } from "../../Isotope";
import { Schema } from "../../Atom";
import { Reaction } from "../../Reactor";
import { STRING } from "../Context";

describe("Nucleus/Field", (): void => {
  const fakeAtom = Schema({
    machine: "test",
    roles: [ "user", "admin" ],
    scope: [ "read", "write" ],
    nuclei: Fields([
      Field({ machine: "example", context: STRING })
    ])
  });

  const getIsotope = (options: any = {}) => (Hydrate({
    reactor: Reaction({
      atom: fakeAtom,
      roles: [ "user", "admin" ],
      scope: [ "read", "write" ]
    }),
    nucleus: fakeAtom.nuclei.nuclei[0],
    ...options
  }));


  const fakeParent = Field({
    context: Context.CONTAINER,
    machine: "profile",
  });

  const fakeArgs: NucleusArgs = {
    parent: fakeParent,
    context: Context.STRING,
    machine: "first_name",
    label: "First Name",
    policies: GrantOne([
      DenyPolicy({ roles: ["member"], scope: ["read", "write"] }),
      AllowPolicy({ roles: ["user", "admin"], scope: ["read", "write"] }),
    ]),
    sanitizers: SanitizeAll([
      SimpleSanitizer({ filters: ["trim"] }),
      SimpleSanitizer({ filters: ["upper_case"] }),
    ]),
    validators: ValidateAll([
      SimpleValidator({ rules: ["required"] }),
      SimpleValidator({ rules: ["min:5"] }),
    ]),
    setters: [
      ({ value }: { value: any }) => (value.toString().toUpperCase()),
    ],
    getters: [
      ({ value }: { value: any }) => (value.toString().toUpperCase()),
    ],
  };

  it("can be created and with config, parent and options", () => {
    const nucleus = Field({
      ...fakeArgs,
      options: { test: true },
    });
    expect(nucleus.parent).to.equal(fakeParent);
    expect(nucleus.context).to.deep.equal(Context.STRING);
    expect(nucleus.machine).to.equal("first_name");
    expect(nucleus.label).to.equal("First Name");
    expect(nucleus.options).to.deep.equal({ test: true });
    expect(nucleus.policies).to.equal(fakeArgs.policies);
    expect(nucleus.sanitizers).to.equal(fakeArgs.sanitizers);
    expect(nucleus.validators).to.equal(fakeArgs.validators);
  });

  it("can use getters to access common properties", () => {
    const fakeField = Field({ ...fakeArgs });
    expect(fakeField.machine).to.equal("first_name");
    expect(fakeField.context).to.equal(Context.STRING);
    expect(fakeField.label).to.equal("First Name");
  });

  it("collection nucleus can have a group of nuclei added", () => {
    const nucleusOne = Field({ ...fakeArgs, machine: "first_name" });
    const nucleusTwo = Field({ ...fakeArgs, machine: "surname" });
    const nucleusThree = Field({ ...fakeArgs, machine: "title" });
    const fakeFields = Fields([ nucleusOne, nucleusTwo, nucleusThree ]);
    const nucleus = Field({ ...fakeArgs, context: Context.COLLECTION, machine: "people" });
    nucleus.setNuclei(fakeFields);
    expect(nucleus.nuclei).to.equal(fakeFields);
    expect(nucleus.nuclei.parent).to.equal(nucleus);
  });

  it("string nucleus cannot have a group of nuclei added", () => {
    const nucleusOne = Field({ ...fakeArgs, label: "first_name" });
    const nucleusTwo = Field({ ...fakeArgs, label: "surname" });
    const nucleusThree = Field({ ...fakeArgs, label: "title" });
    const fakeFields = Fields([nucleusOne, nucleusTwo, nucleusThree]);
    const nucleus = Field({ ...fakeArgs, machine: "email_address" });
    expect(() => nucleus.setNuclei(fakeFields)).to.throw("CANNOT_HAVE_CHILDREN");
  });

  it("can validate a value against provided validators and expect a pass", () => {
    const fakeField = Field(fakeArgs);
    return fakeField.validate({ isotope: getIsotope({ value: "Jennifer" }) })
      .then((check) => {
        expect(check.valid).to.equal(true);
        expect(check.messages).to.deep.equal([]);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it("can validate a value against provided validators and expect a fail", () => {
    const fakeField = Field(fakeArgs);
    return fakeField.validate({ isotope: getIsotope({ value: "Tom" }) })
      .then((check) => {
        expect(check.valid).to.equal(false);
        expect(check.messages).to.deep.equal([ "The value must be at least 5 characters." ]);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it("can sanitize a value against provided sanitizes", () => {
    const fakeField = Field(fakeArgs);
    const fakeIsotope = getIsotope({ value: "Jennifer" });
    return fakeField.sanitize({ value: fakeIsotope.getValue(), isotope: fakeIsotope })
      .then((value) => {
        expect(value).to.equal("JENNIFER");
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it("can transform a value using getters", () => {
    const fakeField = Field(fakeArgs);
    const fakeIsotope = getIsotope({ value: "example" });
    return fakeField.applyGetters({ isotope: fakeIsotope })
      .then((value) => {
        expect(value).to.equal("EXAMPLE");
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it("can transform a value using setters", () => {
    const fakeField = Field(fakeArgs);
    const fakeIsotope = getIsotope({ value: "example" });
    return fakeField.applySetters({ isotope: fakeIsotope })
      .then((value) => {
        expect(value).to.equal("EXAMPLE");
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it("can perform a successful grant check against provided policies", () => {
    const fakeField = Field(fakeArgs);
    const fakeIsotope = getIsotope({ value: "Jennifer" });
    return fakeField.grant({ isotope: fakeIsotope, scope: [ "read" ], roles: [ "user" ] })
      .then((result) => {
        expect(result).to.equal(true);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });

  it("can perform an unsuccessful grant check against provided policies", () => {
    const fakeField = Field(fakeArgs);
    const fakeIsotope = getIsotope({ value: "Jennifer" });
    return fakeField.grant({ isotope: fakeIsotope, scope: [ "read" ], roles: [ "member" ] })
      .then((result) => {
        expect(result).to.equal(false);
      }).catch((msg) => {
        throw new Error(msg);
      });
  });
});
