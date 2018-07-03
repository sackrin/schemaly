"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Validators = exports.Validators = function Validators(_ref) {
  var validators = _ref.validators,
      options = _objectWithoutProperties(_ref, ["validators"]);

  _classCallCheck(this, Validators);

  _initialiseProps.call(this);

  this.validators = validators;
  this.options = options;
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.validate = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref3) {
      var value = _ref3.value,
          options = _objectWithoutProperties(_ref3, ["value"]);

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(_this.validators.length === 0)) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", { valid: true, messages: [], children: [] });

            case 2:
              return _context2.abrupt("return", _this.validators.reduce(function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(flag, validator) {
                  var currFlag, validationCheck;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return flag;

                        case 2:
                          currFlag = _context.sent;
                          _context.next = 5;
                          return validator.validate(_extends({ value: value }, options));

                        case 5:
                          validationCheck = _context.sent;
                          return _context.abrupt("return", {
                            valid: !validationCheck.valid ? false : currFlag.valid,
                            messages: [].concat(_toConsumableArray(currFlag.messages), _toConsumableArray(validationCheck.messages)),
                            children: [].concat(_toConsumableArray(currFlag.children), _toConsumableArray(validationCheck.children))
                          });

                        case 7:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x3, _x4) {
                  return _ref4.apply(this, arguments);
                };
              }(), {
                valid: true,
                messages: [],
                children: []
              }));

            case 3:
            case "end":
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

exports.default = function (validators) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Validators(_extends({ validators: validators }, options));
};