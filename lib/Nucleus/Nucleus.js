'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Nucleus = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sanitize = require('../Sanitize');

var _Validate = require('../Validate');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Nucleus = exports.Nucleus = function () {
  function Nucleus(_ref) {
    var type = _ref.type,
        machine = _ref.machine,
        label = _ref.label,
        parent = _ref.parent,
        nuclei = _ref.nuclei,
        getters = _ref.getters,
        setters = _ref.setters,
        policies = _ref.policies,
        sanitizers = _ref.sanitizers,
        validators = _ref.validators,
        options = _objectWithoutProperties(_ref, ['type', 'machine', 'label', 'parent', 'nuclei', 'getters', 'setters', 'policies', 'sanitizers', 'validators']);

    _classCallCheck(this, Nucleus);

    _initialiseProps.call(this);

    this.config = { type: type, machine: machine, label: label };
    if (parent) this.parent = parent;
    if (policies) {
      this.policies = policies;
    }
    if (sanitizers) {
      sanitizers.merge(type.sanitizers);
      this.sanitizers = sanitizers;
    } else {
      this.sanitizers = (0, _Sanitize.Sanitizers)([].concat(_toConsumableArray(type ? type.sanitizers : [])));
    }
    if (validators) {
      validators.merge(type.validators);
      this.validators = validators;
    } else {
      this.validators = (0, _Validate.Validators)([].concat(_toConsumableArray(type ? type.validators : [])));
    }
    if (getters) this.getters = getters;
    if (setters) this.setters = setters;
    if (nuclei) this.addNuclei({ nuclei: nuclei });
    this.options = _extends({}, options);
  }

  _createClass(Nucleus, [{
    key: 'machine',
    get: function get() {
      return this.config.machine;
    }
  }, {
    key: 'type',
    get: function get() {
      return this.config.type;
    }
  }, {
    key: 'label',
    get: function get() {
      return this.config.label;
    }
  }]);

  return Nucleus;
}();

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.config = {};
  this.options = {};
  this.setters = [];
  this.getters = [];

  this.addNuclei = function (_ref2) {
    var nuclei = _ref2.nuclei;

    if (!_this.config.type.children && !_this.config.type.repeater) {
      throw new Error('CANNOT_HAVE_CHILDREN');
    }
    nuclei.parent = _this;
    _this.nuclei = nuclei;
  };

  this.grant = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref4) {
      var isotope = _ref4.isotope,
          scope = _ref4.scope,
          roles = _ref4.roles,
          options = _objectWithoutProperties(_ref4, ['isotope', 'scope', 'roles']);

      var policies;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              policies = _this.policies;

              if (policies) {
                _context.next = 3;
                break;
              }

              return _context.abrupt('return', true);

            case 3:
              return _context.abrupt('return', policies.grant(_extends({ isotope: isotope, scope: scope, roles: roles }, options)));

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }();

  this.validate = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref6) {
      var value = _ref6.value,
          isotope = _ref6.isotope,
          options = _objectWithoutProperties(_ref6, ['value', 'isotope']);

      var validators;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              validators = _this.validators;
              return _context2.abrupt('return', validators ? validators.validate(_extends({ value: value, isotope: isotope }, options)) : { valid: true, messages: [], children: [] });

            case 2:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x2) {
      return _ref5.apply(this, arguments);
    };
  }();

  this.sanitize = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref8) {
      var isotope = _ref8.isotope,
          options = _objectWithoutProperties(_ref8, ['isotope']);

      var sanitizers;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              sanitizers = _this.sanitizers;
              return _context3.abrupt('return', sanitizers ? sanitizers.filter(_extends({ isotope: isotope }, options)) : isotope.getValue());

            case 2:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this);
    }));

    return function (_x3) {
      return _ref7.apply(this, arguments);
    };
  }();

  this.getter = function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var value = _ref10.value,
          isotope = _ref10.isotope,
          options = _objectWithoutProperties(_ref10, ['value', 'isotope']);

      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt('return', _this.getters.reduce(function () {
                var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(value, getter) {
                  return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          return _context4.abrupt('return', getter({ isotope: isotope, value: value, options: options }));

                        case 1:
                        case 'end':
                          return _context4.stop();
                      }
                    }
                  }, _callee4, _this);
                }));

                return function (_x5, _x6) {
                  return _ref11.apply(this, arguments);
                };
              }(), value));

            case 1:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, _this);
    }));

    return function () {
      return _ref9.apply(this, arguments);
    };
  }();

  this.setter = function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(_ref13) {
      var value = _ref13.value,
          isotope = _ref13.isotope,
          options = _objectWithoutProperties(_ref13, ['value', 'isotope']);

      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              return _context7.abrupt('return', _this.setters.reduce(function () {
                var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(value, setter) {
                  return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          return _context6.abrupt('return', setter({ isotope: isotope, value: value, options: options }));

                        case 1:
                        case 'end':
                          return _context6.stop();
                      }
                    }
                  }, _callee6, _this);
                }));

                return function (_x8, _x9) {
                  return _ref14.apply(this, arguments);
                };
              }(), value));

            case 1:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, _this);
    }));

    return function (_x7) {
      return _ref12.apply(this, arguments);
    };
  }();
};

exports.default = function (args) {
  return new Nucleus(args);
};