import Effect from '../Types/Effect';
import Effects from '../Types/Effects';

type GetFlattenedEffects = (
  hydrates: Effects,
  path: string,
  flattened: { [key: string]: Effect | Effects }
) => { [key: string]: Effect | Effects };

const getFlattenedEffects: GetFlattenedEffects = (
  hydrates,
  path,
  flattened = {}
) => {
  return (hydrates.effects || []).reduce((curr, hydrate) => {
    const flat = { ...curr, [path + hydrate.machine]: hydrate };
    if (hydrate.context.children && hydrate.context.repeater) {
      return hydrate.getChildren().reduce((_curr, _hydrates, idx) => {
        const _flat = { ..._curr, [`${path}${hydrate.machine}[${idx}]`]: _hydrates };
        return getFlattenedEffects(
          _hydrates,
          `${path}${hydrate.machine}[${idx}].`,
          _flat
        );
      }, flat);
    } else if (hydrate.context.children) {
      return hydrate.getChildren().reduce((_curr, _hydrates) => {
        return getFlattenedEffects(
          _hydrates,
          `${path}${hydrate.machine}.`,
          _curr
        );
      }, flat);
    } else {
      return flat;
    }
  }, flattened);
};

export default getFlattenedEffects;
