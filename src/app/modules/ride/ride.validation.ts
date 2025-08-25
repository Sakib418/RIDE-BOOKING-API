import z from "zod";
import { RideStatus } from "./ride.interface";


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


const PlaceSchema = z.object({
  lat: z.number(), 
  lng: z.number(), 
  address: z.string().optional(),
}).transform((data) => ({
  address: data.address,
  location: {
    type: "Point",
    coordinates: [data.lng, data.lat], 
  },
}));

export const createRideZodSchema = z.object({
  pickup: PlaceSchema,
  destination: PlaceSchema,
  
});


export const updateRideZodSchema = z.object({
  driver: z.string().optional(),
  status: z.enum(Object.values(RideStatus) as [string]).optional(),
  acceptedAt: z.date().optional(),
  pickedUpAt: z.date().optional(),
  completedAt: z.date().optional(),
  canceledAt: z.date().optional(),
  fare: z.number().positive().optional(),
});
