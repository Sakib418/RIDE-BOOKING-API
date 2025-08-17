import { z } from "zod";
import { DriverApprovalStatus, DriverOnlineStatus } from "./driver.interfaces";


export const createDriverProfileZodSchema = z.object({
  licenseNo: z.string().min(5, "License number is too short."),
  vehicle: z.object({
    make: z.string().min(2, "Vehicle make is required."),
    model: z.string().min(2, "Vehicle model is required."),
    plate: z.string().min(2, "Vehicle plate number is required."),
  }),
  approvalStatus: z
    .nativeEnum(DriverApprovalStatus)
    .default(DriverApprovalStatus.PENDING),
  onlineStatus: z
    .nativeEnum(DriverOnlineStatus)
    .default(DriverOnlineStatus.OFFLINE),
});

export const updateDriverApprovalZodSchema = z.object({
  approvalStatus: z.nativeEnum(DriverApprovalStatus)
});