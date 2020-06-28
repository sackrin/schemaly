import { expect } from "chai";
import { SimpleValidator } from "../index";
import { Hydrate, Effect } from "../../Effect";
import { Schema } from "../../Model";
import { Collision } from "../../Interact";
import { Field, Fields, STRING } from "../../Blueprint";

describe("Validate/SimpleValidator", (): void => {
  const simpleStringRule = "required|min:5";
  const simplePromiseRule = () =>
    new Promise(resolve => {
      setTimeout(resolve, 100, ["email"]);
    });

  const fakeModel = Schema({
    machine: "test",
    roles: ["user", "admin"],
    scope: ["read", "write"],
    blueprints: Fields([Field({ machine: "first_name", context: STRING })])
  });

  const fakeEffect = (options: any = {}) =>
    Hydrate({
      collider: Collision({
        model: fakeModel,
        roles: ["user", "admin"],
        scope: ["read", "write"]
      }),
      blueprint: fakeModel.blueprints.blueprints[0],
      value: "John",
      ...options
    });

  it("can create a simple rule validator", () => {
    const validator = SimpleValidator({
      rules: [simpleStringRule],
      options: { test: true }
    });
    expect(validator.rules).to.deep.equal([simpleStringRule]);
    expect(validator.options).to.deep.equal({ test: true });
  });

  it("can create a mixed rule validator", () => {
    const validator = SimpleValidator({
      rules: [simpleStringRule, simplePromiseRule]
    });
    expect(validator.rules).to.deep.equal([
      simpleStringRule,
      simplePromiseRule
    ]);
  });

  it("get rules produces a usable validator string", () => {
    const validator = SimpleValidator({
      rules: [simpleStringRule, simplePromiseRule]
    });
    return validator
      .getRules()
      .then(rules => {
        expect(rules).to.equal("required|min:5|email");
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("validates against a simple value and passes", () => {
    const validator = SimpleValidator({ rules: [simpleStringRule] });
    const effect = fakeEffect({ value: "Johnny" });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(true);
        expect(messages).to.deep.equal([]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("validates against a simple value and fails", () => {
    const validator = SimpleValidator({ rules: [simpleStringRule] });
    const effect = fakeEffect({ value: "John" });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(false);
        expect(messages).to.deep.equal([
          "The value must be at least 5 characters."
        ]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("validates against a promise value and passes", () => {
    const simplePromiseValue = () =>
      new Promise(resolve => {
        setTimeout(resolve, 100, "Johnny");
      });
    const validator = SimpleValidator({ rules: [simpleStringRule] });
    const effect = fakeEffect({ value: simplePromiseValue });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(true);
        expect(messages).to.deep.equal([]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("validates against a promise value and fails", () => {
    const simplePromiseValue = () =>
      new Promise(resolve => {
        setTimeout(resolve, 100, "John");
      });
    const validator = SimpleValidator({ rules: [simpleStringRule] });
    const effect = fakeEffect({ value: simplePromiseValue });
    return validator
      .validate({ effect })
      .then(({ valid, messages }) => {
        expect(valid).to.equal(false);
        expect(messages).to.deep.equal([
          "The value must be at least 5 characters."
        ]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });
});
