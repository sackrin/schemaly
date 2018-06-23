import assert from 'assert';
import Allow from '../Allow';
import { Isotope } from '../../index';

describe('Allow Policy', function () {
  const isotope = Isotope({});

  it('can have simple roles and scope added', () => {
    const allowRule = Allow({ roles: ['user', 'admin'], scope: ['read', 'write'], test: true });
    assert.deepEqual(allowRule.roles, ['user', 'admin']);
    assert.deepEqual(allowRule.scope, ['read', 'write']);
    assert.deepEqual(allowRule.options, { test: true });
  });

  it('can have simple non array roles and scope added', () => {
    const allowRule = Allow({ roles: 'user', scope: 'read', test: true });
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
    const allowRule = Allow({ roles: [rolesPromise], scope: [scopePromise] });
    assert.deepEqual(allowRule.roles, [rolesPromise]);
    assert.deepEqual(allowRule.scope, [scopePromise]);
  });

  it('retrieve a list of roles with both static and promise roles', () => {
    const rolesPromise = () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['user', 'admin']);
    }));
    const scopePromise = () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['read', 'write']);
    }));
    const allowRule = Allow({ roles: [rolesPromise, 'handler'], scope: [scopePromise, 'blocked'] });
    return allowRule.getRoles()
      .then(roles => {
        assert.deepEqual(roles, ['user', 'admin', 'handler']);
      })
      .then(allowRule.getScope)
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
    const allowRule = Allow({ roles: [rolesPromise, 'handler'], scope: [scopePromise, 'blocked'], inject: ['test'] });
    return allowRule.getRoles()
      .then(roles => {
        assert.deepEqual(roles, ['user', 'admin', 'test', 'handler']);
      })
      .then(allowRule.getScope)
      .then(scope => {
        assert.deepEqual(scope, ['read', 'write', 'test', 'blocked']);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('can perform a simple grant request and pass', () => {
    const allowRule = Allow({ roles: ['user'], scope: ['read'] });
    return allowRule.grant({ isotope, roles: ['user'], scope: ['read'] })
      .then((result) => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('can perform a simple grant request and fail for mismatch role', () => {
    const allowRule = Allow({ roles: ['user'], scope: ['read'] });
    return allowRule.grant({ isotope, roles: ['admin'], scope: ['read'] })
      .then((result) => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('can perform a simple grant request and fail for mismatch scope', () => {
    const allowRule = Allow({ roles: ['user'], scope: ['read'] });
    return allowRule.grant({ isotope, roles: ['user'], scope: ['write'] })
      .then((result) => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('can perform a grant request with valid and invalid scope/roles and pass', () => {
    const allowRule = Allow({ roles: ['user'], scope: ['read'] });
    return allowRule.grant({ isotope, roles: ['user', 'admin'], scope: ['read', 'write'] })
      .then((result) => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error(msg); });
  });

  it('can perform a grant with wildcard scope and role rules', () => {
    const allowRule = Allow({ roles: ['*'], scope: ['*'] });
    return allowRule.grant({ isotope, roles: ['user'], scope: ['read'] })
      .then((result) => {
        assert.equal(result, true);
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
    const allowRule = Allow({ roles: ['user', 'admin'], scope: ['read', 'write'] });
    return allowRule.grant({ isotope, roles: ['user', rolesPromise], scope: ['read', scopePromise] })
      .then((result) => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error(msg); });
  });
});
