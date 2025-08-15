import z from "zod";
import { RideStatus } from "./ride.interface";


export const placeZodSchema = z.object({
  address: z.string().max(200, "Address cannot exceed 200 characters."),
  lat: z.number().min(-90).max(90, "Latitude must be between -90 and 90."),
  lng: z.number().min(-180).max(180, "Longitude must be between -180 and 180."),
});


export const createRideZodSchema = z.object({
  rider: z.string().min(1, "Rider ID is required."),
  driver: z.string().optional(),
  pickup: placeZodSchema,
  destination: placeZodSchema,
  status: z.enum(Object.values(RideStatus) as [string]).optional(),
  requestedAt: z.date().optional(),
});


export const updateRideZodSchema = z.object({
  driver: z.string().optional(),
  status: z.enum(Object.values(RideStatus) as [string]).optional(),
  acceptedAt: z.date().optional(),
  pickedUpAt: z.date().optional(),
  completedAt: z.date().optional(),
  canceledAt: z.date().optional(),
});
