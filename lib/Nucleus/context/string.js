'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.STRING = undefined;

var _Sanitize = require('../../Sanitize');

var STRING = exports.STRING = {
  code: 'string',
  children: false,
  repeater: false,
  sanitizers: [(0, _Sanitize.SimpleSanitizer)({ rules: ['string'] })],
  validators: []
};

exports.default = STRING;