"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("../");
describe('getMixedResult', function () {
    function valuesPromise() {
        return new Promise(function (resolve) {
            setTimeout(resolve, 100, ['alpha_dash']);
        });
    }
    function valuesOptionsPromise(options = {}) {
        return new Promise(function (resolve) {
            setTimeout(resolve, 100, ['string|alpha_dash', ...options.inject]);
        });
    }
    it('A simple list of values can be passed and returned', () => {
        const values = ['required|email', 'min:18'];
        return __1.getMixedResult(values)
            .then(builtValues => {
            chai_1.expect(builtValues).to.deep.equal(values);
        }).catch((msg) => { throw new Error(msg); });
    });
    it('A mixed list of values can be passed and returned built', () => {
        const values = ['required|email', 'min:18', valuesPromise];
        const expectedValues = ['required|email', 'min:18', 'alpha_dash'];
        return __1.getMixedResult(values)
            .then(builtValues => {
            chai_1.expect(builtValues).to.deep.equal(expectedValues);
        }).catch((msg) => { throw new Error(msg); });
    });
    it('A mixed list of values with options can be passed and returned built', () => {
        const values = ['required|email', 'min:18', valuesOptionsPromise];
        const expectedValues = ['required|email', 'min:18', 'string|alpha_dash', 'alpha_num'];
        return __1.getMixedResult(values, { inject: ['alpha_num'] })
            .then(builtValues => {
            chai_1.expect(builtValues).to.deep.equal(expectedValues);
        }).catch((msg) => { throw new Error(msg); });
    });
});
