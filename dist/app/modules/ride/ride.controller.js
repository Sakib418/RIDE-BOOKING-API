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
exports.RideController = void 0;
const catchAsync_1 = require("../../Utils/catchAsync");
const sendResponse_1 = require("../../Utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const ride_service_1 = require("./ride.service");
const requestRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    //const { pickup, destination } = req.body;
    const ride = yield ride_service_1.RideService.requestRide(user, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Ride request send Successfully",
        data: ride
    });
}));
const getAcceptedRides = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    //const { pickup, destination } = req.body;
    const ride = yield ride_service_1.RideService.getAcceptedRides(user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Rides Retrived Successfully",
        data: ride
    });
}));
const respondToRide = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const { status } = req.body;
    const decodedToken = req.user;
    const ride = yield ride_service_1.RideService.respondToRide(rideId, decodedToken, status);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: `Ride request ${status} Successfully`,
        data: ride
    });
}));
const rideDetails = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rideId = req.params.id;
    const ride = yield ride_service_1.RideService.rideDetails(rideId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: `Rides Retrived Successfully`,
        data: ride
    });
}));
const getAllRides = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const query = req.query;
    //console.log("Decoded User:", user);
    //console.log("Query:", query);
    const result = yield ride_service_1.RideService.getAllRides(user, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "All Rides Retrived Successfully",
        data: result.data,
        meta: result.meta
    });
}));
const getPendingRide = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // const query = req.query as Record<string, string>;
    //console.log("Decoded User:", user);
    //console.log("Query:", query);
    const result = yield ride_service_1.RideService.getPendingRides(user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "All Rides Retrived Successfully",
        data: result.data
        // meta: result.meta
    });
}));
exports.RideController = {
    getAllRides,
    requestRide,
    respondToRide,
    rideDetails,
    getPendingRide,
    getAcceptedRides
};
