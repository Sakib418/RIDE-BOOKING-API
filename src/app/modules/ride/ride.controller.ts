import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import httpStatus from "http-status-codes";
import { RideService } from "./ride.service";


const getAllRides = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
   const result = await RideService.getAllRides();
   
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
    getAllRides
}