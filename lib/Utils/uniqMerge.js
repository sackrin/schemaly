"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
exports.uniqMerge = (original, updated, ids = ["id"]) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pcU1lcmdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL1V0aWxzL3VuaXFNZXJnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUF1QjtBQUVWLFFBQUEsU0FBUyxHQUFHLENBQUMsUUFBYSxFQUFFLE9BQVksRUFBRSxNQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7SUFDL0UsTUFBTSxNQUFNLEdBQVEsRUFBRSxHQUFHLFFBQVEsRUFBRSxDQUFDO0lBQ3BDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDdkMsTUFBTSxVQUFVLEdBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sYUFBYSxHQUFRLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLGdCQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxpQkFBUyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztTQUN4RDthQUFNLElBQUksZ0JBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDaEMsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUM5QyxNQUFNLFFBQVEsR0FBRyxnQkFBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtvQkFDN0MsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNoRixDQUFDLENBQUMsQ0FBQztnQkFDSCxPQUFPLGlCQUFTLENBQUMsUUFBUSxJQUFJLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sUUFBUSxHQUFHLGdCQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUNqRCxPQUFPLENBQUMsZ0JBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBQ3JDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDaEYsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxFQUFFLEdBQUcsY0FBYyxDQUFDLENBQUM7U0FDcEQ7YUFBTTtZQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUM7U0FDOUI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUVGLGtCQUFlLGlCQUFTLENBQUMifQ==