import { SimpleSanitizer } from "../../Sanitize";
import { Context } from "./Types";

export const STRING: Context = {
  code: "string",
  children: false,
  repeater: false,
  sanitizers: [
    SimpleSanitizer({ filters: ["string"] }),
  ],
  validators: [],
};

export default STRING;
