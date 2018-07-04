'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleSanitizer = exports.lowercaseFilter = exports.uppercaseFilter = exports.trimFilter = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Utils = require('../Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var trimFilter = exports.trimFilter = function trimFilter(value) {
  return value.toString().trim();
};

var uppercaseFilter = exports.uppercaseFilter = function uppercaseFilter(value) {
  return value.toString().toUpperCase();
};

var lowercaseFilter = exports.lowercaseFilter = function lowercaseFilter(value) {
  return value.toString().toLowerCase();
};

var SimpleSanitizer = exports.SimpleSanitizer = function SimpleSanitizer(_ref) {
  var rules = _ref.rules,
      options = _objectWithoutProperties(_ref, ['rules']);

  _classCallCheck(this, SimpleSanitizer);

  _initialiseProps.call(this);

  this.config = { rules: rules };
  this.options = options;
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.config = {
    rules: []
  };

  this.getRules = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var options = _objectWithoutProperties(_ref3, []);

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', (0, _Utils.getMixedResult)(_this.config.rules, _extends({ validator: _this.options }, options)).then(function (builtRules) {
                return builtRules.join('|');
              }));

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function () {
      return _ref2.apply(this, arguments);
    };
  }();

  this.apply = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref5) {
      var value = _ref5.value,
          isotope = _ref5.isotope,
          options = _objectWithoutProperties(_ref5, ['value', 'isotope']);

      var builtRules, builtValue;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _this.getRules(options);

            case 2:
              builtRules = _context2.sent;

              if (!_lodash2.default.isFunction(value)) {
                _context2.next = 9;
                break;
              }

              _context2.next = 6;
              return value(options);

            case 6:
              _context2.t0 = _context2.sent;
              _context2.next = 10;
              break;

            case 9:
              _context2.t0 = value;

            case 10:
              builtValue = _context2.t0;
              return _context2.abrupt('return', builtRules.split('|').reduce(function (filtered, filter) {
                switch (filter.toLowerCase()) {
                  case 'trim':
                    {
                      return trimFilter(filtered);
                    }
                  case 'upper_case':
                    {
                      return uppercaseFilter(filtered);
                    }
                  case 'lower_case':
                    {
                      return lowercaseFilter(filtered);
                    }
                  default:
                    {
                      return filtered;
                    }
                }
              }, builtValue));

            case 12:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x2) {
      return _ref4.apply(this, arguments);
    };
  }();
};

exports.default = function (args) {
  return new SimpleSanitizer(args);
};