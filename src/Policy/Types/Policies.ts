import { Policy } from "./";
import PolicyGrantArgs from "./PolicyGrantArgs";

export interface Policies {
  policies: Policy[];
  options: any;
  grant({
    isotope,
    roles,
    scope,
    ...options
  }: PolicyGrantArgs): Promise<boolean>;
}

export default Policies;
