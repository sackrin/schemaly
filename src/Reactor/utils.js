import _ from 'lodash';

export const uniqMerge = (original, updated, ids = ['id']) => {
  const cloned = { ...original };
  Object.entries(updated).forEach((item) => {
    const mergeValue = item[1];
    const originalValue = original[item[0]];
    // if this is a standard object
    if (_.isPlainObject(mergeValue)) {
      cloned[item[0]] = uniqMerge(originalValue, mergeValue);
    // otherwise if this is an array
    } else if (_.isArray(mergeValue)) {
      const addedOrUpdated = _.map(mergeValue, (child) => {
        const existing = _.find(originalValue, (itm) => {
          return ids.reduce((curr, id) => (itm[id] === child[id] ? true : curr), false);
        });
        return uniqMerge(existing ? existing : {}, child);
      });

      const filtered = _.filter(originalValue, (child) => {
        const existing = _.find(addedOrUpdated, (itm) => {
          return ids.reduce((curr, id) => (itm[id] === child[id] ? true : curr), false);
        });
        return !existing;
      });
      console.log(filtered);
      cloned[item[0]] = [...filtered, ...addedOrUpdated];
    // otherwise just yeah
    } else {
      cloned[item[0]] = mergeValue;
    }
  });
  return cloned;
};

export const uniqMergeCollection = () => {};
