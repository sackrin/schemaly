"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Allow_1 = __importDefault(require("../Allow"));
describe('Policy/Allow', function () {
    it('can have simple roles and scope added', () => {
        const allowRule = Allow_1.default({ roles: ['user', 'admin'], scope: ['read', 'write'], options: { test: true } });
        chai_1.expect(allowRule.roles).to.deep.equal(['user', 'admin']);
        chai_1.expect(allowRule.scope).to.deep.equal(['read', 'write']);
        chai_1.expect(allowRule.options).to.deep.equal({ test: true });
    });
});
