'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Reactor = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Isotope = require('../Isotope');

var _ = require('../');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Reactor = exports.Reactor = function Reactor(_ref) {
  var atom = _ref.atom,
      roles = _ref.roles,
      scope = _ref.scope,
      options = _objectWithoutProperties(_ref, ['atom', 'roles', 'scope']);

  _classCallCheck(this, Reactor);

  _initialiseProps.call(this);

  this.atom = atom;
  this.roles = roles;
  this.scope = scope;
  this.options = options;
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.roles = [];
  this.scope = [];

  this.with = function (_ref2) {
    var values = _ref2.values;

    _this.values = values;
    return _this;
  };

  this.and = function (_ref3) {
    var values = _ref3.values,
        _ref3$ids = _ref3.ids,
        ids = _ref3$ids === undefined ? [] : _ref3$ids;

    _this.values = (0, _.uniqMerge)(_extends({}, _this.values), values, ids);
    return _this;
  };

  this.react = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var atom, values;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            atom = _this.atom, values = _this.values;

            _this.isotopes = (0, _Isotope.Isotopes)({
              reactor: _this,
              nuclei: atom.nuclei,
              values: values
            });
            return _context.abrupt('return', _this.isotopes.hydrate({ values: values }));

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));
  this.sanitize = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', _this.isotopes.sanitize());

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this);
  }));
  this.validate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var validated;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _this.isotopes.validate();

          case 2:
            validated = _context3.sent;
            return _context3.abrupt('return', {
              valid: Object.values(validated).reduce(function (curr, result) {
                return result.valid === false ? false : result.valid;
              }, true),
              results: validated
            });

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, _this);
  }));
  this.dump = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', _this.isotopes.dump());

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, _this);
  }));
};

exports.default = function (args) {
  return new Reactor(args);
};