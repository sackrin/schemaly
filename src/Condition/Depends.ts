import _ from 'lodash';
import { Condition } from './Types';
import CheckType from './Types/CheckType';
import ChecksType from './Types/ChecksType';
import { Collider } from '../Interact/Types';
import { Blueprint } from '../Blueprint/Types';
import { Effect } from '../Effect/Types';

/**
 * Use this to describe a single condition for a property
 * ie new Depends({ checks: [ exampleConditionLogic ] })
 */
export class Depends implements Condition {
  public checks: ChecksType = [];

  public options: any = {};

  /**
   * @param checks
   * @param options
   */
  constructor({
    checks,
    options = {},
  }: {
    checks: CheckType | ChecksType;
    options?: any;
  }) {
    this.checks = _.isArray(checks) ? checks : [checks];
    this.options = options;
    this.verify();
  }

  /**
   * Checks to ensure that checks have been passed for this condition
   */
  public verify = (): void => {
    if (!_.isArray(this.checks) || this.checks.length < 1) {
      throw new Error('CONDITION_NEEDS_CHECKS');
    }
  };

  /**
   * Checks if a condition is met
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
    options: any;
  }): Promise<boolean> => {
    // Ensure that this condition is valid
    this.verify();
    // Loop through the checks and look for a falsey condition
    // We want all checks to pass to pass this condition
    return this.checks.reduce(async (curr, checker) => {
      const _curr = await curr;
      // Trigger and wait for the checker to return a value
      // Checkers can be promises to allow for async dynamic checks
      const result = await checker(collider, blueprint, hydrate, options);
      // If the result was false, return false other allow current
      return !result ? false : _curr;
    }, Promise.resolve(true));
  };
}

/**
 * This is the typical way to create a new condition.
 * Should be used in favour of using the primary condition class
 * @param args
 */
export default (args: {
  checks: CheckType | ChecksType;
  options?: any;
}): Depends => new Depends(args);
