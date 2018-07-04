'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Deny = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Utils = require('../Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Deny = exports.Deny = function Deny(_ref) {
  var roles = _ref.roles,
      scope = _ref.scope,
      options = _objectWithoutProperties(_ref, ['roles', 'scope']);

  _classCallCheck(this, Deny);

  _initialiseProps.call(this);

  this.roles = _lodash2.default.isArray(roles) ? roles : [roles];
  this.scope = _lodash2.default.isArray(scope) ? scope : [scope];
  this.options = options;
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.roles = [];
  this.scope = [];

  this.getRoles = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref3) {
      var options = _objectWithoutProperties(_ref3, []);

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', (0, _Utils.getMixedResult)(_this.roles, _extends({ policy: _this.options }, options)));

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  this.getScope = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref5) {
      var options = _objectWithoutProperties(_ref5, []);

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt('return', (0, _Utils.getMixedResult)(_this.scope, _extends({ policy: _this.options }, options)));

            case 1:
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

  this.grant = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref7) {
      var isotope = _ref7.isotope,
          roles = _ref7.roles,
          scope = _ref7.scope,
          options = _objectWithoutProperties(_ref7, ['isotope', 'roles', 'scope']);

      var forRoles, againstRoles, roleCheck, forScopes, againstScopes, scopeCheck;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _Utils.getMixedResult)(_this.roles, options);

            case 2:
              forRoles = _context3.sent;
              _context3.next = 5;
              return (0, _Utils.getMixedResult)(roles, options);

            case 5:
              againstRoles = _context3.sent;
              roleCheck = _lodash2.default.difference(againstRoles, forRoles);

              if (!(roleCheck.length === againstRoles.length && forRoles.indexOf('*') === -1)) {
                _context3.next = 9;
                break;
              }

              return _context3.abrupt('return', true);

            case 9:
              _context3.next = 11;
              return (0, _Utils.getMixedResult)(_this.scope, options);

            case 11:
              forScopes = _context3.sent;
              _context3.next = 14;
              return (0, _Utils.getMixedResult)(scope, options);

            case 14:
              againstScopes = _context3.sent;
              scopeCheck = _lodash2.default.difference(againstScopes, forScopes);
              return _context3.abrupt('return', scopeCheck.length === againstScopes.length && forScopes.indexOf('*') === -1);

            case 17:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this);
    }));

    return function (_x3) {
      return _ref6.apply(this, arguments);
    };
  }();
};

exports.default = function (args) {
  return new Deny(args);
};