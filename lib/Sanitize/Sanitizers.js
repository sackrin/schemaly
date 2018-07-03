'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sanitizers = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sanitizers = exports.Sanitizers = function Sanitizers(_ref) {
  var filters = _ref.filters,
      options = _objectWithoutProperties(_ref, ['filters']);

  _classCallCheck(this, Sanitizers);

  _initialiseProps.call(this);

  this.filters = filters;
  this.options = options;
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.filters = [];

  this.filter = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {
      var value = _ref3.value,
          options = _objectWithoutProperties(_ref3, ['value']);

      var filterValue;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (_lodash2.default.isFunction(value)) {
                _context2.next = 4;
                break;
              }

              _context2.t0 = value;
              _context2.next = 7;
              break;

            case 4:
              _context2.next = 6;
              return value(options);

            case 6:
              _context2.t0 = _context2.sent;

            case 7:
              filterValue = _context2.t0;

              if (!(_this.filters.length === 0)) {
                _context2.next = 10;
                break;
              }

              return _context2.abrupt('return', filterValue);

            case 10:
              return _context2.abrupt('return', _this.filters.reduce(function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(value, filter) {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.t0 = filter;
                          _context.t1 = _extends;
                          _context.next = 4;
                          return value;

                        case 4:
                          _context.t2 = _context.sent;
                          _context.t3 = {
                            value: _context.t2
                          };
                          _context.t4 = options;
                          _context.t5 = (0, _context.t1)(_context.t3, _context.t4);
                          return _context.abrupt('return', _context.t0.apply.call(_context.t0, _context.t5));

                        case 9:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x3, _x4) {
                  return _ref4.apply(this, arguments);
                };
              }(), filterValue));

            case 11:
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

exports.default = function (filters) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Sanitizers(_extends({ filters: filters }, options));
};