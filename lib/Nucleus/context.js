'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var STRING = exports.STRING = {
  code: 'string',
  children: false,
  repeater: false
};

var CONTAINER = exports.CONTAINER = {
  code: 'container',
  children: true,
  repeater: false
};

var COLLECTION = exports.COLLECTION = {
  code: 'collection',
  children: true,
  repeater: true
};

var FLOAT = exports.FLOAT = {
  code: 'float',
  children: false,
  repeater: false
};

var INT = exports.INT = {
  code: 'int',
  children: false,
  repeater: false
};

var BOOLEAN = exports.BOOLEAN = {
  code: 'boolean',
  children: false,
  repeater: false
};

exports.default = {
  STRING: STRING,
  CONTAINER: CONTAINER,
  COLLECTION: COLLECTION,
  FLOAT: FLOAT,
  INT: INT,
  BOOLEAN: BOOLEAN
};