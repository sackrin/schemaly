import _ from 'lodash';

export async function getMixedResult (values, options = {}) {
  return _.reduce(values, async (collect, value) => {
    const builtCollect = await collect;
    return !_.isFunction(value) ? [...builtCollect, value] : [...builtCollect, ...await value(options)];
  }, Promise.all([]));
}

export default getMixedResult;
