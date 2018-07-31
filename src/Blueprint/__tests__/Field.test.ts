import { expect } from "chai";
import Field from "../Field";
import Fields from "../Fields";
import { SanitizeAll, SimpleSanitizer } from "../../Sanitize";
import { ValidateAll, SimpleValidator } from "../../Validate";
import { GrantOne, DenyPolicy, AllowPolicy } from "../../Policy";
import { BlueprintArgs } from "../Types";
import { Hydrate } from "../../Effect";
import { Schema } from "../../Model";
import { Collision } from "../../Interact";
import { COLLECTION, CONTAINER, STRING } from "../Context";

describe("Blueprint/Field", (): void => {
  const fakeModel = Schema({
    machine: "test",
    roles: ["user", "admin"],
    scope: ["read", "write"],
    blueprints: Fields([Field({ machine: "example", context: STRING })])
  });

  const getEffect = (options: any = {}) =>
    Hydrate({
      collider: Collision({
        model: fakeModel,
        roles: ["user", "admin"],
        scope: ["read", "write"]
      }),
      blueprint: fakeModel.blueprints.blueprints[0],
      ...options
    });

  const fakeParent = Field({
    context: CONTAINER,
    machine: "profile"
  });

  const fakeArgs: BlueprintArgs = {
    parent: fakeParent,
    context: STRING,
    machine: "first_name",
    label: "First Name",
    description: "A field representing a person's first name",
    tags: ["person", "name"],
    defaultValue: "Ben",
    policies: GrantOne([
      DenyPolicy({ roles: ["member"], scope: ["read", "write"] }),
      AllowPolicy({ roles: ["user", "admin"], scope: ["read", "write"] })
    ]),
    sanitizers: SanitizeAll([
      SimpleSanitizer({ filters: ["trim"] }),
      SimpleSanitizer({ filters: ["upper_case"] })
    ]),
    validators: ValidateAll([
      SimpleValidator({ rules: ["required"] }),
      SimpleValidator({ rules: ["min:5"] })
    ]),
    setters: [({ value }: { value: any }) => value.toString().toUpperCase()],
    getters: [({ value }: { value: any }) => value.toString().toUpperCase()]
  };

  it("can be created and with config, parent and options", () => {
    const blueprint = Field({
      ...fakeArgs,
      options: { test: true }
    });
    expect(blueprint.parent).to.equal(fakeParent);
    expect(blueprint.context).to.deep.equal(STRING);
    expect(blueprint.machine).to.equal("first_name");
    expect(blueprint.label).to.equal("First Name");
    expect(blueprint.description).to.equal("A field representing a person's first name");
    expect(blueprint.tags).to.deep.equal(["person", "name"]);
    expect(blueprint.defaultValue).to.equal("Ben");
    expect(blueprint.options).to.deep.equal({ test: true });
    expect(blueprint.policies).to.equal(fakeArgs.policies);
    expect(blueprint.sanitizers).to.equal(fakeArgs.sanitizers);
    expect(blueprint.validators).to.equal(fakeArgs.validators);
  });

  it("can use getters to access common properties", () => {
    const fakeField = Field({ ...fakeArgs });
    expect(fakeField.machine).to.equal("first_name");
    expect(fakeField.context).to.equal(STRING);
    expect(fakeField.label).to.equal("First Name");
  });

  it("collection blueprint can have a group of blueprints added", () => {
    const blueprintOne = Field({ ...fakeArgs, machine: "first_name" });
    const blueprintTwo = Field({ ...fakeArgs, machine: "surname" });
    const blueprintThree = Field({ ...fakeArgs, machine: "title" });
    const fakeFields = Fields([blueprintOne, blueprintTwo, blueprintThree]);
    const blueprint = Field({
      ...fakeArgs,
      context: COLLECTION,
      machine: "people"
    });
    blueprint.setBlueprints(fakeFields);
    expect(blueprint.blueprints).to.equal(fakeFields);
    expect(blueprint.blueprints.parent).to.equal(blueprint);
  });

  it("string blueprint cannot have a group of blueprints added", () => {
    const blueprintOne = Field({ ...fakeArgs, label: "first_name" });
    const blueprintTwo = Field({ ...fakeArgs, label: "surname" });
    const blueprintThree = Field({ ...fakeArgs, label: "title" });
    const fakeFields = Fields([blueprintOne, blueprintTwo, blueprintThree]);
    const blueprint = Field({ ...fakeArgs, machine: "email_address" });
    expect(() => blueprint.setBlueprints(fakeFields)).to.throw(
      "CANNOT_HAVE_CHILDREN"
    );
  });

  it("can validate a value against provided validators and expect a pass", () => {
    const fakeField = Field(fakeArgs);
    return fakeField
      .validate({ effect: getEffect({ value: "Jennifer" }) })
      .then(check => {
        expect(check.valid).to.equal(true);
        expect(check.messages).to.deep.equal([]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can validate a value against provided validators and expect a fail", () => {
    const fakeField = Field(fakeArgs);
    return fakeField
      .validate({ effect: getEffect({ value: "Tom" }) })
      .then(check => {
        expect(check.valid).to.equal(false);
        expect(check.messages).to.deep.equal([
          "The value must be at least 5 characters."
        ]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can sanitize a value against provided sanitizes", () => {
    const fakeField = Field(fakeArgs);
    const fakeEffect = getEffect({ value: "Jennifer" });
    return fakeField
      .sanitize({ value: fakeEffect.getValue(), effect: fakeEffect })
      .then(value => {
        expect(value).to.equal("JENNIFER");
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can transform a value using getters", () => {
    const fakeField = Field(fakeArgs);
    const fakeEffect = getEffect({ value: "example" });
    return fakeField
      .applyGetters({ effect: fakeEffect })
      .then(value => {
        expect(value).to.equal("EXAMPLE");
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can transform a value using setters", () => {
    const fakeField = Field(fakeArgs);
    const fakeEffect = getEffect({ value: "example" });
    return fakeField
      .applySetters({ effect: fakeEffect })
      .then(value => {
        expect(value).to.equal("EXAMPLE");
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can perform a successful grant check against provided policies", () => {
    const fakeField = Field(fakeArgs);
    const fakeEffect = getEffect({ value: "Jennifer" });
    return fakeField
      .grant({ effect: fakeEffect, scope: ["read"], roles: ["user"] })
      .then(result => {
        expect(result).to.equal(true);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can perform an unsuccessful grant check against provided policies", () => {
    const fakeField = Field(fakeArgs);
    const fakeEffect = getEffect({ value: "Jennifer" });
    return fakeField
      .grant({ effect: fakeEffect, scope: ["read"], roles: ["member"] })
      .then(result => {
        expect(result).to.equal(false);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });
});
