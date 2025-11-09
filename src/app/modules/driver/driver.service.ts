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
const updateDriverProfile = async (userid: string,payload: IDriverProfile) => {
    
   const ifUserExist = await User.findById(userid);
   
       if (!ifUserExist) {
           throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
       }
     console.log(payload);
    //const driver = await Driver.findByIdAndUpdate(userid, payload, { new: true, runValidators: true })
    const driver = await Driver.findOneAndUpdate(
        { user: userid }, // find driver by user reference
        { $set: { vehicle: payload } }, // update only vehicle
        { new: true, runValidators: true }
    );

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

// const approveOrSuspendDriver = async (userid: string, approvalStatus: DriverApprovalStatus) => {

//     const existingDriver = await Driver.findOne({ user: userid });
//     //console.log(existingDriver,approvalStatus);
//     if (!existingDriver) {
//         throw new Error("Driver not found.");
//     }
//     const driverId= existingDriver._id;
    
//     //  const newStatus =
//     //       ifUserExist.isActive === IsActive.ACTIVE ? IsActive.BLOCKED : IsActive.ACTIVE;
//           const newStatus =
//           approvalStatus === DriverApprovalStatus.APPROVED ? DriverApprovalStatus.SUSPENDED : DriverApprovalStatus.APPROVED;
        
   

//     console.log(driverId);
//     //const updatedDriver = await Driver.findByIdAndUpdate(existingDriver._id, {approvalStatus}, { new: true });
//     const updatedDriver = await Driver.findByIdAndUpdate(
//     driverId,
//     { approvalStatus: newStatus },
//     { new: true, select: "-password"}
//   );


//     return updatedDriver;
// };

const approveOrSuspendDriver = async (
  userId: string,
  approvalStatus: DriverApprovalStatus
) => {
  const existingDriver = await Driver.findOne({ user: userId });
  if (!existingDriver) {
    throw new Error("Driver not found.");
  }

  const driverId = existingDriver._id;
   const currentStatus = existingDriver.approvalStatus;
  const newStatus =
    currentStatus === DriverApprovalStatus.APPROVED
      ? DriverApprovalStatus.SUSPENDED
      : DriverApprovalStatus.APPROVED;

  const updatedDriver = await Driver.findByIdAndUpdate(
    driverId,
    { $set: { approvalStatus: newStatus } },
    { new: true, runValidators: true }
  );

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
    getEarnings,
    updateDriverProfile
};