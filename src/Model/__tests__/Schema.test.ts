import { expect } from "chai";
import Schema from "../Schema";
import { STRING, Fields, Field } from "../../Blueprint";

describe("Model/Schema", () => {
  const fakeArgs = {
    machine: "person",
    label: "Person Schema",
    scope: ["read", "write"],
    roles: ["user", "guest"],
    blueprints: Fields([
      Field({ context: STRING, machine: "title" }),
      Field({ context: STRING, machine: "first_name" }),
      Field({ context: STRING, machine: "surname" })
    ])
  };

  it("can create an model instance", () => {
    const fakeModel = Schema({
      ...fakeArgs,
      options: {
        testing: true
      }
    });
    expect(fakeModel.label).to.equal("Person Schema");
    expect(fakeModel.machine).to.equal("person");
    expect(fakeModel.blueprints).to.equal(fakeArgs.blueprints);
    expect(fakeModel.roles).to.equal(fakeArgs.roles);
    expect(fakeModel.scope).to.equal(fakeArgs.scope);
    expect(fakeModel.options).to.deep.equal({ testing: true });
  });
});
