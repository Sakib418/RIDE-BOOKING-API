"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const GeoPointSchema = new mongoose_1.Schema({
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true },
});
const PlaceSchema = new mongoose_1.Schema({
    location: { type: GeoPointSchema, required: true },
    address: String,
});
const rideSchema = new mongoose_1.Schema({
    rider: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    pickup: { type: PlaceSchema, required: true },
    destination: { type: PlaceSchema, required: true },
    status: { type: String, enum: Object.values(ride_interface_1.RideStatus), default: ride_interface_1.RideStatus.REQUESTED },
    requestedAt: { type: Date, default: Date.now },
    fare: { type: Number, required: true },
    acceptedAt: Date,
    pickedUpAt: Date,
    completedAt: Date,
    canceledAt: Date,
}, {
    timestamps: true,
    versionKey: false
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
