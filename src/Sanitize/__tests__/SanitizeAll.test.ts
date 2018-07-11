import { expect } from "chai";
import SimpleSanitizer from "../SimpleSanitizer";
import SanitizeAll from "../SanitizeAll";
import { Isotope } from "../../Isotope";

describe("Sanitize/SanitizeAll", () => {
  const mockSanitizeAll = [
    SimpleSanitizer({ filters: ["trim"] }),
    SimpleSanitizer({ filters: ["upper_case"] }),
  ];

  const mockPromiseValue = () => (new Promise((resolve) => {
    setTimeout(resolve, 100, "  johnny ");
  }));

  const fakeIsotope = (options: any = {}) => (Isotope(options));

  it("can create a basic sanitizer group", () => {
    const sanitizers = SanitizeAll(mockSanitizeAll, { test: true });
    expect(sanitizers.sanitizers).to.deep.equal(mockSanitizeAll);
    expect(sanitizers.options).to.deep.equal({ test: true });
  });

  it("can sanitize a simple value", () => {
    const sanitizers = SanitizeAll(mockSanitizeAll);
    return sanitizers.apply({ value: " johnny ", isotope: fakeIsotope({}) })
      .then((filteredValue) => {
        expect(filteredValue).to.equal("JOHNNY");
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it("can sanitize a simple value with no sanitizes", () => {
    const sanitizers = SanitizeAll([]);
    return sanitizers.apply({ value: "  johnny  ", isotope: fakeIsotope({}) })
      .then((filteredValue) => {
        expect(filteredValue).to.equal("  johnny  ");
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it("can sanitize a promise value", () => {
    const sanitizers = SanitizeAll(mockSanitizeAll);
    return sanitizers.apply({ value: mockPromiseValue, isotope: fakeIsotope({}) })
      .then((filteredValue) => {
        expect(filteredValue).to.equal("JOHNNY");
      })
      .catch((msg) => { throw new Error(msg); });
  });

});
