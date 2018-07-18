import { expect } from "chai";
import { Hydrate, Isotope } from "../../Isotope";
import DenyPolicy, { Deny } from "../Deny";
import { Schema } from "../../Atom";
import { Field, Fields, STRING } from "../../Nucleus";
import { Reaction } from "../../Reactor";

describe("Policy/Deny", (): void => {
  const fakeAtom = Schema({
    machine: "test",
    roles: ["user", "admin"],
    scope: ["read", "write"],
    nuclei: Fields([Field({ machine: "first_name", context: STRING })])
  });

  const isotope = Hydrate({
    reactor: Reaction({
      atom: fakeAtom,
      roles: ["user", "admin"],
      scope: ["read", "write"]
    }),
    nucleus: fakeAtom.nuclei.nuclei[0],
    value: "John"
  });

  it("can have simple roles, scope and options added", () => {
    const denyRule: Deny = DenyPolicy({
      roles: ["user", "admin"],
      scope: ["read", "write"],
      options: { test: true }
    });
    expect(denyRule.roles).to.deep.equal(["user", "admin"]);
    expect(denyRule.scope).to.deep.equal(["read", "write"]);
    expect(denyRule.options).to.deep.equal({ test: true });
  });

  it("can have simple non array roles and scope added", () => {
    const denyRule: Deny = DenyPolicy({ roles: "user", scope: "read" });
    expect(denyRule.roles).to.deep.equal(["user"]);
    expect(denyRule.scope).to.deep.equal(["read"]);
  });

  it("can have promise roles and scope added", () => {
    const rolesPromise = (): Promise<void> =>
      new Promise(resolve => {
        setTimeout(resolve, 100, ["user", "admin"]);
      });
    const scopePromise = (): Promise<void> =>
      new Promise(resolve => {
        setTimeout(resolve, 100, ["read", "write"]);
      });
    const denyRule: Deny = DenyPolicy({
      roles: [rolesPromise],
      scope: [scopePromise]
    });
    expect(denyRule.roles).to.deep.equal([rolesPromise]);
    expect(denyRule.scope).to.deep.equal([scopePromise]);
  });

  it("retrieve a list of roles with both static and promise roles", () => {
    const rolesPromise = (): Promise<void> =>
      new Promise(resolve => {
        setTimeout(resolve, 100, ["user", "admin"]);
      });
    const scopePromise = (): Promise<void> =>
      new Promise(resolve => {
        setTimeout(resolve, 100, ["read", "write"]);
      });
    const denyRule: Deny = DenyPolicy({
      roles: [rolesPromise, "handler"],
      scope: [scopePromise, "blocked"]
    });
    return denyRule
      .getRoles()
      .then(roles => {
        expect(roles).to.deep.equal(["user", "admin", "handler"]);
      })
      .then(() => denyRule.getScope())
      .then(scope => {
        expect(scope).to.deep.equal(["read", "write", "blocked"]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("retrieve a list of roles with both static and promise roles with options", () => {
    const rolesPromise = (options: any) =>
      new Promise(resolve => {
        setTimeout(resolve, 100, ["user", "admin", ...options.inject]);
      });
    const scopePromise = (options: any) =>
      new Promise(resolve => {
        setTimeout(resolve, 100, ["read", "write", ...options.inject]);
      });
    const denyRule: Deny = DenyPolicy({
      roles: [rolesPromise, "handler"],
      scope: [scopePromise, "blocked"],
      options: {
        inject: ["test"]
      }
    });
    return denyRule
      .getRoles()
      .then(roles => {
        expect(roles).to.deep.equal(["user", "admin", "test", "handler"]);
      })
      .then(() => denyRule.getScope())
      .then(scope => {
        expect(scope).to.deep.equal(["read", "write", "test", "blocked"]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can perform a simple grant request and fail", () => {
    const denyRule: Deny = DenyPolicy({ roles: ["user"], scope: ["read"] });
    return denyRule
      .grant({ isotope, roles: ["user"], scope: ["read"] })
      .then(result => {
        expect(result).to.deep.equal(false);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can perform a simple grant request and pass for mismatch role", () => {
    const denyRule: Deny = DenyPolicy({ roles: ["user"], scope: ["read"] });
    return denyRule
      .grant({ isotope, roles: ["admin"], scope: ["read"] })
      .then(result => {
        expect(result).to.deep.equal(true);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can perform a simple grant request and pass for mismatch scope", () => {
    const denyRule: Deny = DenyPolicy({ roles: ["user"], scope: ["read"] });
    return denyRule
      .grant({ isotope, roles: ["user"], scope: ["write"] })
      .then(result => {
        expect(result).to.deep.equal(true);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can perform a grant request with valid and invalid scope/roles and fail", () => {
    const denyRule: Deny = DenyPolicy({ roles: ["user"], scope: ["read"] });
    return denyRule
      .grant({ isotope, roles: ["user", "admin"], scope: ["read", "write"] })
      .then(result => {
        expect(result).to.deep.equal(false);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can perform a grant with wildcard scope and role rules", () => {
    const denyRule: Deny = DenyPolicy({ roles: ["*"], scope: ["*"] });
    return denyRule
      .grant({ isotope, roles: ["user"], scope: ["read"] })
      .then(result => {
        expect(result).to.deep.equal(false);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can perform a grant request with promise and simple scope/rules", () => {
    const rolesPromise = (): Promise<void> =>
      new Promise(resolve => {
        setTimeout(resolve, 100, ["user"]);
      });
    const scopePromise = (): Promise<void> =>
      new Promise(resolve => {
        setTimeout(resolve, 100, ["read", "write"]);
      });
    const denyRule: Deny = DenyPolicy({
      roles: ["user", "admin"],
      scope: ["read", "write"]
    });
    return denyRule
      .grant({
        isotope,
        roles: ["user", rolesPromise],
        scope: ["read", scopePromise]
      })
      .then(result => {
        expect(result).to.deep.equal(false);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });
});
