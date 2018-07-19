import { expect } from "chai";
import SimpleSanitizer from "../SimpleSanitizer";
import SanitizeAll from "../SanitizeAll";
import { Hydrate, Effect } from "../../Effect";
import { Schema } from "../../Model";
import { Collision } from "../../Interact";
import { Field, Fields, STRING } from "../../Blueprint";

describe("Sanitize/SanitizeAll", () => {
  const mockSanitizeAll = [
    SimpleSanitizer({ filters: ["trim"] }),
    SimpleSanitizer({ filters: ["upper_case"] })
  ];

  const mockPromiseValue = () =>
    new Promise(resolve => {
      setTimeout(resolve, 100, "  johnny ");
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

  it("can create a basic sanitizer group", () => {
    const sanitizers = SanitizeAll(mockSanitizeAll, { test: true });
    expect(sanitizers.sanitizers).to.deep.equal(mockSanitizeAll);
    expect(sanitizers.options).to.deep.equal({ test: true });
  });

  it("can sanitize a simple value", () => {
    const sanitizers = SanitizeAll(mockSanitizeAll);
    return sanitizers
      .apply({ value: " johnny ", effect: fakeEffect({}) })
      .then(filteredValue => {
        expect(filteredValue).to.equal("JOHNNY");
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can sanitize a simple value with no sanitizes", () => {
    const sanitizers = SanitizeAll([]);
    return sanitizers
      .apply({ value: "  johnny  ", effect: fakeEffect({}) })
      .then(filteredValue => {
        expect(filteredValue).to.equal("  johnny  ");
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can sanitize a promise value", () => {
    const sanitizers = SanitizeAll(mockSanitizeAll);
    return sanitizers
      .apply({ value: mockPromiseValue, effect: fakeEffect({}) })
      .then(filteredValue => {
        expect(filteredValue).to.equal("JOHNNY");
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });
});
