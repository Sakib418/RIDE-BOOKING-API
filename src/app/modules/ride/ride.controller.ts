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

const getAllRides = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
   const result = await RideService.getAllRides();
   console.log(req.user);
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
    requestRide
}