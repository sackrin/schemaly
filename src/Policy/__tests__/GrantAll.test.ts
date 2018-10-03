import { expect } from "chai";
import { GrantAll, DenyPolicy, AllowPolicy } from "../";

describe("Policy/GrantAll", (): void => {
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
        "member",
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
    const policyGroup = GrantAll(simplePolicies);
    expect(policyGroup.policies).to.deep.equal(simplePolicies);
  });

  it("perform a pass grant test with no policies", () => {
    const policyGroup = GrantAll([]);
    return policyGroup
      .grant({ roles: ["user"], scope: ["write"] })
      .then(result => {
        expect(result).to.equal(true);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("perform a simple pass grant", () => {
    const policyGroup = GrantAll(simplePolicies);
    return policyGroup
      .grant({ roles: ["user"], scope: ["write"] })
      .then(result => {
        expect(result).to.equal(true);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("perform a mixed pass grant", () => {
    const policyGroup = GrantAll(complexPolicies);
    return policyGroup
      .grant({ roles: ["user"], scope: ["write"] })
      .then(result => {
        expect(result).to.equal(true);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("perform a simple denied grant", () => {
    const policyGroup = GrantAll(simplePolicies);
    return policyGroup
      .grant({ roles: ["member"], scope: ["write"] })
      .then(result => {
        expect(result).to.equal(false);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });

  it("perform a mixed denied grant", () => {
    const policyGroup = GrantAll(complexPolicies);
    return policyGroup
      .grant({ roles: ["member"], scope: ["write"] })
      .then(result => {
        expect(result).to.equal(false);
      })
      .catch(msg => {
        throw new Error(msg);
      });
  });
});
