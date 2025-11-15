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
exports.DriverService = exports.getEarnings = exports.setDriverStatus = void 0;
const QueryBuilder_1 = require("../../Utils/QueryBuilder");
const ride_model_1 = require("../ride/ride.model");
const driver_interfaces_1 = require("./driver.interfaces");
const driver_model_1 = require("./driver.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHandlers/AppError"));
const user_model_1 = require("../user/user.model");
const createDriverProfile = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.create(payload);
    return driver;
});
const updateDriverProfile = (userid, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ifUserExist = yield user_model_1.User.findById(userid);
    if (!ifUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    console.log(payload);
    //const driver = await Driver.findByIdAndUpdate(userid, payload, { new: true, runValidators: true })
    const driver = yield driver_model_1.Driver.findOneAndUpdate({ user: userid }, // find driver by user reference
    { $set: { vehicle: payload } }, // update only vehicle
    { new: true, runValidators: true });
    return driver;
});
const getAllDrivers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(driver_model_1.Driver.find(), query);
    const driver = yield queryBuilder
        .filter();
    // const meta = await queryBuilder.getMeta()
    const [data, meta] = yield Promise.all([
        driver.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
// const approveOrSuspendDriver = async (userid: string, approvalStatus: DriverApprovalStatus) => {
//     const existingDriver = await Driver.findOne({ user: userid });
//     //console.log(existingDriver,approvalStatus);
//     if (!existingDriver) {
//         throw new Error("Driver not found.");
//     }
//     const driverId= existingDriver._id;
//     //  const newStatus =
//     //       ifUserExist.isActive === IsActive.ACTIVE ? IsActive.BLOCKED : IsActive.ACTIVE;
//           const newStatus =
//           approvalStatus === DriverApprovalStatus.APPROVED ? DriverApprovalStatus.SUSPENDED : DriverApprovalStatus.APPROVED;
//     console.log(driverId);
//     //const updatedDriver = await Driver.findByIdAndUpdate(existingDriver._id, {approvalStatus}, { new: true });
//     const updatedDriver = await Driver.findByIdAndUpdate(
//     driverId,
//     { approvalStatus: newStatus },
//     { new: true, select: "-password"}
//   );
//     return updatedDriver;
// };
const approveOrSuspendDriver = (userId, approvalStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDriver = yield driver_model_1.Driver.findOne({ user: userId });
    if (!existingDriver) {
        throw new Error("Driver not found.");
    }
    const driverId = existingDriver._id;
    const currentStatus = existingDriver.approvalStatus;
    const newStatus = currentStatus === driver_interfaces_1.DriverApprovalStatus.APPROVED
        ? driver_interfaces_1.DriverApprovalStatus.SUSPENDED
        : driver_interfaces_1.DriverApprovalStatus.APPROVED;
    const updatedDriver = yield driver_model_1.Driver.findByIdAndUpdate(driverId, { $set: { approvalStatus: newStatus } }, { new: true, runValidators: true });
    return updatedDriver;
});
const setDriverStatus = (decodedToken, status) => __awaiter(void 0, void 0, void 0, function* () {
    const ifUserExist = yield user_model_1.User.findById(decodedToken.userId);
    if (!ifUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    const driver = yield driver_model_1.Driver.findOne({ user: decodedToken.userId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver profile not created yet!! Please create driver profile..");
    }
    driver.onlineStatus = status;
    yield driver.save();
    return driver;
});
exports.setDriverStatus = setDriverStatus;
const getEarnings = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = { driver: decodedToken.userId, status: "COMPLETED" };
    const rides = yield ride_model_1.Ride.find(filter);
    const totalEarnings = rides.reduce((sum, r) => sum + r.fare, 0);
    return { data: rides,
        meta: {
            total: totalEarnings
        }
    };
});
exports.getEarnings = getEarnings;
exports.DriverService = {
    createDriverProfile,
    getAllDrivers,
    approveOrSuspendDriver,
    setDriverStatus: exports.setDriverStatus,
    getEarnings: exports.getEarnings,
    updateDriverProfile
};
