'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INT = undefined;

var _Sanitize = require('../../Sanitize');

var INT = exports.INT = {
  code: 'int',
  children: false,
  repeater: false,
  sanitizers: [(0, _Sanitize.SimpleSanitizer)({ rules: ['int'] })],
  validators: []
};

exports.default = INT;