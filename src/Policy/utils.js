import _ from 'lodash'

export async function buildRoles (roles, options = {}) {
  return _.reduce(roles, async (collect, role) => {
    return !_.isFunction(role) ? [...await collect, role] : [...collect, ...await role(options)]
  }, Promise.all([]))
}

export async function buildScope (scope, options = {}) {
  return _.reduce(scope, async (collect, scope) => {
    return !_.isFunction(scope) ? [...await collect, scope] : [...collect, ...await scope(options)]
  }, Promise.all([]))
}
