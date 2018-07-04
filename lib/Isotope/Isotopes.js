'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Isotopes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _2 = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Isotopes = exports.Isotopes = function Isotopes(_ref) {
  var parent = _ref.parent,
      reactor = _ref.reactor,
      nuclei = _ref.nuclei,
      values = _ref.values,
      options = _objectWithoutProperties(_ref, ['parent', 'reactor', 'nuclei', 'values']);

  _classCallCheck(this, Isotopes);

  _initialiseProps.call(this);

  this.reactor = reactor;
  this.parent = reactor;
  this.nuclei = nuclei;
  this.values = values;
  this.options = options;
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.isotopes = [];

  this.find = function (criteria) {
    var isotopes = _this.isotopes;

    return _lodash2.default.find(isotopes, criteria);
  };

  this.filter = function (criteria) {
    var isotopes = _this.isotopes;

    return _lodash2.default.filter(isotopes, criteria);
  };

  this.hydrate = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var reactor, nuclei, isotopes, values;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              reactor = _this.reactor, nuclei = _this.nuclei, isotopes = _this.isotopes, values = _this.values;
              _context2.next = 3;
              return Promise.all(nuclei.all().map(function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(nucleus) {
                  var value, isotope;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          value = _lodash2.default.get(values, nucleus.machine, undefined);
                          isotope = (0, _2.Isotope)({ parent: _this, reactor: reactor, nucleus: nucleus, value: value });
                          _context.next = 4;
                          return isotope.grant();

                        case 4:
                          if (!_context.sent) {
                            _context.next = 10;
                            break;
                          }

                          _context.t0 = isotopes;
                          _context.next = 8;
                          return isotope.hydrate();

                        case 8:
                          _context.t1 = _context.sent;

                          _context.t0.push.call(_context.t0, _context.t1);

                        case 10:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x2) {
                  return _ref3.apply(this, arguments);
                };
              }()));

            case 3:
              return _context2.abrupt('return', _this);

            case 4:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function () {
      return _ref2.apply(this, arguments);
    };
  }();

  this.validate = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var isotopes, validations;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              isotopes = _this.isotopes;
              validations = {};
              _context4.next = 4;
              return Promise.all(isotopes.map(function () {
                var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(isotope) {
                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.next = 2;
                          return isotope.validate(_extends({}, options));

                        case 2:
                          validations['' + isotope.machine] = _context3.sent;

                        case 3:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, _callee3, _this);
                }));

                return function (_x4) {
                  return _ref5.apply(this, arguments);
                };
              }()));

            case 4:
              return _context4.abrupt('return', validations);

            case 5:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this);
    }));

    return function () {
      return _ref4.apply(this, arguments);
    };
  }();

  this.sanitize = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var isotopes, options;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            isotopes = _this.isotopes, options = _this.options;
            _context6.next = 3;
            return Promise.all(isotopes.map(function () {
              var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(isotope) {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return isotope.sanitize(options);

                      case 2:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                }, _callee5, _this);
              }));

              return function (_x5) {
                return _ref7.apply(this, arguments);
              };
            }()));

          case 3:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, _this);
  }));
  this.dump = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var isotopes;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            isotopes = _this.isotopes;
            return _context8.abrupt('return', isotopes.reduce(function () {
              var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(curr, isotope) {
                var dumped;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.t0 = _extends;
                        _context7.t1 = {};
                        _context7.next = 4;
                        return curr;

                      case 4:
                        _context7.t2 = _context7.sent;
                        dumped = (0, _context7.t0)(_context7.t1, _context7.t2);
                        _context7.next = 8;
                        return isotope.dump();

                      case 8:
                        dumped[isotope.machine] = _context7.sent;
                        return _context7.abrupt('return', dumped);

                      case 10:
                      case 'end':
                        return _context7.stop();
                    }
                  }
                }, _callee7, _this);
              }));

              return function (_x6, _x7) {
                return _ref9.apply(this, arguments);
              };
            }(), {}));

          case 2:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, _this);
  }));
};

exports.default = function (args) {
  return new Isotopes(args);
};