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
exports.RideService = exports.respondToRide = void 0;
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHandlers/AppError"));
const user_interface_1 = require("../user/user.interface");
const calculateDistanceKM_1 = require("../../Utils/calculateDistanceKM");
const driver_model_1 = require("../driver/driver.model");
const driver_interfaces_1 = require("../driver/driver.interfaces");
const requestRide = (decodedToken, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { pickup, destination } = payload;
    if (!pickup || !destination) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please enter location correctly!!!");
    }
    // Fare calculation
    const FARE_PER_KM = 30;
    const pickupCoord = pickup.location.coordinates;
    const destinationCoord = destination.location.coordinates;
    const distance = (0, calculateDistanceKM_1.calculateDistanceKm)(pickupCoord, destinationCoord);
    const fare = parseFloat((distance * FARE_PER_KM).toFixed(2));
    console.log("Fare is = ", distance * FARE_PER_KM);
    const user = decodedToken;
    const ifUserExist = yield user_model_1.User.findById(decodedToken.userId);
    if ((ifUserExist === null || ifUserExist === void 0 ? void 0 : ifUserExist.isActive) === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not allowed to place ride request!!!");
    }
    const existingRide = yield ride_model_1.Ride.findOne({
        rider: user.userId,
        status: ride_interface_1.RideStatus.REQUESTED,
    });
    if (existingRide) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already have a pending ride request!");
    }
    const ride = yield ride_model_1.Ride.create({
        rider: decodedToken.userId,
        pickup,
        destination,
        status: ride_interface_1.RideStatus.REQUESTED,
        requestedAt: new Date(),
        fare,
    });
    return ride;
});
const allowedTransitions = {
    [ride_interface_1.RideStatus.REQUESTED]: [ride_interface_1.RideStatus.ACCEPTED, ride_interface_1.RideStatus.REJECTED, ride_interface_1.RideStatus.CANCELED],
    [ride_interface_1.RideStatus.ACCEPTED]: [ride_interface_1.RideStatus.PICKED_UP],
    [ride_interface_1.RideStatus.PICKED_UP]: [ride_interface_1.RideStatus.IN_TRANSIT],
    [ride_interface_1.RideStatus.IN_TRANSIT]: [ride_interface_1.RideStatus.COMPLETED],
    [ride_interface_1.RideStatus.COMPLETED]: [],
    [ride_interface_1.RideStatus.REJECTED]: [],
    [ride_interface_1.RideStatus.CANCELED]: []
};
const respondToRide = (rideId, decodedToken, status) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    }
    const ifUserExist = yield user_model_1.User.findById(decodedToken.userId);
    if (!ifUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if ((ifUserExist === null || ifUserExist === void 0 ? void 0 : ifUserExist.isActive) === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not allowed to place ride request!!!");
    }
    // if()
    if (decodedToken.role === "DRIVER") {
        const ifDriverExist = yield driver_model_1.Driver.findOne({ user: decodedToken.userId });
        if (!ifDriverExist) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver profile not created yet!! Please create driver profile..");
        }
        if (ifDriverExist.approvalStatus === driver_interfaces_1.DriverApprovalStatus.PENDING ||
            ifDriverExist.approvalStatus === driver_interfaces_1.DriverApprovalStatus.SUSPENDED) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Your approval status is ${ifDriverExist.approvalStatus} !!!`);
        }
        const isDriverOnRide = yield ride_model_1.Ride.findOne({
            driver: decodedToken.userId,
            _id: { $ne: rideId },
            status: { $in: [ride_interface_1.RideStatus.ACCEPTED, ride_interface_1.RideStatus.PICKED_UP, ride_interface_1.RideStatus.IN_TRANSIT] }
        });
        if (isDriverOnRide) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please complete the ongoing ride first...");
        }
        if (decodedToken.role !== "ADMIN") {
            if (!allowedTransitions[ride.status].includes(status)) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot change ride status from ${ride.status} to ${status}`);
            }
        }
        ride.status = status;
        switch (ride.status) {
            case ride_interface_1.RideStatus.ACCEPTED:
                ride.driver = decodedToken.userId;
                ride.acceptedAt = new Date();
                break;
            case ride_interface_1.RideStatus.PICKED_UP:
                ride.pickedUpAt = new Date();
                break;
            case ride_interface_1.RideStatus.COMPLETED:
                ride.completedAt = new Date();
                break;
            default:
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid status transition for driver");
        }
    }
    else if (decodedToken.role === "RIDER") {
        if (![ride_interface_1.RideStatus.REQUESTED, ride_interface_1.RideStatus.ACCEPTED].includes(ride.status)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot cancel at this stage");
        }
        if (status === ride_interface_1.RideStatus.CANCELED) {
            ride.status = ride_interface_1.RideStatus.CANCELED;
            ride.canceledAt = new Date();
        }
    }
    else if (decodedToken.role === "ADMIN") {
        if (status === ride_interface_1.RideStatus.CANCELED) {
            ride.status = ride_interface_1.RideStatus.CANCELED;
            ride.canceledAt = new Date();
        }
        else if (status === ride_interface_1.RideStatus.COMPLETED && ride.status !== ride_interface_1.RideStatus.COMPLETED) {
            ride.status = ride_interface_1.RideStatus.COMPLETED;
            ride.completedAt = new Date();
        }
        else {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid admin action");
        }
    }
    yield ride.save();
    return ride;
});
exports.respondToRide = respondToRide;
const getAllRides = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ifUserExist = yield user_model_1.User.findById(decodedToken.userId);
    console.log(decodedToken);
    if ((ifUserExist === null || ifUserExist === void 0 ? void 0 : ifUserExist.isActive) === "BLOCKED") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not allowed to check history!!!");
    }
    let rides;
    if (decodedToken.role === user_interface_1.Role.RIDER) {
        rides = yield ride_model_1.Ride.find({ rider: decodedToken.userId });
    }
    else if (decodedToken.role === user_interface_1.Role.DRIVER) {
        rides = yield ride_model_1.Ride.find({ driver: decodedToken.userId });
    }
    else {
        rides = yield ride_model_1.Ride.find();
    }
    //const totolRides = await Ride.countDocuments();
    return {
        data: rides,
        // meta:{
        //     total: totolRides
        // }
    };
});
exports.RideService = {
    getAllRides,
    requestRide,
    respondToRide: exports.respondToRide
};
