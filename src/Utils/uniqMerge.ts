import _ from 'lodash';

export const uniqMerge = (original, updated, ids = ['id']) => {
  const cloned = { ...original };
  Object.entries(updated).forEach((item) => {
    const mergeValue = item[1];
    const originalValue = original[item[0]];
    if (_.isPlainObject(mergeValue)) {
      cloned[item[0]] = uniqMerge(originalValue, mergeValue);
    } else if (_.isArray(mergeValue)) {
      const addedOrUpdated = mergeValue.map((child) => {
        const existing = _.find(originalValue, (itm) => {
          return ids.reduce((curr, id) => (itm[id] === child[id] ? true : curr), false);
        });
        return uniqMerge(existing || {}, child);
      });
      const filtered = _.filter(originalValue, (child) => {
        return !_.find(addedOrUpdated, (itm) => {
          return ids.reduce((curr, id) => (itm[id] === child[id] ? true : curr), false);
        });
      });
      cloned[item[0]] = [...filtered, ...addedOrUpdated];
    } else {
      cloned[item[0]] = mergeValue;
    }
  });
  return cloned;
};

export default uniqMerge;
