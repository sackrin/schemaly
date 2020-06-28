import { Blueprint, Polymorphic, PolyType } from '../Types';
import { Model } from '../../Model/Types';

const isPolymorphic = (blueprint: Model | Blueprint | PolyType) => {
  const blueprints = blueprint.blueprints as Polymorphic;
  return blueprints.types !== undefined;
};

export default isPolymorphic;
