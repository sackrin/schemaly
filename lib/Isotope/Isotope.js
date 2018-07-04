'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Isotope = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ = require('./');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Isotope = exports.Isotope = function () {
  _createClass(Isotope, [{
    key: 'machine',
    get: function get() {
      return this.nucleus.machine;
    }
  }, {
    key: 'type',
    get: function get() {
      return this.nucleus.type;
    }
  }, {
    key: 'label',
    get: function get() {
      return this.nucleus.label;
    }
  }]);

  function Isotope(_ref) {
    var parent = _ref.parent,
        reactor = _ref.reactor,
        nucleus = _ref.nucleus,
        value = _ref.value,
        options = _objectWithoutProperties(_ref, ['parent', 'reactor', 'nucleus', 'value']);

    _classCallCheck(this, Isotope);

    _initialiseProps.call(this);

    this.reactor = reactor;
    this.nucleus = nucleus;
    this.parent = parent;
    this.value = value;
    this.options = options;
  }

  return Isotope;
}();

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.children = [];

  this.getValue = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var options = _objectWithoutProperties(_ref3, []);

      var getter;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // Retrieve the nucleus getter method
              getter = _this.nucleus.getter;
              // Return the built value

              return _context.abrupt('return', getter(_extends({ value: _this.value, isotope: _this }, options)));

            case 2:
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

  this.setValue = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref5) {
      var value = _ref5.value,
          options = _objectWithoutProperties(_ref5, ['value']);

      var setter;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // Retrieve the nucleus getter method
              setter = _this.nucleus.setter;
              // Assign the built value

              _context2.next = 3;
              return setter(_extends({ value: value, isotope: _this }, options));

            case 3:
              _this.value = _context2.sent;
              return _context2.abrupt('return', _this.value);

            case 5:
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

  this.find = function (criteria) {
    return _this.children.reduce(function (found, item) {
      var search = item.find(criteria);
      return !found && search ? search : found;
    }, undefined);
  };

  this.filter = function (criteria) {
    return _this.children.reduce(function (lst, item) {
      var filtered = item.filter(criteria);
      return filtered.length > 0 ? [].concat(_toConsumableArray(lst), _toConsumableArray(filtered)) : lst;
    }, []);
  };

  this.grant = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var _reactor, scope, roles, grant;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _reactor = _this.reactor, scope = _reactor.scope, roles = _reactor.roles;
            grant = _this.nucleus.grant;
            return _context3.abrupt('return', grant({ isotope: _this, scope: scope, roles: roles }));

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, _this);
  }));

  this.hydrate = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var reactor, nucleus, value, type, nuclei, hydrated;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              reactor = _this.reactor, nucleus = _this.nucleus, value = _this.value;
              type = nucleus.type, nuclei = nucleus.nuclei;

              if (!((type.children || type.repeater) && !nuclei)) {
                _context5.next = 4;
                break;
              }

              throw new Error('NUCLEUS_EXPECTS_CHILDREN');

            case 4:
              hydrated = [];

              if (!(type.children && !type.repeater)) {
                _context5.next = 13;
                break;
              }

              _context5.t0 = hydrated;
              _context5.next = 9;
              return (0, _.Isotopes)({ parent: _this, reactor: reactor, nuclei: nuclei, values: value }).hydrate(options);

            case 9:
              _context5.t1 = _context5.sent;

              _context5.t0.push.call(_context5.t0, _context5.t1);

              _context5.next = 16;
              break;

            case 13:
              if (!(type.children && type.repeater)) {
                _context5.next = 16;
                break;
              }

              _context5.next = 16;
              return Promise.all(value.map(function () {
                var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_value) {
                  return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          _context4.t0 = hydrated;
                          _context4.next = 3;
                          return (0, _.Isotopes)({ parent: _this, reactor: reactor, nuclei: nuclei, values: _value }).hydrate(options);

                        case 3:
                          _context4.t1 = _context4.sent;

                          _context4.t0.push.call(_context4.t0, _context4.t1);

                        case 5:
                        case 'end':
                          return _context4.stop();
                      }
                    }
                  }, _callee4, _this);
                }));

                return function (_x4) {
                  return _ref8.apply(this, arguments);
                };
              }()));

            case 16:
              _this.children = hydrated;
              return _context5.abrupt('return', _this);

            case 18:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, _this);
    }));

    return function () {
      return _ref7.apply(this, arguments);
    };
  }();

  this.sanitize = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var nucleus, type, children, options;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            nucleus = _this.nucleus, type = _this.type, children = _this.children, options = _this.options;

            if (!(type.children || type.repeater)) {
              _context7.next = 5;
              break;
            }

            return _context7.abrupt('return', Promise.all(children.map(function () {
              var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(isotopes) {
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        return _context6.abrupt('return', isotopes.sanitize(options));

                      case 1:
                      case 'end':
                        return _context6.stop();
                    }
                  }
                }, _callee6, _this);
              }));

              return function (_x5) {
                return _ref10.apply(this, arguments);
              };
            }())));

          case 5:
            _context7.next = 7;
            return nucleus.sanitize(_extends({ isotope: _this }, options));

          case 7:
            _this.value = _context7.sent;

          case 8:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, _this);
  }));

  this.validate = function () {
    var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
      var _ref12 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var options = _objectWithoutProperties(_ref12, []);

      var value, machine, label, type, nucleus, children, validated, result;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              value = _this.value, machine = _this.machine, label = _this.label, type = _this.type, nucleus = _this.nucleus, children = _this.children;
              _context9.next = 3;
              return nucleus.validate(_extends({ value: value, isotope: _this }, options));

            case 3:
              validated = _context9.sent;
              result = _extends({}, validated, { machine: machine, type: type, label: label });

              if (!type.children) {
                _context9.next = 10;
                break;
              }

              _context9.next = 8;
              return Promise.all(children.map(function () {
                var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(isotopes) {
                  return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                      switch (_context8.prev = _context8.next) {
                        case 0:
                          return _context8.abrupt('return', isotopes.validate());

                        case 1:
                        case 'end':
                          return _context8.stop();
                      }
                    }
                  }, _callee8, _this);
                }));

                return function (_x7) {
                  return _ref13.apply(this, arguments);
                };
              }()));

            case 8:
              result.children = _context9.sent;

              result.valid = result.children.reduce(function (curr, groupResult) {
                return Object.values(groupResult).reduce(function (isValid, childResult) {
                  return childResult.valid !== true ? false : isValid;
                }, curr);
              }, result.valid);

            case 10:
              return _context9.abrupt('return', result);

            case 11:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, _this);
    }));

    return function () {
      return _ref11.apply(this, arguments);
    };
  }();

  this.dump = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
    var type, children;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            type = _this.type, children = _this.children;

            if (!(type.children && !type.repeater)) {
              _context11.next = 5;
              break;
            }

            return _context11.abrupt('return', children.length > 0 ? children[0].dump() : {});

          case 5:
            if (!(type.children && type.repeater)) {
              _context11.next = 9;
              break;
            }

            return _context11.abrupt('return', Promise.all(children.map(function () {
              var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(isotopes) {
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        return _context10.abrupt('return', isotopes.dump());

                      case 1:
                      case 'end':
                        return _context10.stop();
                    }
                  }
                }, _callee10, _this);
              }));

              return function (_x8) {
                return _ref15.apply(this, arguments);
              };
            }())));

          case 9:
            return _context11.abrupt('return', _this.getValue());

          case 10:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, _this);
  }));
};

exports.default = function (args) {
  return new Isotope(args);
};