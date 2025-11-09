import { Request, Response } from "express";
import { catchAsync } from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { DriverService } from "./driver.service";
import { DriverApprovalStatus } from "./driver.interfaces";
import { JwtPayload } from "jsonwebtoken";


const createDriverProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id; // get user ID from URL
    const payload = {
        ...req.body,
        user: userId, 
    };

    const result = await DriverService.createDriverProfile(payload);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Driver profile created successfully',
        data: result,
    });
});
const updateDriverProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id; // get user ID from URL
    const payload = {
        ...req.body,
        user: userId, 
    };
    console.log(payload);
    const result = await DriverService.updateDriverProfile(userId ,payload);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Driver profile created successfully',
        data: result,
    });
});
const getAllDrivers = catchAsync(async (req: Request, res: Response) => {

    const query = req.query
    const result = await DriverService.getAllDrivers(query as Record<string, string>);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Drivers retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
});

const approveOrSuspendDriver = catchAsync(async (req: Request, res: Response) => {
    console.log(req.body,req.params.id);
    const driverId = req.params.id as string;
    console.log(driverId);
    const { approvalStatus } = req.body as { approvalStatus: DriverApprovalStatus };

    const result = await DriverService.approveOrSuspendDriver(driverId, approvalStatus);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Driver has been ${approvalStatus} successfully`,
        data: result,
    });
});

export const setDriverStatus = async (req: Request, res: Response) => {

  const decodedToken = req.user;
  console.log(req.body);
  const { status } = req.body;
  
   const driver = await DriverService.setDriverStatus(decodedToken as JwtPayload, status);
  sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Driver has been updated successfully`,
        data: driver,
    });
  
};

export const getEarnings = async (req: Request, res: Response) => {

  const decodedToken = req.user;
  
   const result = await DriverService.getEarnings(decodedToken as JwtPayload);
  sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Driver earning total retrived successfully`,
        data: result.data,
        meta: result.meta
    });
  
};


export const DriverController ={
    createDriverProfile,
    getAllDrivers,
    approveOrSuspendDriver,
    setDriverStatus,
    getEarnings,
    updateDriverProfile
}