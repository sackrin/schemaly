import { expect } from 'chai';
import DenyPolicy, { Deny } from '../Deny';

describe('Policy/Deny', (): void => {
  it('can have simple roles, scope and options added', () => {
    const denyRule: Deny = DenyPolicy({
      roles: ['user', 'admin'],
      scope: ['read', 'write'],
      options: { test: true },
    });
    expect(denyRule.roles).to.deep.equal(['user', 'admin']);
    expect(denyRule.scope).to.deep.equal(['read', 'write']);
    expect(denyRule.options).to.deep.equal({ test: true });
  });

  it('can have simple non array roles and scope added', () => {
    const denyRule: Deny = DenyPolicy({ roles: 'user', scope: 'read' });
    expect(denyRule.roles).to.deep.equal(['user']);
    expect(denyRule.scope).to.deep.equal(['read']);
  });

  it('can perform a simple grant request and fail', () => {
    const denyRule: Deny = DenyPolicy({ roles: ['user'], scope: ['read'] });
    const result = denyRule.grant({ roles: ['user'], scope: ['read'] });
    expect(result).to.deep.equal(false);
  });

  it('can throw exception if no scope or roles are passed', () => {
    expect(() => {
      DenyPolicy({ roles: [], scope: [] });
    }).to.throw('POLICY_NEEDS_SCOPE_AND_ROLES');
  });

  it('can perform a simple grant request and pass for mismatch role', () => {
    const denyRule: Deny = DenyPolicy({ roles: ['user'], scope: ['read'] });
    const result = denyRule.grant({ roles: ['admin'], scope: ['read'] });
    expect(result).to.deep.equal(true);
  });

  it('can perform a simple grant request and pass for mismatch scope', () => {
    const denyRule: Deny = DenyPolicy({ roles: ['user'], scope: ['read'] });
    const result = denyRule.grant({ roles: ['user'], scope: ['write'] });
    expect(result).to.deep.equal(true);
  });

  it('can perform a grant request with valid and invalid scope/roles and fail', () => {
    const denyRule: Deny = DenyPolicy({ roles: ['user'], scope: ['read'] });
    const result = denyRule.grant({
      roles: ['user', 'admin'],
      scope: ['read', 'write'],
    });
    expect(result).to.deep.equal(false);
  });

  it('can perform a grant with wildcard scope and role rules', () => {
    const denyRule: Deny = DenyPolicy({ roles: ['*'], scope: ['*'] });
    const result = denyRule.grant({ roles: ['user'], scope: ['read'] });
    expect(result).to.deep.equal(false);
  });
});
