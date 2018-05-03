import assert from 'assert';
import { Deny } from './Deny';

describe('Deny Policy', function () {
  it('can have simple roles and scope added', () => {
    const denyRule = new Deny(['user', 'admin'], ['read', 'write']);
    assert.deepEqual(denyRule.roles, ['user', 'admin']);
    assert.deepEqual(denyRule.scope, ['read', 'write']);
  });

  it('can have promise roles and scope added', () => {
    const rolesPromise = new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['user', 'admin']);
    });
    const scopePromise = new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['read', 'write']);
    });
    const denyRule = new Deny([rolesPromise], [scopePromise]);
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
    const denyRule = new Deny([rolesPromise, 'handler'], [scopePromise, 'blocked']);
    return denyRule.getRoles()
      .then(roles => {
        assert.deepEqual(roles, ['user', 'admin', 'handler']);
      })
      .then(denyRule.getScope)
      .then(scope => {
        assert.deepEqual(scope, ['read', 'write', 'blocked']);
      })
      .catch((msg) => { throw new Error('Was not supposed to pass'); });
  });

  it('can perform a simple grant request and fail', () => {
    const denyRule = new Deny(['user'], ['read']);
    return denyRule.grant(['user'], ['read'])
      .then((result) => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error('Was not supposed to pass'); });
  });

  it('can perform a simple grant request and pass for mismatch role', () => {
    const denyRule = new Deny(['user'], ['read']);
    return denyRule.grant(['admin'], ['read'])
      .then((result) => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error('Was not supposed to fail'); });
  });

  it('can perform a simple grant request and pass for mismatch scope', () => {
    const denyRule = new Deny(['user'], ['read']);
    return denyRule.grant(['user'], ['write'])
      .then((result) => {
        assert.equal(result, true);
      })
      .catch((msg) => { throw new Error('Was not supposed to pass'); });
  });

  it('can perform a grant request with valid and invalid scope/roles and fail', () => {
    const denyRule = new Deny(['user'], ['read']);
    return denyRule.grant(['user', 'admin'], ['read', 'write'])
      .then((result) => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error('Was not supposed to fail'); });
  });

  it('can perform a grant with wildcard scope and role rules', () => {
    const denyRule = new Deny(['*'], ['*']);
    return denyRule.grant(['user'], ['read'])
      .then((result) => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error('Was not supposed to pass'); });
  });

  it('can perform a grant request with promise and simple scope/rules', () => {
    const rolesPromise = () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['user']);
    }));
    const scopePromise = () => (new Promise(function (resolve, reject) {
      setTimeout(resolve, 100, ['read', 'write']);
    }));
    const denyRule = new Deny(['user', 'admin'], ['read', 'write']);
    return denyRule.grant(['user', rolesPromise], ['read', scopePromise])
      .then((result) => {
        assert.equal(result, false);
      })
      .catch((msg) => { throw new Error('Was not supposed to pass'); });
  });
});
