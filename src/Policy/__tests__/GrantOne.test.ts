import { expect } from "chai";
import { Hydrate } from "../../Isotope";
import { GrantOne, DenyPolicy, AllowPolicy } from "../";
import { Schema } from "../../Atom";
import { Field, Fields } from "../../Nucleus";
import STRING from "../../Nucleus/Context/STRING";
import { Reaction } from "../../Reactor";

describe("Policy/GrantOne", (): void => {
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

  const simplePolicies = [
    DenyPolicy({ roles: ["member"], scope: ["read", "write"] }),
    AllowPolicy({ roles: ["user", "admin"], scope: ["read", "write"] })
  ];

  const complexPolicies = [
    DenyPolicy({
      roles: [
        () =>
          new Promise(resolve => {
            setTimeout(resolve, 100, ["member"]);
          })
      ],
      scope: [
        () =>
          new Promise(resolve => {
            setTimeout(resolve, 100, ["read", "write"]);
          })
      ]
    }),
    AllowPolicy({
      roles: [
        () =>
          new Promise(resolve => {
            setTimeout(resolve, 100, ["user", "admin"]);
          })
      ],
      scope: [
        "read",
        "write",
        () =>
          new Promise(resolve => {
            setTimeout(resolve, 100, ["read", "write"]);
          })
      ]
    })
  ];

  it("can be created and have policies added to it", () => {
    const policyGroup = GrantOne(simplePolicies);
    expect(policyGroup.policies).to.deep.equal(simplePolicies);
  });

  it("perform a pass grant test with no policies", () => {
    const policyGroup = GrantOne([]);
    return policyGroup
      .grant({ isotope, roles: ["user"], scope: ["write"] })
      .then(result => {
        expect(result).to.equal(true);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("perform a simple pass grant", () => {
    const policyGroup = GrantOne(simplePolicies);
    return policyGroup
      .grant({ isotope, roles: ["user"], scope: ["write"] })
      .then(result => {
        expect(result).to.equal(true);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("perform a mixed pass grant", () => {
    const policyGroup = GrantOne(complexPolicies);
    return policyGroup
      .grant({ isotope, roles: ["user"], scope: ["write"] })
      .then(result => {
        expect(result).to.equal(true);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("perform a simple denied grant", () => {
    const policyGroup = GrantOne(simplePolicies);
    return policyGroup
      .grant({ isotope, roles: ["member"], scope: ["write"] })
      .then(result => {
        expect(result).to.equal(false);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("perform a mixed denied grant", () => {
    const policyGroup = GrantOne(complexPolicies);
    return policyGroup
      .grant({ isotope, roles: ["member"], scope: ["write"] })
      .then(result => {
        expect(result).to.equal(false);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });
});