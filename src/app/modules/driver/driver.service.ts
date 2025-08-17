import { QueryBuilder } from "../../Utils/QueryBuilder";
import { DriverApprovalStatus, IDriverProfile } from "./driver.interfaces";
import { Driver } from "./driver.model";


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


export const DriverService = {
    createDriverProfile,
    getAllDrivers,
    approveOrSuspendDriver
};