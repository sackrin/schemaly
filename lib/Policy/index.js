'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});

var _Deny = require('./Deny');

Object.defineProperty(exports, 'DenyPolicy', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Deny).default;
  }
});

var _Allow = require('./Allow');

Object.defineProperty(exports, 'AllowPolicy', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Allow).default;
  }
});

var _GrantSinglePolicy = require('./GrantSinglePolicy');

Object.defineProperty(exports, 'GrantSinglePolicy', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_GrantSinglePolicy).default;
  }
});

var _GrantAllPolicies = require('./GrantAllPolicies');

Object.defineProperty(exports, 'GrantAllPolicies', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_GrantAllPolicies).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }