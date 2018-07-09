"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
async function getMixedResult(values, options = {}) {
    return values.reduce(async (collect, value) => {
        const built = await collect;
        return !lodash_1.default.isFunction(value) ? [...built, value] : [...built, ...await value(options)];
    }, Promise.all([]));
}
exports.getMixedResult = getMixedResult;
exports.default = getMixedResult;
