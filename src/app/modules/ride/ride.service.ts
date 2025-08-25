import { JwtPayload } from "jsonwebtoken";
import { IRide, RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from "bcryptjs";
import AppError from "../../errorHandlers/AppError";
import { envVars } from "../../config/env";
import { ObjectId, Types } from "mongoose";
import { Role } from "../user/user.interface";
import { calculateDistanceKm } from "../../Utils/calculateDistanceKM";

const requestRide = async (decodedToken: JwtPayload,payload: Partial<IRide>) => {
    
    const {pickup,destination} = payload;
   
    if(!pickup || !destination){
      throw new AppError(httpStatus.BAD_REQUEST, "Please enter location correctly!!!")
    }
    // Fare calculation
   const FARE_PER_KM = 30;
   const pickupCoord: [number, number] = pickup.location.coordinates;
   const destinationCoord: [number, number] = destination.location.coordinates;
   const distance = calculateDistanceKm(pickupCoord,destinationCoord);
    const fare = parseFloat((distance * FARE_PER_KM).toFixed(2));

    console.log("Fare is = ", distance * FARE_PER_KM);
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
        fare,
       });
       return ride;
}


export const respondToRide = async (
  rideId: string, 
  decodedToken: JwtPayload, 
  status: RideStatus
) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  if (decodedToken.role === "DRIVER") {
    switch (ride.status) {
      case RideStatus.REQUESTED:
        if (status === RideStatus.ACCEPTED) {
          ride.status = RideStatus.ACCEPTED;
          ride.driver = decodedToken.userId;
        } else if (status === RideStatus.REJECTED) {
          ride.status = RideStatus.REJECTED;
        }
        break;

      case RideStatus.ACCEPTED:
        if (status === RideStatus.PICKED_UP) {
          ride.status = RideStatus.PICKED_UP;
        }
        break;

      case RideStatus.PICKED_UP:
        if (status === RideStatus.IN_TRANSIT) {
          ride.status = RideStatus.IN_TRANSIT;
        }
        break;

      case RideStatus.IN_TRANSIT:
        if (status === RideStatus.COMPLETED) {
          ride.status = RideStatus.COMPLETED;
        }
        break;

      default:
        throw new AppError(
          httpStatus.BAD_REQUEST, 
          "Invalid status transition for driver"
        );
    }
  } 
  
  else if (decodedToken.role === "RIDER") {
    if (![RideStatus.REQUESTED, RideStatus.ACCEPTED].includes(ride.status)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Cannot cancel at this stage");
    }
    if (status === RideStatus.CANCELED) {
      ride.status = RideStatus.CANCELED;
    }
  }

  await ride.save();
  return ride;
};

const cancelRide = async (rideId : string) => {

     const ride = await Ride.findById(new Types.ObjectId(rideId));

      if (!ride) {
        throw new AppError(httpStatus.BAD_REQUEST, "Ride not found!!!")
      }
      if (![RideStatus.REQUESTED, RideStatus.ACCEPTED].includes(ride.status)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Cannot cancel at this stage")
      }
      
      ride.status = RideStatus.CANCELED;
      ride.canceledAt = new Date();
      await ride.save();
    
       return ride;
}

const getAllRides = async (decodedToken: JwtPayload) => {
    
     const ifUserExist = await User.findById(decodedToken.userId);
     console.log(decodedToken);
      if(ifUserExist?.isActive === "BLOCKED"){
        throw new AppError(httpStatus.BAD_REQUEST, "You are not allowed to check history!!!")
    }
    let rides
    if (decodedToken.role === Role.DRIVER || decodedToken.role === Role.RIDER)
    {
      rides = await Ride.find({rider: decodedToken.userId});
    }
    else
    {
       rides = await Ride.find();
    }
    
    //const totolRides = await Ride.countDocuments();

    return {
        data: rides,
        // meta:{
        //     total: totolRides
        // }
    };
}

export const RideService = {
    getAllRides,
    requestRide,
    respondToRide
}