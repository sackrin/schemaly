import _ from 'lodash';
import { Polymorphic, Variation } from './Types';
import Blueprints from "./Types/Blueprints";

export class Poly implements Polymorphic {

  public variations: Variation[] = [];

  public options: any;

  constructor(options: any = {}) {
    this.options = options;
  }

  public variation = ({ blueprints, matchers }: Variation): this => {
    this.variations.push({
      blueprints,
      matchers
    });
    return this;
  };

  public resolve = (values: any): undefined | Blueprints => {
    return this.variations.reduce((curr: Blueprints | undefined, possibility) => {
      const { matchers, blueprints } = possibility;
      const decide = _.isFunction(matchers) ? matchers(values) : this.properties(matchers, values) ;
      return decide ? blueprints : curr;
    }, undefined);
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
