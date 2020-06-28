import { ValidatorResult } from '../Types';

type GetFlattenedValidated = (
  validated: { [s: string]: ValidatorResult },
  path: string,
  flattened: { [s: string]: ValidatorResult | { [s: string]: ValidatorResult } }
) => { [key: string]: ValidatorResult | { [s: string]: ValidatorResult } };

const getFlattenedValidated: GetFlattenedValidated = (
  validated,
  path,
  flattened
) => {
  return Object.values(validated).reduce((curr, validate) => {
    const flat = { ...curr, [path + validate.machine]: validate };
    if (
      validate.context &&
      validate.context.children &&
      validate.context.repeater
    ) {
      return validate.children.reduce((_curr, _validate, idx) => {
        const _flat = {
          ..._curr,
          [`${path}${validate.machine}[${idx}]`]: _validate,
        };
        return getFlattenedValidated(
          _validate,
          `${path}${validate.machine}[${idx}].`,
          _flat
        );
      }, flat);
    } else if (validate.context && validate.context.children) {
      return validate.children.reduce((_curr, _validate) => {
        return getFlattenedValidated(
          _validate,
          `${path}${validate.machine}.`,
          _curr
        );
      }, flat);
    } else {
      return flat;
    }
  }, flattened);
};

export default getFlattenedValidated;
