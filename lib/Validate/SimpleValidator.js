'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleValidator = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _validatorjs = require('validatorjs');

var _validatorjs2 = _interopRequireDefault(_validatorjs);

var _Utils = require('../Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimpleValidator = exports.SimpleValidator = function SimpleValidator(_ref) {
  var rules = _ref.rules,
      options = _objectWithoutProperties(_ref, ['rules']);

  _classCallCheck(this, SimpleValidator);

  _initialiseProps.call(this);

  this.rules = rules;
  this.options = options;
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.rules = [];

  this.getRules = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var options = _objectWithoutProperties(_ref3, []);

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', (0, _Utils.getMixedResult)(_this.rules, _extends({ validator: _this.options }, options)).then(function (builtRules) {
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

  this.validate = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref5) {
      var value = _ref5.value,
          options = _objectWithoutProperties(_ref5, ['value']);

      var usingRules, usingValue, validation;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _this.getRules({ options: options });

            case 2:
              usingRules = _context2.sent;

              if (_lodash2.default.isFunction(value)) {
                _context2.next = 7;
                break;
              }

              _context2.t0 = value;
              _context2.next = 10;
              break;

            case 7:
              _context2.next = 9;
              return value(_extends({}, _this.options, options));

            case 9:
              _context2.t0 = _context2.sent;

            case 10:
              usingValue = _context2.t0;
              validation = new _validatorjs2.default({ value: usingValue }, { value: usingRules });

              if (!validation.fails()) {
                _context2.next = 16;
                break;
              }

              return _context2.abrupt('return', { valid: false, messages: [].concat(_toConsumableArray(validation.errors.get('value')), _toConsumableArray(_lodash2.default.get(_this.options, 'error_messages', []))), children: [] });

            case 16:
              return _context2.abrupt('return', { valid: true, messages: [].concat(_toConsumableArray(_lodash2.default.get(_this.options, 'success_messages', []))), children: [] });

            case 17:
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
  return new SimpleValidator(args);
};