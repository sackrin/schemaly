import _ from 'lodash';

export type BuildRolesFn = typeof buildRoles;

export type BuiltRoles = Array<string>;

export async function buildRoles (roles: Array<string | Function>, options: Object = {}): Promise<BuiltRoles> {
  return _.reduce(roles, async (collect: Promise<BuiltRoles>, role: any) => {
    const builtCollect = await collect;
    return !_.isFunction(role) ? [...builtCollect, role] : [...builtCollect, ...await role(options)];
  }, Promise.all([]));
}

export type BuildScopeFn = typeof buildRoles;

export type BuiltScope = Array<string>;

export async function buildScope (scope: Array<string | Function>, options: Object = {}): Promise<BuiltScope> {
  return _.reduce(scope, async (collect: Promise<BuiltScope>, scope: any) => {
    const builtCollect = await collect;
    return !_.isFunction(scope) ? [...builtCollect, scope] : [...builtCollect, ...await scope(options)];
  }, Promise.all([]));
}
