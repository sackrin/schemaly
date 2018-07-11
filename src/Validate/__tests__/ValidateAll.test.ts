import { expect } from "chai";
import ValidateAll from "../ValidateAll";
import SimpleValidator from "../SimpleValidator";
import { Isotope } from "../../Isotope";

describe("Validate/ValidateAll", () => {
  const simpleValidateAll = [
    SimpleValidator({ rules: ["required"] }),
    SimpleValidator({ rules: ["min:5"] })
  ];

  const johnByPromise = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, "john");
  }));

  const johnnyByPromise = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, "johnny");
  }));

  const fakeIsotope = (options: any = {}) => (Isotope(options));

  it("can create a simple validator group", () => {
    const validators = ValidateAll(simpleValidateAll, { test: true });
    expect(validators.validators).to.deep.equal(simpleValidateAll);
    expect(validators.options).to.deep.equal({ test: true });
  });

  it("can perform validation on a simple value and pass", () => {
    const validators = ValidateAll(simpleValidateAll);
    return validators.validate({ isotope: fakeIsotope({ value: "johnny" }) })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(true);
        expect(messages).to.deep.equal([]);
      }).catch((msg) => { throw new Error(msg); });
  });

  it("can perform validation on a simple value and fail", () => {
    const validators = ValidateAll(simpleValidateAll);
    return validators.validate({ isotope: fakeIsotope({ value: "john" }) })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(false);
        expect(messages).to.deep.equal([ "The value must be at least 5 characters." ]);
      }).catch((msg) => { throw new Error(msg); });
  });

  it("can perform validation on a promise value and pass", () => {
    const validators = ValidateAll(simpleValidateAll);
    return validators.validate({ isotope: fakeIsotope({ value: johnnyByPromise }) })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(true);
        expect(messages).to.deep.equal([]);
      }).catch((msg) => { throw new Error(msg); });
  });

  it("can perform validation on a promise value and fail", () => {
    const validators = ValidateAll(simpleValidateAll);
    return validators.validate({ isotope: fakeIsotope({ value: johnByPromise }) })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(false);
        expect(messages).to.deep.equal([ "The value must be at least 5 characters." ]);
      }).catch((msg) => { throw new Error(msg); });
  });
});
