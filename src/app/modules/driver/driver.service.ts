import { Types } from "mongoose";
import { QueryBuilder } from "../../Utils/QueryBuilder";
import { RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";
import { DriverApprovalStatus, DriverOnlineStatus, IDriverProfile } from "./driver.interfaces";
import { Driver } from "./driver.model";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from 'http-status-codes';
import AppError from "../../errorHandlers/AppError";
import { User } from "../user/user.model";

const createDriverProfile = async (payload: IDriverProfile) => {
    
    const driver = await Driver.create(payload);

    return driver;
};




const getAllDrivers = async (query: Record<string, string>) => {


    const queryBuilder = new QueryBuilder(Driver.find(), query)

    const driver = await queryBuilder
        .filter()
        

    // const meta = await queryBuilder.getMeta()

    const [data, meta] = await Promise.all([
        driver.build(),
        queryBuilder.getMeta()
    ])


    return {
        data,
        meta
    }
};

const approveOrSuspendDriver = async (driverId: string, approvalStatus: DriverApprovalStatus) => {

    const existingDriver = await Driver.findById(driverId);

    if (!existingDriver) {
        throw new Error("Driver not found.");
    }

  
    const updatedDriver = await Driver.findByIdAndUpdate(driverId, {approvalStatus}, { new: true });

    return updatedDriver;
};

export const setDriverStatus = async (decodedToken: JwtPayload, status: DriverOnlineStatus) => {
   
     const ifUserExist = await User.findById(decodedToken.userId);
   
        
   if (!ifUserExist) {
     throw new AppError(httpStatus.NOT_FOUND, "Driver not found");
   }  

   const driver = await Driver.findOne({user: decodedToken.userId});

    if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver profile not created yet!! Please create driver profile..");
    }  
    
    

  driver.onlineStatus = status;
  await driver.save();

  return driver;
};

export const getEarnings = async (decodedToken: JwtPayload) => {
  const filter: any = { driver: decodedToken.userId, status: "COMPLETED" };
  const rides = await Ride.find(filter);
  const totalEarnings = rides.reduce((sum, r) => sum + r.fare, 0);

  return {  data: rides,
    meta: {
       total: totalEarnings
    }
   };
};

export const DriverService = {
    createDriverProfile,
    getAllDrivers,
    approveOrSuspendDriver,
    setDriverStatus,
    getEarnings
};