import _ from 'lodash';

export type BuildRulesFn = typeof buildRules;

export type BuiltRules = Array<string>;

export async function buildRules (rules: Array<string | Function>, options: Object = {}): Promise<BuiltRules> {
  return _.reduce(rules, async (collect: Promise<BuiltRules>, rule: any) => {
    const builtCollect = await collect;
    return !_.isFunction(rule) ? [...builtCollect, rule] : [...builtCollect, ...await rule(options)];
  }, Promise.all([]));
}
