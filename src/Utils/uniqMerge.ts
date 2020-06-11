import _ from "lodash";

export const uniqMerge = (
  original: any,
  updated: any,
  ids: string[] = ["id"]
) => {
  const cloned: any = { ...original };
  Object.entries(updated).forEach(item => {
    const mergeValue: any = item[1];
    const originalValue: any = original[item[0]];
    if (_.isPlainObject(mergeValue)) {
      cloned[item[0]] = uniqMerge(originalValue, mergeValue);
    } else if (_.isArray(mergeValue)) {
      const addedOrUpdated = mergeValue.map(child => {
        const existing = _.find(originalValue, itm => {
          return ids.reduce(
            // @ts-ignore
            (curr, id) => (itm[id] === child[id] ? true : curr),
            false
          );
        });
        return uniqMerge(existing || {}, child);
      });
      const filtered = _.filter(originalValue, child => {
        return !_.find(addedOrUpdated, itm => {
          return ids.reduce(
            // @ts-ignore
            (curr, id) => (itm[id] === child[id] ? true : curr),
            false
          );
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
