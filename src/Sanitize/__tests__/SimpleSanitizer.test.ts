import assert from "assert";
import SimpleSanitizer from "../SimpleSanitizer";

describe("Santize/SimpleSanitizer", () => {
  const simplePromiseRule = () => (new Promise((resolve) => {
    setTimeout(resolve, 100, ["sanitize_string"]);
  }));

  const mockPromiseValue = () => (new Promise((resolve) => {
    setTimeout(resolve, 100, "  johnny ");
  }));

  const fakeIsotope = (options = {}) => ({
    value: "",
    getValue: async function () { return this.value; },
    ...options
  });

  it("can create a simple rules santizer", () => {
    const rules = ["trim|sanitize_string"];
    const sanitizer = SimpleSanitizer({ rules: rules, test: true });
    assert.deepEqual(sanitizer.rules, rules);
    assert.deepEqual(sanitizer.options.test, true);
  });

  it("can create a mixed rule santizer", () => {
    const rules = ["trim", simplePromiseRule];
    const sanitizer = SimpleSanitizer({ rules: rules });
    assert.deepEqual(sanitizer.rules, rules);
  });

  it("get rules produces a usable santizer string", () => {
    const rules = ["trim", simplePromiseRule];
    const sanitizer = SimpleSanitizer({ rules: rules });
    return sanitizer.getRules()
      .then(builtRules => {
        assert.equal(builtRules, "trim|sanitize_string");
      });
  });

  it("sanitize a string using a single trim and upper_case filters", () => {
    const rules = ["trim|upper_case"];
    const sanitizer = SimpleSanitizer({ rules: rules });
    return sanitizer.apply({ value: " johnny ", isotope: fakeIsotope() })
      .then(sanitized => {
        assert.equal(sanitized, "JOHNNY");
      });
  });

  it("sanitize a promise value using a single trim and upper_case filters", () => {
    const rules = ["trim|upper_case"];
    const sanitizer = SimpleSanitizer({ rules: rules });
    return sanitizer.apply({ value: mockPromiseValue, isotope: fakeIsotope() })
      .then(sanitized => {
        assert.equal(sanitized, "JOHNNY");
      });
  });

  it("sanitize a string using the trim filter", () => {
    const rules = ["trim"];
    const sanitizer = SimpleSanitizer({ rules: rules });
    return sanitizer.apply({ value: " johnny ", isotope: fakeIsotope() })
      .then(sanitized => {
        assert.equal(sanitized, "johnny");
      });
  });

  it("sanitize a string using the upper_case filter", () => {
    const rules = ["upper_case"];
    const sanitizer = SimpleSanitizer({ rules: rules });
    return sanitizer.apply({ value: "johnny", isotope: fakeIsotope() })
      .then(sanitized => {
        assert.equal(sanitized, "JOHNNY");
      });
  });

  it("sanitize a string using the lower_case filter", () => {
    const rules = ["lower_case"];
    const sanitizer = SimpleSanitizer({ rules: rules });
    return sanitizer.apply({ value: "JOHNNY", isotope: fakeIsotope() })
      .then(sanitized => {
        assert.equal(sanitized, "johnny");
      });
  });

  it("sanitize a string using an invalid sanitizer filter", () => {
    const rules = ["invalidSanitizer"];
    const sanitizer = SimpleSanitizer({ rules: rules });
    return sanitizer.apply({ value: "johnny", isotope: fakeIsotope() })
      .then(sanitized => {
        assert.equal(sanitized, "johnny");
      });
  });
});
