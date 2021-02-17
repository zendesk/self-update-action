"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const lib = require("./lib");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let env = {};
            lib.settingKeys.forEach((key) => {
                let value = core.getInput(key);
                if (value != '') {
                    env[key] = value;
                }
            });
            let settings = lib.parseSettings(env);
            const pr = yield lib.main(settings);
            if (pr != null) {
                console.log(`Setting output PR ${pr.number}`);
                core.setOutput('pr', pr.number.toString());
                core.setOutput('pr_url', pr.url);
            }
        }
        catch (e) {
            console.log(e);
            core.setFailed(e.message);
        }
    });
}
main();
//# sourceMappingURL=action.js.map