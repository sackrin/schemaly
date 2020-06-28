import { Blueprint, PolyType } from '../Types';
import { Model } from '../../Model/Types';

const isRepeater = (blueprint: Model | Blueprint | PolyType) => {
  const context = (blueprint as Blueprint).context;
  return context !== undefined ? context.children && context.repeater : false;
};

export default isRepeater;
