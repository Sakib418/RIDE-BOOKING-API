import { model, Schema } from "mongoose";
import { DriverApprovalStatus, DriverOnlineStatus, IAuthProvider, IDriverProfile, IRiderProfile, IsActive, IUser, Role } from "./user.interface";
import { required } from "zod/v4/core/util.cjs";


const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
})

const DriverProfileSchema = new Schema<IDriverProfile>({
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
});

const RiderProfileSchema = new Schema<IRiderProfile>({
    totalTrips: { type: Number, default: 0 },
});


const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(Role), required: true },
    isActive: { type: String, enum: Object.values(IsActive), default: IsActive.ACTIVE },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema],
    driverProfile: DriverProfileSchema,
    riderProfile: RiderProfileSchema,
},
    {
        timestamps: true,
        versionKey: false
    });



export const User = model<IUser>("User", userSchema)