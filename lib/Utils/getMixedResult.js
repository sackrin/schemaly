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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0TWl4ZWRSZXN1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvVXRpbHMvZ2V0TWl4ZWRSZXN1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBdUI7QUFFaEIsS0FBSyx5QkFBeUIsTUFBYSxFQUFFLFVBQWUsRUFBRTtJQUNuRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQXFCLEVBQUUsS0FBVSxFQUFFLEVBQUU7UUFDL0QsTUFBTSxLQUFLLEdBQVUsTUFBTSxPQUFPLENBQUM7UUFDbkMsT0FBTyxDQUFDLGdCQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN4RixDQUFDLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLENBQUM7QUFMRCx3Q0FLQztBQUVELGtCQUFlLGNBQWMsQ0FBQyJ9