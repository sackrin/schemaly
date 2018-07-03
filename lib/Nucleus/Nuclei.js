"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Nuclei = exports.Nuclei = function Nuclei(_ref) {
  var _this = this;

  var nuclei = _ref.nuclei,
      parent = _ref.parent,
      options = _objectWithoutProperties(_ref, ["nuclei", "parent"]);

  _classCallCheck(this, Nuclei);

  this.all = function () {
    return _this.nuclei;
  };

  if (parent) this.parent = parent;
  this.nuclei = nuclei;
  this.options = options;
};

exports.default = function (nuclei) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Nuclei(_extends({ nuclei: nuclei }, options));
};