import { JwtPayload } from "jsonwebtoken";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from "bcryptjs";
import AppError from "../../errorHandlers/AppError";
import { envVars } from "../../config/env";

const requestRide = async (decodedToken: JwtPayload,payload: Partial<IRide>) => {
    
    const {pickup,destination} = payload;
    console.log(decodedToken);
    const user:JwtPayload = decodedToken;

    const ifUserExist = await User.findById(decodedToken.userId);


    if(ifUserExist?.isActive === "BLOCKED"){
        throw new AppError(httpStatus.BAD_REQUEST, "You are not allowed to place ride request!!!")
    }
    const existingRide = await Ride.findOne({
    rider: user.userId,
    status: RideStatus.REQUESTED,
  });

  if (existingRide) {
    throw new AppError(httpStatus.BAD_REQUEST, "You already have a pending ride request!");
  }
    
    const ride = await Ride.create({
        rider: decodedToken.userId,
        pickup,
        destination,
        status: RideStatus.REQUESTED,
        requestedAt: new Date(),
       });
       return ride;
}

const getAllRides = async () => {
    const rides = await Ride.find();
    const totolRides = await Ride.countDocuments();

    return {
        data: rides,
        meta:{
            total: totolRides
        }
    };
}

export const RideService = {
    getAllRides,
    requestRide
}