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
exports.DriverController = exports.getEarnings = exports.setDriverStatus = void 0;
const catchAsync_1 = require("../../Utils/catchAsync");
const sendResponse_1 = require("../../Utils/sendResponse");
const driver_service_1 = require("./driver.service");
const createDriverProfile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id; // get user ID from URL
    const payload = Object.assign(Object.assign({}, req.body), { user: userId });
    const result = yield driver_service_1.DriverService.createDriverProfile(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Driver profile created successfully',
        data: result,
    });
}));
const getAllDrivers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield driver_service_1.DriverService.getAllDrivers(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Drivers retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
}));
const approveOrSuspendDriver = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const { approvalStatus } = req.body;
    const result = yield driver_service_1.DriverService.approveOrSuspendDriver(driverId, approvalStatus);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: `Driver has been ${approvalStatus.toLowerCase()} successfully`,
        data: result,
    });
}));
const setDriverStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { status } = req.body;
    const driver = yield driver_service_1.DriverService.setDriverStatus(decodedToken, status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: `Driver has been updated successfully`,
        data: driver,
    });
});
exports.setDriverStatus = setDriverStatus;
const getEarnings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield driver_service_1.DriverService.getEarnings(decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: `Driver earning total retrived successfully`,
        data: result.data,
        meta: result.meta
    });
});
exports.getEarnings = getEarnings;
exports.DriverController = {
    createDriverProfile,
    getAllDrivers,
    approveOrSuspendDriver,
    setDriverStatus: exports.setDriverStatus,
    getEarnings: exports.getEarnings
};
