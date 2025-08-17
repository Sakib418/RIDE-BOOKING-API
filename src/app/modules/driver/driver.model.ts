import { Schema, model, Types } from "mongoose";
import { DriverApprovalStatus, DriverOnlineStatus } from "./driver.interfaces";


const driverSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, unique: true },
    licenseNo: { type: String, required: true },
    vehicle: {
      make: { type: String, required: true },
      model: { type: String, required: true },
      plate: { type: String, required: true },
    },
    approvalStatus: {
      type: String,
      enum: Object.values(DriverApprovalStatus),
      default: DriverApprovalStatus.PENDING,
    },
    onlineStatus: {
      type: String,
      enum: Object.values(DriverOnlineStatus),
      default: DriverOnlineStatus.OFFLINE,
    },
  },
  { timestamps: true,
    versionKey: false
   }
);

export const Driver = model("Driver", driverSchema);
