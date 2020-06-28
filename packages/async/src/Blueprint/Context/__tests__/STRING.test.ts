import { expect } from "chai";
import { STRING } from "../index";
import { Field } from "../../index";
import { Hydrate } from "../../../Effect";
import { Schema } from "../../../Model";
import { Collision } from "../../../Interact";
import { Fields } from "../../index";

describe("Blueprint/Context/STRING", () => {
  const fakeBlueprint = Field({
    machine: "example",
    context: STRING
  });

  const fakeModel = Schema({
    machine: "test",
    roles: ["user", "admin"],
    scope: ["read", "write"],
    blueprints: Fields([Field({ machine: "example", context: STRING })])
  });

  const fakeEffect = (options: any = {}) =>
    Hydrate({
      collider: Collision({
        model: fakeModel,
        roles: ["user", "admin"],
        scope: ["read", "write"]
      }),
      blueprint: fakeModel.blueprints.blueprints[0],
      ...options
    });

  it("can add validators to the parent blueprint", () => {
    expect(fakeBlueprint.sanitizers.sanitizers).to.deep.equal(STRING.sanitizers);
    expect(fakeBlueprint.validators.validators).to.deep.equal(STRING.validators);
  });

  it("can convert a non string to a string", () => {
    const fakeField = fakeEffect({ value: 2 });
    return fakeBlueprint
      .sanitize({ value: fakeField.getValue(), effect: fakeField })
      .then(sanitized => {
        expect(sanitized).to.equal("2");
      });
  });
});
