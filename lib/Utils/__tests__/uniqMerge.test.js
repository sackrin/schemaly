"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("../");
describe("Utils/uniqMerge", () => {
    it("can merge two simple objects together with revised object overwriting original", () => {
        const fakeMerged = __1.uniqMerge({
            title: "mr",
            first_name: "sandy",
            surname: "ryans",
        }, {
            first_name: "jane",
            surname: "bloggs",
        });
        chai_1.expect(fakeMerged).to.deep.equal({
            title: "mr",
            first_name: "jane",
            surname: "bloggs",
        });
    });
    it("can merge two objects together with child objects", () => {
        const fakeMerged = __1.uniqMerge({
            id: "fakerecordid",
            profile: {
                title: "mr",
                first_name: "sandy",
                surname: "ryans",
            }
        }, {
            profile: {
                first_name: "john",
                dob: "02/05/1992",
            }
        });
        chai_1.expect(fakeMerged).to.deep.equal({
            id: "fakerecordid",
            profile: {
                title: "mr",
                first_name: "john",
                surname: "ryans",
                dob: "02/05/1992",
            },
        });
    });
    it("can merge two objects together with an array of child objects", () => {
        const fakeMerged = __1.uniqMerge({
            id: "fakerecordid",
            emails: [
                {
                    id: "fakeemailone",
                    label: "Home Address",
                    address: "home@example.com",
                },
                {
                    id: "fakeemailtwo",
                    label: "Work Address",
                    address: "work@example.com",
                },
            ],
        }, {
            emails: [
                {
                    id: "fakeemailtwo",
                    label: "Office Address",
                },
                {
                    id: "fakeemailfour",
                    label: "Fun Address",
                    address: "fun@example.com",
                },
            ],
        });
        chai_1.expect(fakeMerged).to.deep.equal({
            id: "fakerecordid",
            emails: [
                {
                    id: "fakeemailone",
                    label: "Home Address",
                    address: "home@example.com",
                },
                {
                    id: "fakeemailtwo",
                    label: "Office Address",
                    address: "work@example.com",
                },
                {
                    id: "fakeemailfour",
                    label: "Fun Address",
                    address: "fun@example.com",
                },
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pcU1lcmdlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvVXRpbHMvX190ZXN0c19fL3VuaXFNZXJnZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQThCO0FBQzlCLDJCQUFnQztBQUVoQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO0lBQy9CLEVBQUUsQ0FBQyxnRkFBZ0YsRUFBRSxHQUFHLEVBQUU7UUFDeEYsTUFBTSxVQUFVLEdBQUcsYUFBUyxDQUFDO1lBQzNCLEtBQUssRUFBRSxJQUFJO1lBQ1gsVUFBVSxFQUFFLE9BQU87WUFDbkIsT0FBTyxFQUFFLE9BQU87U0FDakIsRUFBRTtZQUNELFVBQVUsRUFBRSxNQUFNO1lBQ2xCLE9BQU8sRUFBRSxRQUFRO1NBQ2xCLENBQUMsQ0FBQztRQUNILGFBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUMvQixLQUFLLEVBQUUsSUFBSTtZQUNYLFVBQVUsRUFBRSxNQUFNO1lBQ2xCLE9BQU8sRUFBRSxRQUFRO1NBQ2xCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtRQUMzRCxNQUFNLFVBQVUsR0FBRyxhQUFTLENBQUM7WUFDM0IsRUFBRSxFQUFFLGNBQWM7WUFDbEIsT0FBTyxFQUFFO2dCQUNQLEtBQUssRUFBRSxJQUFJO2dCQUNYLFVBQVUsRUFBRSxPQUFPO2dCQUNuQixPQUFPLEVBQUUsT0FBTzthQUNqQjtTQUNGLEVBQUU7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsVUFBVSxFQUFFLE1BQU07Z0JBQ2xCLEdBQUcsRUFBRSxZQUFZO2FBQ2xCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsYUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQy9CLEVBQUUsRUFBRSxjQUFjO1lBQ2xCLE9BQU8sRUFBRTtnQkFDUCxLQUFLLEVBQUUsSUFBSTtnQkFDWCxVQUFVLEVBQUUsTUFBTTtnQkFDbEIsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLEdBQUcsRUFBRSxZQUFZO2FBQ2xCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1FBQ3ZFLE1BQU0sVUFBVSxHQUFHLGFBQVMsQ0FBQztZQUMzQixFQUFFLEVBQUUsY0FBYztZQUNsQixNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsRUFBRSxFQUFFLGNBQWM7b0JBQ2xCLEtBQUssRUFBRSxjQUFjO29CQUNyQixPQUFPLEVBQUUsa0JBQWtCO2lCQUM1QjtnQkFDRDtvQkFDRSxFQUFFLEVBQUUsY0FBYztvQkFDbEIsS0FBSyxFQUFFLGNBQWM7b0JBQ3JCLE9BQU8sRUFBRSxrQkFBa0I7aUJBQzVCO2FBQ0Y7U0FDRixFQUFFO1lBQ0QsTUFBTSxFQUFFO2dCQUNOO29CQUNFLEVBQUUsRUFBRSxjQUFjO29CQUNsQixLQUFLLEVBQUUsZ0JBQWdCO2lCQUN4QjtnQkFDRDtvQkFDRSxFQUFFLEVBQUUsZUFBZTtvQkFDbkIsS0FBSyxFQUFFLGFBQWE7b0JBQ3BCLE9BQU8sRUFBRSxpQkFBaUI7aUJBQzNCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxhQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDL0IsRUFBRSxFQUFFLGNBQWM7WUFDbEIsTUFBTSxFQUFFO2dCQUNOO29CQUNFLEVBQUUsRUFBRSxjQUFjO29CQUNsQixLQUFLLEVBQUUsY0FBYztvQkFDckIsT0FBTyxFQUFFLGtCQUFrQjtpQkFDNUI7Z0JBQ0Q7b0JBQ0UsRUFBRSxFQUFFLGNBQWM7b0JBQ2xCLEtBQUssRUFBRSxnQkFBZ0I7b0JBQ3ZCLE9BQU8sRUFBRSxrQkFBa0I7aUJBQzVCO2dCQUNEO29CQUNFLEVBQUUsRUFBRSxlQUFlO29CQUNuQixLQUFLLEVBQUUsYUFBYTtvQkFDcEIsT0FBTyxFQUFFLGlCQUFpQjtpQkFDM0I7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==