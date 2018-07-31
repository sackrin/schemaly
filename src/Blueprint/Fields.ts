import { Blueprints, Blueprint, BlueprintsArgs, BlueprintsType } from "./Types";

/**
 * Contains multiple Field instances
 */
export class Fields implements Blueprints {
  public blueprints: BlueprintsType = [];

  public parent?: Blueprint;

  public options: any = {};

  /**
   * @param {BlueprintsType} blueprints
   * @param {Blueprint} parent
   * @param {any} options
   */
  constructor({ blueprints, parent, options = {} }: BlueprintsArgs) {
    this.blueprints = blueprints;
    this.parent = parent;
    this.options = options;
  }

  public setParent = (parent: Blueprint): void => {
    this.parent = parent;
  };

  public all = (): BlueprintsType => this.blueprints;

  public resolve = (values: any): this => (this);
}

/**
 * This is the typical way to create a new fields instance.
 * Should be used in favour of using the primary fields class
 * @param {BlueprintsType} blueprints
 * @param args
 * @returns {Fields}
 */
export default (blueprints: BlueprintsType, args: any = {}) =>
  new Fields({ blueprints, ...args });
