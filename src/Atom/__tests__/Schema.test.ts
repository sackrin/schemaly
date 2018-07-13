import { expect } from "chai";
import Schema from "../Schema";
import { STRING, Fields, Field} from "../../Nucleus";

describe("Atom/Schema", () => {
  const fakeArgs = {
    machine: "person",
    label: "Person Schema",
    scope: ["read", "write"],
    roles: ["user", "guest"],
    nuclei: Fields([
      Field({ context: STRING, machine: "title" }),
      Field({ context: STRING, machine: "first_name" }),
      Field({ context: STRING, machine: "surname" }),
    ]),
  };

  it("can create an atom instance", () => {
    const fakeAtom = Schema({
      ...fakeArgs,
      options: {
        testing: true,
      },
    });
    expect(fakeAtom.label).to.equal("Person Schema");
    expect(fakeAtom.machine).to.equal("person");
    expect(fakeAtom.nuclei).to.equal(fakeArgs.nuclei);
    expect(fakeAtom.roles).to.equal(fakeArgs.roles);
    expect(fakeAtom.scope).to.equal(fakeArgs.scope);
    expect(fakeAtom.options).to.deep.equal({ testing: true });
  });
});
