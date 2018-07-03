'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GrantSinglePolicy = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Utils = require('../Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GrantSinglePolicy = exports.GrantSinglePolicy = function GrantSinglePolicy(_ref) {
  var policies = _ref.policies,
      options = _objectWithoutProperties(_ref, ['policies']);

  _classCallCheck(this, GrantSinglePolicy);

  _initialiseProps.call(this);

  this.policies = policies;
  this.options = options;
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.policies = [];
  this.options = {};

  this.grant = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {
      var isotope = _ref3.isotope,
          roles = _ref3.roles,
          scope = _ref3.scope,
          options = _objectWithoutProperties(_ref3, ['isotope', 'roles', 'scope']);

      var builtScope, builtRoles;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(_this.policies.length === 0)) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt('return', true);

            case 2:
              _context2.next = 4;
              return (0, _Utils.getMixedResult)(scope, options);

            case 4:
              builtScope = _context2.sent;
              _context2.next = 7;
              return (0, _Utils.getMixedResult)(roles, options);

            case 7:
              builtRoles = _context2.sent;
              return _context2.abrupt('return', _lodash2.default.reduce(_this.policies, function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(flag, policy) {
                  var currFlag;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return flag;

                        case 2:
                          currFlag = _context.sent;
                          _context.next = 5;
                          return policy.grant(_extends({
                            isotope: isotope,
                            roles: builtRoles,
                            scope: builtScope
                          }, options));

                        case 5:
                          if (!_context.sent) {
                            _context.next = 9;
                            break;
                          }

                          _context.t0 = true;
                          _context.next = 10;
                          break;

                        case 9:
                          _context.t0 = currFlag;

                        case 10:
                          return _context.abrupt('return', _context.t0);

                        case 11:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x3, _x4) {
                  return _ref4.apply(this, arguments);
                };
              }(), false));

            case 9:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }();
};

exports.default = function (policies) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new GrantSinglePolicy(_extends({ policies: policies }, options));
};