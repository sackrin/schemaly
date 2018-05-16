export type NucleusContext = {
  code: string,
  children: boolean,
  repeater: boolean
};

export const STRING = {
  code: 'string',
  children: false,
  repeater: false
};

export const CONTAINER = {
  code: 'container',
  children: true,
  repeater: false
};

export const COLLECTION = {
  code: 'collection',
  children: true,
  repeater: true
};

export const FLOAT = {
  code: 'float',
  children: false,
  repeater: false
};

export const INT = {
  code: 'int',
  children: false,
  repeater: false
};

export const BOOLEAN = {
  code: 'boolean',
  children: false,
  repeater: false
};

export default {
  STRING,
  CONTAINER,
  COLLECTION,
  FLOAT,
  INT,
  BOOLEAN
};
