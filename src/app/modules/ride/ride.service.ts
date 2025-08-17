import { Ride } from "./ride.model";


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
    getAllRides
}