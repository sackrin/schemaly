import _ from 'lodash';

export async function buildRules (rules, options = {}) {
  return _.reduce(rules, async (collect, rule) => {
    const builtCollect = await collect;
    return !_.isFunction(rule) ? [...builtCollect, rule] : [...builtCollect, ...await rule(options)];
  }, Promise.all([]));
}
