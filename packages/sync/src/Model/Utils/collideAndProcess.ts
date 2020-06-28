import { RoleType, ScopeType } from '../../Policy/Types';
import { Options } from '../../Common/Types';
import { ValidatorResult } from '../../Validate/Types';
import { Model } from '../Types';
import { Collision } from '../../Interact';

/**
 * @param model
 * @param roles
 * @param scope
 * @param values
 * @param options
 */
const collideAndProcess = ({
  model,
  roles,
  scope,
  values,
  options,
}: {
  model: Model;
  roles: RoleType[];
  scope: ScopeType[];
  values: any;
  options: Options;
}):
  | { [k: string]: any }
  | { valid: boolean; results: { [s: string]: ValidatorResult } } => {
  // Create a new collision instance
  const collision = Collision({
    model,
    scope,
    roles,
    options,
  });
  // Collide with the provided data
  collision.with(values).collide();
  // Run the data through sanitizers
  collision.sanitize(options);
  // Validate the data
  const validated = collision.validate(options);
  if (!validated.valid) {
    return validated;
  }
  return collision.dump();
};

export default collideAndProcess;
