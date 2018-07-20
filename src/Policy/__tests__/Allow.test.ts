import { expect } from "chai";
import { Hydrate } from "../../Effect";
import AllowPolicy, { Allow } from "../Allow";
import { Collision } from "../../Interact";
import { Field, Fields, STRING } from "../../Blueprint";
import { Schema } from "../../Model";

describe("Policy/Allow", (): void => {
  const fakeModel = Schema({
    machine: "test",
    roles: ["user", "admin"],
    scope: ["read", "write"],
    blueprints: Fields([Field({ machine: "first_name", context: STRING })])
  });

  const effect = Hydrate({
    collider: Collision({
      model: fakeModel,
      roles: ["user", "admin"],
      scope: ["read", "write"]
    }),
    blueprint: fakeModel.blueprints.blueprints[0],
    value: "John"
  });

  it("can have simple roles and scope added", () => {
    const allowRule: Allow = AllowPolicy({
      roles: ["user", "admin"],
      scope: ["read", "write"],
      options: { test: true }
    });
    expect(allowRule.roles).to.deep.equal(["user", "admin"]);
    expect(allowRule.scope).to.deep.equal(["read", "write"]);
    expect(allowRule.options).to.deep.equal({ test: true });
  });

  it("can have simple non array roles and scope added", () => {
    const allowRule: Allow = AllowPolicy({ roles: "user", scope: "read" });
    expect(allowRule.roles).to.deep.equal(["user"]);
    expect(allowRule.scope).to.deep.equal(["read"]);
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
    const allowRule: Allow = AllowPolicy({
      roles: [rolesPromise],
      scope: [scopePromise]
    });
    expect(allowRule.roles).to.deep.equal([rolesPromise]);
    expect(allowRule.scope).to.deep.equal([scopePromise]);
  });

  it("retrieve a list of roles with both static and promise roles", () => {
    const rolesPromise = (): Promise<void> =>
      new Promise((resolve, reject) => {
        setTimeout(resolve, 100, ["user", "admin"]);
      });
    const scopePromise = (): Promise<void> =>
      new Promise((resolve, reject) => {
        setTimeout(resolve, 100, ["read", "write"]);
      });
    const allowRule: Allow = AllowPolicy({
      roles: [rolesPromise, "handler"],
      scope: [scopePromise, "blocked"]
    });
    return allowRule
      .getRoles()
      .then((roles: string[]) => {
        expect(roles).to.deep.equal(["user", "admin", "handler"]);
      })
      .then(() => allowRule.getScope())
      .then((scope: string[]) => {
        expect(scope).to.deep.equal(["read", "write", "blocked"]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("retrieve a list of roles with both static and promise roles with options", () => {
    const rolesPromise = (options: any): Promise<void> =>
      new Promise((resolve, reject) => {
        setTimeout(resolve, 100, ["user", "admin", ...options.inject]);
      });
    const scopePromise = (options: any): Promise<void> =>
      new Promise((resolve, reject) => {
        setTimeout(resolve, 100, ["read", "write", ...options.inject]);
      });
    const allowRule: Allow = AllowPolicy({
      roles: [rolesPromise, "handler"],
      scope: [scopePromise, "blocked"],
      options: { inject: ["test"] }
    });
    return allowRule
      .getRoles()
      .then((roles: string[]) => {
        expect(roles).to.deep.equal(["user", "admin", "test", "handler"]);
      })
      .then(() => allowRule.getScope())
      .then((scope: string[]) => {
        expect(scope).to.deep.equal(["read", "write", "test", "blocked"]);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can perform a simple grant request and pass", () => {
    const allowRule: Allow = AllowPolicy({ roles: ["user"], scope: ["read"] });
    return allowRule
      .grant({ effect, roles: ["user"], scope: ["read"] })
      .then(result => {
        expect(result).to.equal(true);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can throw exception if no scope or roles are passed", () => {
    expect(() => {
      AllowPolicy({ roles: [], scope: [] });
    }).to.throw('POLICY_NEEDS_SCOPE_AND_ROLES');
  });

  it("can perform a simple grant request and fail for mismatch role", () => {
    const allowRule: Allow = AllowPolicy({ roles: ["user"], scope: ["read"] });
    return allowRule
      .grant({ effect, roles: ["admin"], scope: ["read"] })
      .then(result => {
        expect(result).to.equal(false);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can perform a simple grant request and fail for mismatch scope", () => {
    const allowRule: Allow = AllowPolicy({ roles: ["user"], scope: ["read"] });
    return allowRule
      .grant({ effect, roles: ["user"], scope: ["write"] })
      .then(result => {
        expect(result).to.equal(false);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can perform a grant request with valid and invalid scope/roles and pass", () => {
    const allowRule: Allow = AllowPolicy({ roles: ["user"], scope: ["read"] });
    return allowRule
      .grant({ effect, roles: ["user", "admin"], scope: ["read", "write"] })
      .then(result => {
        expect(result).to.equal(true);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("can perform a grant with wildcard scope and role rules", () => {
    const allowRule: Allow = AllowPolicy({ roles: ["*"], scope: ["*"] });
    return allowRule
      .grant({ effect, roles: ["user"], scope: ["read"] })
      .then(result => {
        expect(result).to.equal(true);
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
    const allowRule: Allow = AllowPolicy({
      roles: ["user", "admin"],
      scope: ["read", "write"]
    });
    return allowRule
      .grant({
        effect,
        roles: ["user", rolesPromise],
        scope: ["read", scopePromise]
      })
      .then(result => {
        expect(result).to.equal(true);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });
});
