'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMixedResult = undefined;

var getMixedResult = exports.getMixedResult = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(values) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', values.reduce(function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(collect, value) {
                var builtCollect;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return collect;

                      case 2:
                        builtCollect = _context.sent;

                        if (_lodash2.default.isFunction(value)) {
                          _context.next = 7;
                          break;
                        }

                        _context.t0 = [].concat(_toConsumableArray(builtCollect), [value]);
                        _context.next = 15;
                        break;

                      case 7:
                        _context.t1 = [];
                        _context.t2 = _toConsumableArray(builtCollect);
                        _context.t3 = _toConsumableArray;
                        _context.next = 12;
                        return value(options);

                      case 12:
                        _context.t4 = _context.sent;
                        _context.t5 = (0, _context.t3)(_context.t4);
                        _context.t0 = _context.t1.concat.call(_context.t1, _context.t2, _context.t5);

                      case 15:
                        return _context.abrupt('return', _context.t0);

                      case 16:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x3, _x4) {
                return _ref2.apply(this, arguments);
              };
            }(), Promise.all([])));

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getMixedResult(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = getMixedResult;