import assert from 'assert';
import Deny from '../Deny';
import { Isotope } from '../../Isotope';
import { expect } from 'chai';

describe('Deny Policy', function () {
  const isotope = Isotope({});

  it('can have simple roles, scope and options added', () => {
    const denyRule = Deny({ roles: ['user', 'admin'], scope: ['read', 'write'], test: true });
    assert.deepEqual(denyRule.roles, ['user', 'admin']);
    assert.deepEqual(denyRule.scope, ['read', 'write']);
    assert.deepEqual(denyRule.options, { test: true });
  });

  it('can have simple non array roles and scope added', () => {
    const allowRule = Deny({ roles: 'user', scope: 'read', test: true });
    assert.deepEqual(allowRule.roles, ['user']);
    assert.deepEqual(allowRule.scope, ['read']);
    assert.deepEqual(allowRule.options, { test: true });
  });

  it('can have promise roles and scope added', () => {
    const rolesPromise = new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['user', 'admin']);
    });
    const scopePromise = new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['read', 'write']);
    });
    const denyRule = Deny({ roles: [rolesPromise], scope: [scopePromise] });
    assert.deepEqual(denyRule.roles, [rolesPromise]);
    assert.deepEqual(denyRule.scope, [scopePromise]);
  });

  it('retrieve a list of roles with both static and promise roles', () => {
    const rolesPromise = () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['user', 'admin']);
    }));
    const scopePromise = () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['read', 'write']);
    }));
    const denyRule = Deny({ roles: [rolesPromise, 'handler'], scope: [scopePromise, 'blocked'] });
    return denyRule.getRoles()
      .then(roles => {
        assert.deepEqual(roles, ['user', 'admin', 'handler']);
      })
      .then(denyRule.getScope)
      .then(scope => {
        assert.deepEqual(scope, ['read', 'write', 'blocked']);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('retrieve a list of roles with both static and promise roles with options', () => {
    const rolesPromise = (options) => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['user', 'admin', ...options.policy.inject]);
    }));
    const scopePromise = (options) => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['read', 'write', ...options.policy.inject]);
    }));
    const denyRule = Deny({ roles: [rolesPromise, 'handler'], scope: [scopePromise, 'blocked'], inject: ['test'] });
    return denyRule.getRoles()
      .then(roles => {
        assert.deepEqual(roles, ['user', 'admin', 'test', 'handler']);
      })
      .then(denyRule.getScope)
      .then(scope => {
        assert.deepEqual(scope, ['read', 'write', 'test', 'blocked']);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('can perform a simple grant request and fail', () => {
    const denyRule = Deny({ roles: ['user'], scope: ['read'] });
    return denyRule.grant({ isotope, roles: ['user'], scope: ['read'] })
      .then((result) => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('can perform a simple grant request and pass for mismatch role', () => {
    const denyRule = Deny({ roles: ['user'], scope: ['read'] });
    return denyRule.grant({ isotope, roles: ['admin'], scope: ['read'] })
      .then((result) => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('can perform a simple grant request and pass for mismatch scope', () => {
    const denyRule = Deny({ roles: ['user'], scope: ['read'] });
    return denyRule.grant({ isotope, roles: ['user'], scope: ['write'] })
      .then((result) => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('can perform a grant request with valid and invalid scope/roles and fail', () => {
    const denyRule = Deny({ roles: ['user'], scope: ['read'] });
    return denyRule.grant({ isotope, roles: ['user', 'admin'], scope: ['read', 'write'] })
      .then((result) => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('can perform a grant with wildcard scope and role rules', () => {
    const denyRule = Deny({ roles: ['*'], scope: ['*'] });
    return denyRule.grant({ isotope, roles: ['user'], scope: ['read'] })
      .then((result) => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('can perform a grant request with promise and simple scope/rules', () => {
    const rolesPromise = () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['user']);
    }));
    const scopePromise = () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['read', 'write']);
    }));
    const denyRule = Deny({ roles: ['user', 'admin'], scope: ['read', 'write'] });
    return denyRule.grant({ isotope, roles: ['user', rolesPromise], scope: ['read', scopePromise] })
      .then((result) => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error(msg); });
  });
});
