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
}
