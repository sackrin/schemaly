import { Condition, Conditions } from './Types';
import { Collider } from '../Interact/Types';
import { Blueprint } from '../Blueprint/Types';
import { Effect } from '../Effect/Types';

/**
 * Contains conditions and returns true only if --> ALL <-- conditions return true
 * To be used when defining conditions for a blueprint
 */
export class LookForAll implements Conditions {
  public conditions: Condition[] = [];

  public options: any = {};

  /**
   * @param conditions
   * @param options
   */
  constructor({
    conditions,
    options = {},
  }: {
    conditions: Condition[];
    options?: any;
  }) {
    this.conditions = conditions;
    this.options = options;
  }

  /**
   * Check all provided conditions
   * Check that ALL pass in order to return true
   * @param collider
   * @param blueprint
   * @param hydrate
   * @param options
   */
  public check = async ({
    collider,
    blueprint,
    hydrate,
    ...options
  }: {
    collider: Collider;
    blueprint: Blueprint;
    hydrate: Effect;
    options?: any;
  }): Promise<boolean> => {
    // If there are no conditions return truthy
    if (this.conditions.length === 0) {
      return true;
    }
    // Loop through each of the conditions
    // For this check we want to ensure ALL conditions pass
    return this.conditions.reduce(async (curr, condition) => {
      const _curr = await curr;
      // Check the condition and wait for a response
      const result = await condition.check({
        collider,
        blueprint,
        hydrate,
        options,
      });
      // If the result was false, return false otherwise allow current
      return !result ? false : _curr;
    }, Promise.resolve(true));
  };
}

/**
 * This is the typical way to create a new conditions group.
 * Should be used in favour of using the primary condition group class
 * @param conditions
 * @param options
 */
export default (conditions: Condition[], options: any = {}) =>
  new LookForAll({ conditions, options });
