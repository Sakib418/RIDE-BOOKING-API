import z from "zod";
import { DriverApprovalStatus, DriverOnlineStatus, IsActive, Role } from "./user.interface";



export const driverProfileZodSchema = z.object({
  licenseNo: z.string().min(5, "License number is too short."),
  vehicle: z.object({
    make: z.string().min(2, "Vehicle make is required."),
    model: z.string().min(2, "Vehicle model is required."),
    plate: z.string().min(2, "Vehicle plate number is required."),
  }),
  approvalStatus: z.enum(Object.values(DriverApprovalStatus) as [string])
    .default(DriverApprovalStatus.PENDING),
  onlineStatus: z.enum(Object.values(DriverOnlineStatus) as [string])
    .default(DriverOnlineStatus.OFFLINE)
}).partial(); 


export const riderProfileZodSchema = z.object({
  rating: z.number().min(0).max(5).optional(),
  totalRides: z.number().int().min(0).optional()
}).partial();


export const createUserZodSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }).max(50),
  email: z.string().email({ message: "Invalid email address format." }).min(5).max(100),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, { message: "Password must contain at least 1 uppercase letter." })
    .regex(/^(?=.*[!@#$%^&*])/, { message: "Password must contain at least 1 special character." })
    .regex(/^(?=.*\d)/, { message: "Password must contain at least 1 number." }),
  phone: z.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
    message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
  }).optional(),
  picture: z.string().url().optional(),
  address: z.string().max(200).optional(),
  role: z.enum(Object.values(Role) as [string]),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isVerified: z.boolean().optional(),
  driverProfile: driverProfileZodSchema.optional(),
  riderProfile: riderProfileZodSchema.optional(),
});


export const updateUserZodSchema = createUserZodSchema.partial();
