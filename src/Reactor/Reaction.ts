import { Reactor, ReactorArgs } from "./Types";
import { Isotopes } from "../Isotope/Types";
import { RolesType, ScopesType } from "../Policy/Types";
import { Atom } from "../Atom/Types";
import { uniqMerge } from "../Utils";
import { Hydrates } from "../Isotope";
import { ValidatorResult } from "../Validate/Types";

export class Reaction implements Reactor {
  public atom: Atom;

  public roles: RolesType;

  public scope: ScopesType;

  public isotopes?: Isotopes;

  public values?: any;

  public options?: any = {};

  constructor({ atom, roles, scope, options = {} }: ReactorArgs) {
    this.atom = atom;
    this.roles = roles;
    this.scope = scope;
    this.options = options;
  }

  public with = (values: any): this => {
    this.values = values;
    return this;
  };

  public and = ({
    values,
    ids = []
  }: {
    values: any;
    ids?: string[];
  }): this => {
    this.values = uniqMerge({ ...this.values }, values, ids);
    return this;
  };

  public react = async (options: any = {}): Promise<this> => {
    const { atom, values } = this;
    this.isotopes = Hydrates({
      parent: this,
      reactor: this,
      nuclei: atom.nuclei,
      values
    });
    await this.isotopes.hydrate(options);
    return this;
  };

  public sanitize = async (options: any = {}): Promise<this> => {
    if (!this.isotopes) {
      throw new Error("ISOTOPES_REQUIRED");
    }
    await this.isotopes.sanitize(options);
    return this;
  };

  public validate = async (
    options: any = {}
  ): Promise<{ valid: boolean; results: { [s: string]: ValidatorResult } }> => {
    if (!this.isotopes) {
      throw new Error("ISOTOPES_REQUIRED");
    }
    const validated = await this.isotopes.validate(options);
    return {
      valid: Object.values(validated).reduce(
        (curr: boolean, result: ValidatorResult) =>
          result.valid === false ? false : result.valid,
        true
      ),
      results: validated
    };
  };

  public dump = async (options: any = {}): Promise<any> => {
    if (!this.isotopes) {
      throw new Error("ISOTOPES_REQUIRED");
    }
    return this.isotopes.dump(options);
  };
}

export default (args: ReactorArgs): Reactor => new Reaction(args);
