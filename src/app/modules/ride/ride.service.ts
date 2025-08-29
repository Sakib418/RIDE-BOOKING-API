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
import { Driver } from "../driver/driver.model";
import { DriverApprovalStatus } from "../driver/driver.interfaces";

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

const allowedTransitions: Record<RideStatus, RideStatus[]> = {
  [RideStatus.REQUESTED]: [RideStatus.ACCEPTED, RideStatus.REJECTED, RideStatus.CANCELED],
  [RideStatus.ACCEPTED]: [RideStatus.PICKED_UP],
  [RideStatus.PICKED_UP]: [RideStatus.IN_TRANSIT],
  [RideStatus.IN_TRANSIT]: [RideStatus.COMPLETED],
  [RideStatus.COMPLETED]: [],
  [RideStatus.REJECTED]: [],
  [RideStatus.CANCELED]: []
};
export const respondToRide = async (
  rideId: string, 
  decodedToken: JwtPayload, 
  status: RideStatus
) => {
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }
  
  const ifUserExist = await User.findById(decodedToken.userId);

     
if (!ifUserExist) {
  throw new AppError(httpStatus.NOT_FOUND, "User not found");
}  

    if(ifUserExist?.isActive === "BLOCKED"){
        throw new AppError(httpStatus.BAD_REQUEST, "You are not allowed to place ride request!!!")
    }



  // if()
   

  if (decodedToken.role === "DRIVER") {
    
    const ifDriverExist = await Driver.findOne({user: decodedToken.userId});

    if (!ifDriverExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not created yet!! Please create driver profile..");
    }  
    
    if (
      ifDriverExist.approvalStatus === DriverApprovalStatus.PENDING ||
      ifDriverExist.approvalStatus === DriverApprovalStatus.SUSPENDED
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Your approval status is ${ifDriverExist.approvalStatus} !!!`
      );
    }
    
   const isDriverOnRide = await Ride.findOne({
  driver: decodedToken.userId,
  _id: { $ne: rideId },
  status: { $in: [RideStatus.ACCEPTED, RideStatus.PICKED_UP, RideStatus.IN_TRANSIT] }
  });
    
   if (isDriverOnRide) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please complete the ongoing ride first...");
    } 

    if (decodedToken.role !== "ADMIN") {
      if (!allowedTransitions[ride.status].includes(status)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Cannot change ride status from ${ride.status} to ${status}`
        );
      }
    }
    
   ride.status = status;

    switch (ride.status) {
      case RideStatus.ACCEPTED:
    ride.driver = decodedToken.userId;
    ride.acceptedAt = new Date();
    break;
    
      
    case RideStatus.PICKED_UP:
    ride.pickedUpAt = new Date();
    break;
   
    case RideStatus.COMPLETED:
    ride.completedAt = new Date();
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
      ride.canceledAt = new Date();
    }
  }
  else if (decodedToken.role === "ADMIN") {
  if (status === RideStatus.CANCELED) {
    ride.status = RideStatus.CANCELED;
    ride.canceledAt = new Date();
  } else if (status === RideStatus.COMPLETED && ride.status !== RideStatus.COMPLETED) {
    ride.status = RideStatus.COMPLETED;
    ride.completedAt = new Date();
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid admin action");
  }
}


  await ride.save();
  return ride;
};



const getAllRides = async (decodedToken: JwtPayload) => {
    
     const ifUserExist = await User.findById(decodedToken.userId);
     console.log(decodedToken);
      if(ifUserExist?.isActive === "BLOCKED"){
        throw new AppError(httpStatus.BAD_REQUEST, "You are not allowed to check history!!!")
    }
    let rides
    if (decodedToken.role === Role.RIDER)
    {
      rides = await Ride.find({rider: decodedToken.userId});
    }
    else if(decodedToken.role === Role.DRIVER){
      rides = await Ride.find({driver: decodedToken.userId});
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