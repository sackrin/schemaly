import { Blueprint, PolyType } from '../Types';
import { Model } from '../../Model/Types';

const isContainer = (blueprint: Model | Blueprint | PolyType) => {
  const context = (blueprint as Blueprint).context;
  return context !== undefined ? context.children && !context.repeater : false;
};

export default isContainer;
