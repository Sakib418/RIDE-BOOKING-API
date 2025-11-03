import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import httpStatus from "http-status-codes";
import { RideService } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";



const requestRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
  const user  = req.user;
  //const { pickup, destination } = req.body;
  
    
  const ride = await RideService.requestRide(user as JwtPayload,req.body);

  sendResponse(res,{
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Ride request send Successfully",
    data: ride
  })    
})


const respondToRide = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
  
  const rideId  = req.params.id;
  const { status } = req.body;
  const decodedToken = req.user;
    
  const ride = await RideService.respondToRide(rideId, decodedToken as JwtPayload, status);

  sendResponse(res,{
    success: true,
    statusCode: httpStatus.CREATED,
    message: `Ride request ${status} Successfully`,
    data: ride
  })    
})

const rideDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
  
  const rideId  = req.params.id;
    
  const ride = await RideService.rideDetails(rideId);

  sendResponse(res,{
    success: true,
    statusCode: httpStatus.CREATED,
    message: `Rides Retrived Successfully`,
    data: ride
  })    
})

const getAllRides = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
   const user = req.user as JwtPayload;
  const query = req.query as Record<string, string>;

  //console.log("Decoded User:", user);
  //console.log("Query:", query);


   const result = await RideService.getAllRides(user as JwtPayload,query as Record<string, string>);
   sendResponse(res,{
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All Rides Retrived Successfully",
    data: result.data,
    meta: result.meta
  })
}
)

export const RideController = {
    getAllRides,
    requestRide,
    respondToRide,
    rideDetails
}