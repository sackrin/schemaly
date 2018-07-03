"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Atom = exports.Atom = function Atom(_ref) {
  var machine = _ref.machine,
      roles = _ref.roles,
      scope = _ref.scope,
      label = _ref.label,
      nuclei = _ref.nuclei,
      options = _objectWithoutProperties(_ref, ["machine", "roles", "scope", "label", "nuclei"]);

  _classCallCheck(this, Atom);

  this.config = { machine: machine, label: label };
  this.nuclei = nuclei;
  this.roles = roles;
  this.scope = scope;
  this.options = options;
};

exports.default = function (args) {
  return new Atom(args);
};