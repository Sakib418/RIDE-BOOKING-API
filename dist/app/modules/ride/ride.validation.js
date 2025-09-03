"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRideZodSchema = exports.createRideZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const ride_interface_1 = require("./ride.interface");
// const PlaceSchema = z.object({
//   address: z.string().optional(),
//   lat: z.number(),
//   lng: z.number(),
// }).transform((data) => ({
//   address: data.address,
//   location: {
//     type: "Point",
//     coordinates: [data.lng, data.lat],
//   },
// }));
// export const createRideZodSchema = z.object({
//   pickup: PlaceSchema,
//   destination: PlaceSchema,
// });
const PlaceSchema = zod_1.default.object({
    lat: zod_1.default.number(),
    lng: zod_1.default.number(),
    address: zod_1.default.string().optional(),
}).transform((data) => ({
    address: data.address,
    location: {
        type: "Point",
        coordinates: [data.lng, data.lat],
    },
}));
exports.createRideZodSchema = zod_1.default.object({
    pickup: PlaceSchema,
    destination: PlaceSchema,
});
exports.updateRideZodSchema = zod_1.default.object({
    driver: zod_1.default.string().optional(),
    status: zod_1.default.enum(Object.values(ride_interface_1.RideStatus)).optional(),
    acceptedAt: zod_1.default.date().optional(),
    pickedUpAt: zod_1.default.date().optional(),
    completedAt: zod_1.default.date().optional(),
    canceledAt: zod_1.default.date().optional(),
    fare: zod_1.default.number().positive().optional(),
});
