import _ from 'lodash';

export async function buildRoles (roles, options = {}) {
  return _.reduce(roles, async (collect, role) => {
    const builtCollect = await collect;
    return !_.isFunction(role) ? [...builtCollect, role] : [...builtCollect, ...await role(options)];
  }, Promise.all([]));
}

export async function buildScope (scope, options = {}) {
  return _.reduce(scope, async (collect, scope) => {
    const builtCollect = await collect;
    return !_.isFunction(scope) ? [...builtCollect, scope] : [...builtCollect, ...await scope(options)];
  }, Promise.all([]));
}
