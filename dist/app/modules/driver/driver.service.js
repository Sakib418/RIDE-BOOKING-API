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
const driver_model_1 = require("./driver.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHandlers/AppError"));
const user_model_1 = require("../user/user.model");
const createDriverProfile = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.create(payload);
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
const approveOrSuspendDriver = (driverId, approvalStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const existingDriver = yield driver_model_1.Driver.findById(driverId);
    if (!existingDriver) {
        throw new Error("Driver not found.");
    }
    const updatedDriver = yield driver_model_1.Driver.findByIdAndUpdate(driverId, { approvalStatus }, { new: true });
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
    getEarnings: exports.getEarnings
};
