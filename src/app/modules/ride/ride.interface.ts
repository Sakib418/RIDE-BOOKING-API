import { Types } from "mongoose";
import { Schema } from "mongoose";

export interface IGeoPoint {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}
export enum RideStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
}
export interface IPlace {
  location: IGeoPoint;
  address?: string;
}



export interface IRide extends Document {
  rider: Types.ObjectId;
  driver?: Types.ObjectId;
  pickup: IPlace;
  destination: IPlace;
  status: RideStatus;
  requestedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
  canceledAt?: Date;
}