"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("../");
describe("Utils/getMixedResult", () => {
    function valuesPromise() {
        return new Promise((resolve) => {
            setTimeout(resolve, 100, ["alpha_dash"]);
        });
    }
    function valuesOptionsPromise(options = {}) {
        return new Promise((resolve) => {
            setTimeout(resolve, 100, ["string|alpha_dash", ...options.inject]);
        });
    }
    it("A simple list of values can be passed and returned", () => {
        const values = ["required|email", "min:18"];
        return __1.getMixedResult(values)
            .then((builtValues) => {
            chai_1.expect(builtValues).to.deep.equal(values);
        }).catch((msg) => { throw new Error(msg); });
    });
    it("A mixed list of values can be passed and returned built", () => {
        const values = ["required|email", "min:18", valuesPromise];
        const expectedValues = ["required|email", "min:18", "alpha_dash"];
        return __1.getMixedResult(values)
            .then((builtValues) => {
            chai_1.expect(builtValues).to.deep.equal(expectedValues);
        }).catch((msg) => { throw new Error(msg); });
    });
    it("A mixed list of values with options can be passed and returned built", () => {
        const values = ["required|email", "min:18", valuesOptionsPromise];
        const expectedValues = ["required|email", "min:18", "string|alpha_dash", "alpha_num"];
        return __1.getMixedResult(values, { inject: ["alpha_num"] })
            .then((builtValues) => {
            chai_1.expect(builtValues).to.deep.equal(expectedValues);
        }).catch((msg) => { throw new Error(msg); });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0TWl4ZWRSZXN1bHRzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvVXRpbHMvX190ZXN0c19fL2dldE1peGVkUmVzdWx0cy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQThCO0FBQzlCLDJCQUFxQztBQUVyQyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBUyxFQUFFO0lBQzFDO1FBQ0UsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzdCLFVBQVUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCw4QkFBOEIsVUFBZSxFQUFFO1FBQzdDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUM3QixVQUFVLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDckUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTtRQUM1RCxNQUFNLE1BQU0sR0FBYSxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3RELE9BQU8sa0JBQWMsQ0FBQyxNQUFNLENBQUM7YUFDMUIsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDcEIsYUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHlEQUF5RCxFQUFFLEdBQUcsRUFBRTtRQUNqRSxNQUFNLE1BQU0sR0FBNkIsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDckYsTUFBTSxjQUFjLEdBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDNUUsT0FBTyxrQkFBYyxDQUFDLE1BQU0sQ0FBQzthQUMxQixJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUNwQixhQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0VBQXNFLEVBQUUsR0FBRyxFQUFFO1FBQzlFLE1BQU0sTUFBTSxHQUE2QixDQUFDLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBQzVGLE1BQU0sY0FBYyxHQUFhLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2hHLE9BQU8sa0JBQWMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO2FBQ3JELElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQ3BCLGFBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxHQUFHLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=