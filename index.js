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
const redis_1 = require("redis");
const AWS_1 = require("./AWS");
const Utils_1 = require("./Utils");
const subscriber = (0, redis_1.createClient)();
subscriber.connect();

function main() {
    return __awaiter(this, void 0, void 0, function* () {
        while (1) {
            const res = yield subscriber.brPop((0, redis_1.commandOptions)({ isolated: true }), 'build-queue', 0);
            var id = null;
            if (res !== null) {
                id = res.element;
            } else {
                console.log("Response was Null. Operation complete.");
                break; // Changed 'stop' to 'break' to exit the loop
            }
            yield (0, AWS_1.downloadS3Folder)(`output/${id}`);
            console.log(`output/${id}`);
            yield (0, Utils_1.buildProject)(`${id}`);
            yield (0, AWS_1.copyFinalDist)(`${id}`);
        }
    });
}

main();
