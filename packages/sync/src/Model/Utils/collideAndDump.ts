import { RoleType, ScopeType } from '../../Policy';
import { Options } from '../../Common/Types';
import { Collision } from '../../Interact';
import { Model } from '../Types';

/**
 * SIMPLE COLLIDE UTIL FUNCTION
 * This is a bare bones collide with data and dump util function
 * Should not be used for anything more than filtering data
 * @param model
 * @param roles
 * @param scope
 * @param values
 * @param options
 */
const collideAndDump = ({
  model,
  roles,
  scope,
  values,
  options,
}: {
  model: Model;
  roles: RoleType[];
  scope: ScopeType[];
  values: { [k: string]: any };
  options: Options;
}): { [k: string]: any } => {
  // Create a new collision instance
  const collision = Collision({
    model,
    scope,
    roles,
    options,
  });
  // Collide with the provided data
  collision.with(values).collide();
  // Return the dumped data
  return collision.dump();
};

export default collideAndDump;
