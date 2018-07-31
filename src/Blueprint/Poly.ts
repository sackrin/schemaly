import _ from 'lodash';
import {Blueprint, Polymorphic, Variation} from './Types';
import Blueprints from "./Types/Blueprints";
import Fields from "./Fields";

export class Poly implements Polymorphic {

  public variations: Variation[] = [];

  public parent?: Blueprint;

  public options: any;

  constructor(options: any = {}) {
    this.options = options;
  }

  public setParent = (parent: Blueprint): void => {
    this.parent = parent;
  };

  public variation = ({ blueprints, matchers }: Variation): this => {
    this.variations.push({
      blueprints,
      matchers
    });
    return this;
  };

  public resolve = (values: any): Blueprints => {
    return this.variations.reduce((curr: Blueprints, possibility) => {
      const { matchers, blueprints } = possibility;
      const decide = _.isFunction(matchers) ? matchers(values) : this.properties(matchers, values) ;
      return decide ? blueprints : curr;
    }, Fields([]));
  };

  public properties = (matchers: any, values: any): boolean => {
    if (matchers.reduce.length === 0) { return false; }
    return matchers.reduce((curr: boolean, pair: any) => {
      if (pair.length === 1) {
        return values[pair[0]] !== undefined ? curr : false;
      } else {
        return values[pair[0]] !== undefined && values[pair[0]] === pair[1] ? curr : false;
      }
    }, true);
  };
}

export default (options: any = {}): Poly => (new Poly(options));
