"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDriverApprovalZodSchema = exports.createDriverProfileZodSchema = void 0;
const zod_1 = require("zod");
const driver_interfaces_1 = require("./driver.interfaces");
exports.createDriverProfileZodSchema = zod_1.z.object({
    licenseNo: zod_1.z.string().min(5, "License number is too short."),
    vehicle: zod_1.z.object({
        make: zod_1.z.string().min(2, "Vehicle make is required."),
        model: zod_1.z.string().min(2, "Vehicle model is required."),
        plate: zod_1.z.string().min(2, "Vehicle plate number is required."),
    }),
    approvalStatus: zod_1.z
        .nativeEnum(driver_interfaces_1.DriverApprovalStatus)
        .default(driver_interfaces_1.DriverApprovalStatus.PENDING),
    onlineStatus: zod_1.z
        .nativeEnum(driver_interfaces_1.DriverOnlineStatus)
        .default(driver_interfaces_1.DriverOnlineStatus.OFFLINE),
});
exports.updateDriverApprovalZodSchema = zod_1.z.object({
    approvalStatus: zod_1.z.nativeEnum(driver_interfaces_1.DriverApprovalStatus)
});
