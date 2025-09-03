import { model, Schema } from "mongoose";
import { IGeoPoint, IPlace, IRide, RideStatus } from "./ride.interface";

const GeoPointSchema = new Schema<IGeoPoint>({
  type: { type: String, enum: ["Point"], default: "Point" },
  coordinates: { type: [Number], required: true },
});

const PlaceSchema = new Schema<IPlace>({
  location: { type: GeoPointSchema, required: true },
  address: String,
});


const rideSchema = new Schema<IRide>({
  rider: { type: Schema.Types.ObjectId, ref: "User", required: true },
  driver: { type: Schema.Types.ObjectId, ref: "User" },
  pickup: { type: PlaceSchema, required: true },
  destination: { type: PlaceSchema, required: true },
  status: { type: String, enum: Object.values(RideStatus), default: RideStatus.REQUESTED },
  requestedAt: { type: Date, default: Date.now },
  fare: { type: Number, required: true }, 
  acceptedAt: Date,
  pickedUpAt: Date,
  completedAt: Date,
  canceledAt: Date,
  cancelReason: {type: String},
},

    {
        timestamps: true,
        versionKey: false
    }
);

export const Ride = model<IRide>("Ride", rideSchema);