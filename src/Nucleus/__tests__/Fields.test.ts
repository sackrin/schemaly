import { expect } from "chai";
import Fields from "../Fields";
import Field from "../Field";
import * as Context from "../Context";

describe("Nucleus/Fields", () => {
  const fakeNucleiGroup = [
    Field({ machine: "first_name", context: Context.STRING }),
    Field({ machine: "surname", context: Context.STRING }),
    Field({ machine: "title", context: Context.STRING }),
  ];

  const fakeOptions = {
    parent: Field({ machine: "profile", context: Context.CONTAINER }),
  };

  it("can create a simple nucleus group", () => {
    const fakeNuclei = Fields(fakeNucleiGroup, { ...fakeOptions, options: { testing: true } });
    expect(fakeNuclei.nuclei).to.equal(fakeNucleiGroup);
    expect(fakeNuclei.parent).to.equal(fakeOptions.parent);
    expect(fakeNuclei.options).to.deep.equal({ testing: true });
  });

  it("can retrieve all nuclei using the all() shortcut", () => {
    const fakeNuclei = Fields(fakeNucleiGroup);
    expect(fakeNuclei.all()).to.deep.equal(fakeNucleiGroup);
  });
});
