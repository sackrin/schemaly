import { expect } from 'chai';
import AllowPolicy, { Allow } from '../Allow';

describe('Policy/Allow', (): void => {
  it('can have simple roles and scope added', () => {
    const allowRule: Allow = AllowPolicy({
      roles: ['user', 'admin'],
      scope: ['read', 'write'],
      options: { test: true },
    });
    expect(allowRule.roles).to.deep.equal(['user', 'admin']);
    expect(allowRule.scope).to.deep.equal(['read', 'write']);
    expect(allowRule.options).to.deep.equal({ test: true });
  });

  it('can have simple non array roles and scope added', () => {
    const allowRule: Allow = AllowPolicy({ roles: 'user', scope: 'read' });
    expect(allowRule.roles).to.deep.equal(['user']);
    expect(allowRule.scope).to.deep.equal(['read']);
  });

  it('can perform a simple grant request and pass', () => {
    const allowRule: Allow = AllowPolicy({ roles: ['user'], scope: ['read'] });
    const result = allowRule.grant({ roles: ['user'], scope: ['read'] });
    expect(result).to.equal(true);
  });

  it('can throw exception if no scope or roles are passed', () => {
    expect(() => {
      AllowPolicy({ roles: [], scope: [] });
    }).to.throw('POLICY_NEEDS_SCOPE_AND_ROLES');
  });

  it('can perform a simple grant request and fail for mismatch role', () => {
    const allowRule: Allow = AllowPolicy({ roles: ['user'], scope: ['read'] });
    const result = allowRule.grant({ roles: ['admin'], scope: ['read'] });
    expect(result).to.equal(false);
  });

  it('can perform a simple grant request and fail for mismatch scope', () => {
    const allowRule: Allow = AllowPolicy({ roles: ['user'], scope: ['read'] });
    const result = allowRule.grant({ roles: ['user'], scope: ['write'] });
    expect(result).to.equal(false);
  });

  it('can perform a grant request with valid and invalid scope/roles and pass', () => {
    const allowRule: Allow = AllowPolicy({ roles: ['user'], scope: ['read'] });
    const result = allowRule.grant({
      roles: ['user', 'admin'],
      scope: ['read', 'write'],
    });
    expect(result).to.equal(true);
  });

  it('can perform a grant with wildcard scope and role rules', () => {
    const allowRule: Allow = AllowPolicy({ roles: ['*'], scope: ['*'] });
    const result = allowRule.grant({ roles: ['user'], scope: ['read'] });
    expect(result).to.equal(true);
  });
});
