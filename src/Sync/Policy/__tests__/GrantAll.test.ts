import { expect } from 'chai';
import { GrantAll, DenyPolicy, AllowPolicy } from '../';

describe('Policy/GrantAll', (): void => {
  const simplePolicies = [
    DenyPolicy({ roles: ['member'], scope: ['read', 'write'] }),
    AllowPolicy({ roles: ['user', 'admin'], scope: ['read', 'write'] }),
  ];

  it('can be created and have policies added to it', () => {
    const policyGroup = GrantAll(simplePolicies);
    expect(policyGroup.policies).to.deep.equal(simplePolicies);
  });

  it('perform a pass grant test with no policies', () => {
    const policyGroup = GrantAll([]);
    const result = policyGroup.grant({ roles: ['user'], scope: ['write'] });
    expect(result).to.equal(true);
  });

  it('perform a simple pass grant', () => {
    const policyGroup = GrantAll(simplePolicies);
    const result = policyGroup.grant({ roles: ['user'], scope: ['write'] });
    expect(result).to.equal(true);
  });

  it('perform a simple denied grant', () => {
    const policyGroup = GrantAll(simplePolicies);
    const result = policyGroup.grant({ roles: ['member'], scope: ['write'] });
    expect(result).to.equal(false);
  });
});
