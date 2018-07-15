import { expect } from "chai";
import SimpleSanitizer from "../SimpleSanitizer";
import {Hydrate, Isotope} from "../../Isotope";
import {Schema} from "../../Atom";
import {Reaction} from "../../Reactor";
import {Field, Fields, STRING} from "../../Nucleus";

describe("Santize/SimpleSanitizer", () => {
  const simplePromiseRule = () => (new Promise((resolve) => {
    setTimeout(resolve, 100, ["sanitize_string"]);
  }));

  const mockPromiseValue = () => (new Promise((resolve) => {
    setTimeout(resolve, 100, "  johnny ");
  }));

  const fakeAtom = Schema({
    machine: "test",
    roles: [ "user", "admin" ],
    scope: [ "read", "write" ],
    nuclei: Fields([
      Field({ machine: "first_name", context: STRING })
    ])
  });

  const fakeIsotope = (options: any = {}) => (Hydrate({
    reactor: Reaction({
      atom: fakeAtom,
      roles: [ "user", "admin" ],
      scope: [ "read", "write" ]
    }),
    nucleus: fakeAtom.nuclei.nuclei[0],
    value: "John",
    ...options
  }));

  it("can create a simple filters santizer", () => {
    const filters = ["trim|sanitize_string"];
    const sanitizer = SimpleSanitizer({ filters, options: { test: true } });
    expect(sanitizer.filters).to.deep.equal(filters);
    expect(sanitizer.options.test).to.equal(true);
  });

  it("can create a mixed rule santizer", () => {
    const filters = ["trim", simplePromiseRule];
    const sanitizer = SimpleSanitizer({ filters });
    expect(sanitizer.filters).to.deep.equal(filters);
  });

  it("get filters produces a usable santizer string", () => {
    const filters = ["trim", simplePromiseRule];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer.getFilters()
      .then((built) => {
        expect(built).to.equal("trim|sanitize_string");
      });
  });

  it("sanitize a string using a single trim and upper_case filters", () => {
    const filters = ["trim|upper_case"];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer.apply({
      value: " johnny ",
      isotope: fakeIsotope(),
    }).then((sanitized) => {
        expect(sanitized).to.equal("JOHNNY");
      });
  });

  it("sanitize a promise value using a single trim and upper_case filters", () => {
    const filters = ["trim|upper_case"];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer.apply({ value: mockPromiseValue, isotope: fakeIsotope() })
      .then((sanitized) => {
        expect(sanitized).to.equal("JOHNNY");
      });
  });

  it("sanitize a string using the trim filter", () => {
    const filters = ["trim"];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer.apply({ value: " johnny ", isotope: fakeIsotope() })
      .then((sanitized) => {
        expect(sanitized).to.equal("johnny");
      });
  });

  it("sanitize a string using the upper_case filter", () => {
    const filters = ["upper_case"];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer.apply({ value: "johnny", isotope: fakeIsotope() })
      .then((sanitized) => {
        expect(sanitized).to.equal("JOHNNY");
      });
  });

  it("sanitize a string using the lower_case filter", () => {
    const filters = ["lower_case"];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer.apply({ value: "JOHNNY", isotope: fakeIsotope() })
      .then((sanitized) => {
        expect(sanitized).to.equal("johnny");
      });
  });

  it("sanitize a string using an invalid sanitizer filter", () => {
    const filters = ["invalidSanitizer"];
    const sanitizer = SimpleSanitizer({ filters });
    return sanitizer.apply({ value: "johnny", isotope: fakeIsotope() })
      .then((sanitized) => {
        expect(sanitized).to.equal("johnny");
      });
  });
});
