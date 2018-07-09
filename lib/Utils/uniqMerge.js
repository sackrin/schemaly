"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
exports.uniqMerge = (original, updated, ids = ['id']) => {
    const cloned = { ...original };
    Object.entries(updated).forEach((item) => {
        const mergeValue = item[1];
        const originalValue = original[item[0]];
        if (lodash_1.default.isPlainObject(mergeValue)) {
            cloned[item[0]] = exports.uniqMerge(originalValue, mergeValue);
        }
        else if (lodash_1.default.isArray(mergeValue)) {
            const addedOrUpdated = mergeValue.map((child) => {
                const existing = lodash_1.default.find(originalValue, (itm) => {
                    return ids.reduce((curr, id) => (itm[id] === child[id] ? true : curr), false);
                });
                return exports.uniqMerge(existing || {}, child);
            });
            const filtered = lodash_1.default.filter(originalValue, (child) => {
                return !lodash_1.default.find(addedOrUpdated, (itm) => {
                    return ids.reduce((curr, id) => (itm[id] === child[id] ? true : curr), false);
                });
            });
            cloned[item[0]] = [...filtered, ...addedOrUpdated];
        }
        else {
            cloned[item[0]] = mergeValue;
        }
    });
    return cloned;
};
exports.default = exports.uniqMerge;
