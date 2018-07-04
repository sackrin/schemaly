'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FLOAT = undefined;

var _Sanitize = require('../../Sanitize');

var FLOAT = exports.FLOAT = {
  code: 'float',
  children: false,
  repeater: false,
  sanitizers: [(0, _Sanitize.SimpleSanitizer)({ rules: ['float'] })],
  validators: []
};

exports.default = FLOAT;