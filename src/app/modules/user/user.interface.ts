import { Types } from "mongoose";

export enum Role{
    SUPER_ADMIN = "SUPER_ADMIN",
    RIDER="RIDER",
    DRIVER="DRIVER",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE",
}
export interface IAuthProvider {
    provider: "google" | "credentials"; //"Google","Credential"
    providerId : string;
}
export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}
export enum DriverOnlineStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export enum DriverApprovalStatus {
  PENDING = "PENDING",   
  APPROVED = "APPROVED", 
  SUSPENDED = "SUSPENDED" 
}

export interface IDriverProfile {
  licenseNo: string;
  vehicle: {
    make: string;
    model: string;
    plate: string;
  };
  approvalStatus: DriverApprovalStatus;
  onlineStatus: DriverOnlineStatus;
}

export interface IRiderProfile {
  totalTrips?: number;
}

export interface IUser extends Document {
  _id ?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone ?: string;
  picture ?: string;
  address ?: string;
  isVerified ?: boolean;
  isDeleted ?: boolean;
  role: Role;
  isActive: IsActive;
  auths : IAuthProvider[];
  driverProfile?: IDriverProfile;
  riderProfile?: IRiderProfile;
}
