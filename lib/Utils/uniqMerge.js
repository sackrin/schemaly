'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uniqMerge = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var uniqMerge = exports.uniqMerge = function uniqMerge(original, updated) {
  var ids = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['id'];

  var cloned = _extends({}, original);
  Object.entries(updated).forEach(function (item) {
    var mergeValue = item[1];
    var originalValue = original[item[0]];
    // if this is a standard object
    if (_lodash2.default.isPlainObject(mergeValue)) {
      cloned[item[0]] = uniqMerge(originalValue, mergeValue);
      // otherwise if this is an array
    } else if (_lodash2.default.isArray(mergeValue)) {
      var addedOrUpdated = _lodash2.default.map(mergeValue, function (child) {
        var existing = _lodash2.default.find(originalValue, function (itm) {
          return ids.reduce(function (curr, id) {
            return itm[id] === child[id] ? true : curr;
          }, false);
        });
        return uniqMerge(existing || {}, child);
      });
      var filtered = _lodash2.default.filter(originalValue, function (child) {
        return !_lodash2.default.find(addedOrUpdated, function (itm) {
          return ids.reduce(function (curr, id) {
            return itm[id] === child[id] ? true : curr;
          }, false);
        });
      });
      cloned[item[0]] = [].concat(_toConsumableArray(filtered), _toConsumableArray(addedOrUpdated));
      // otherwise just yeah
    } else {
      cloned[item[0]] = mergeValue;
    }
  });
  return cloned;
};

exports.default = uniqMerge;