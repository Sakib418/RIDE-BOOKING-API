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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startRideCleanupJob = startRideCleanupJob;
const node_cron_1 = __importDefault(require("node-cron"));
const ride_model_1 = require("../modules/ride/ride.model");
function startRideCleanupJob() {
    // Runs every minute
    node_cron_1.default.schedule("* * * * *", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const expiryMinutes = 3;
            const expiryTime = new Date(Date.now() - expiryMinutes * 60 * 1000);
            const result = yield ride_model_1.Ride.updateMany({ status: "REQUESTED", requestedAt: { $lt: expiryTime } }, {
                status: "CANCELED",
                canceledAt: new Date(),
                cancelReason: "No drivers available at the moment"
            });
            if (result.modifiedCount > 0) {
                console.log(`Auto-canceled ${result.modifiedCount} rides`);
            }
        }
        catch (error) {
            console.error("Ride cleanup job failed:", error);
        }
    }));
}
