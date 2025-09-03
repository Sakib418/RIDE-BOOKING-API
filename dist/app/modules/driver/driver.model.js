"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const driver_interfaces_1 = require("./driver.interfaces");
const driverSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, ref: "User", required: true, unique: true },
    licenseNo: { type: String, required: true },
    vehicle: {
        make: { type: String, required: true },
        model: { type: String, required: true },
        plate: { type: String, required: true },
    },
    approvalStatus: {
        type: String,
        enum: Object.values(driver_interfaces_1.DriverApprovalStatus),
        default: driver_interfaces_1.DriverApprovalStatus.PENDING,
    },
    onlineStatus: {
        type: String,
        enum: Object.values(driver_interfaces_1.DriverOnlineStatus),
        default: driver_interfaces_1.DriverOnlineStatus.OFFLINE,
    },
}, { timestamps: true,
    versionKey: false
});
exports.Driver = (0, mongoose_1.model)("Driver", driverSchema);
