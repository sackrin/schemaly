import assert from 'assert';
import { buildRoles, buildScope } from '../utils';

describe('Policy Utils', function () {
  const rolesPromise = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, ['admin', 'member']);
  }));

  const rolesOptionsPromise = (options) => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, ['admin', 'member', ...options.inject]);
  }));

  const scopePromise = () => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, ['delete', 'update']);
  }));

  const scopeOptionsPromise = (options) => (new Promise(function (resolve, reject) {
    setTimeout(resolve, 100, ['delete', 'update', ...options.inject]);
  }));

  it('A simple list of roles can be passed and returned', () => {
    const roles = ['user', 'guest'];
    return buildRoles(roles).then(builtRoles => {
      assert.deepEqual(builtRoles, roles);
    });
  });

  it('A mixed list of roles can be passed and returned built', () => {
    const roles = ['user', 'guest', rolesPromise];
    const expectedRoles = ['user', 'guest', 'admin', 'member'];
    return buildRoles(roles).then(builtRoles => {
      assert.deepEqual(builtRoles, expectedRoles);
    });
  });

  it('A mixed list of roles with options can be passed and returned built', () => {
    const roles = ['user', 'guest', rolesOptionsPromise];
    const expectedRoles = ['user', 'guest', 'admin', 'member', 'newbie'];
    return buildRoles(roles, { inject: ['newbie'] }).then(builtRoles => {
      assert.deepEqual(builtRoles, expectedRoles);
    });
  });

  it('A simple list of scope can be passed and returned', () => {
    const scope = ['write', 'read'];
    return buildScope(scope).then(builtScope => {
      assert.deepEqual(builtScope, scope);
    });
  });

  it('A mixed list of scope can be passed and returned built', () => {
    const scope = ['write', 'read', scopePromise];
    const expectedScope = ['write', 'read', 'delete', 'update'];
    return buildRoles(scope).then(builtScope => {
      assert.deepEqual(builtScope, expectedScope);
    });
  });

  it('A mixed list of scope with options can be passed and returned built', () => {
    const scope = ['write', 'read', scopeOptionsPromise];
    const expectedScope = ['write', 'read', 'delete', 'update', 'view'];
    return buildRoles(scope, { inject: ['view'] }).then(builtScope => {
      assert.deepEqual(builtScope, expectedScope);
    });
  });
});
