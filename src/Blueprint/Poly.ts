import _ from 'lodash';
import { Blueprint, Polymorphic, PolyType } from './Types';
import Blueprints from './Types/Blueprints';
import Fields from './Fields';

export class Poly implements Polymorphic {
  public types: PolyType[] = [];

  public parent?: Blueprint;

  public options: any;

  constructor(options: any = {}) {
    this.options = options;
  }

  public setParent = (parent: Blueprint): void => {
    this.parent = parent;
  };

  public type = ({
    machine,
    blueprints,
    matchers,
    ...options
  }: PolyType): this => {
    this.types.push({
      machine,
      blueprints,
      matchers,
      options
    });
    return this;
  };

  public or = ({
    machine,
    blueprints,
    matchers,
    ...options
  }: PolyType): this => {
    return this.type({
      machine,
      blueprints,
      matchers,
      options
    });
  };

  public resolve = (values: any): Blueprints => {
    return this.types.reduce((curr: Blueprints, possibility) => {
      const { matchers, blueprints } = possibility;
      const decide = _.isFunction(matchers)
        ? matchers(values)
        : this.properties(matchers, values);
      return decide ? blueprints : curr;
    }, Fields([]));
  };

  public properties = (matchers: any, values: any): boolean => {
    if (matchers.reduce.length === 0) {
      return false;
    }
    return matchers.reduce((curr: boolean, pair: any) => {
      if (pair.length === 1) {
        return values[pair[0]] !== undefined ? curr : false;
      } else {
        return values[pair[0]] !== undefined && values[pair[0]] === pair[1]
          ? curr
          : false;
      }
    }, true);
  };
}

export default (options: any = {}): Poly => new Poly(options);
