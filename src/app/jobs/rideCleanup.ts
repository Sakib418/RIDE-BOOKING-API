import cron from "node-cron";
import { Ride } from "../modules/ride/ride.model";


export function startRideCleanupJob() {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    try {
      const expiryMinutes = 3;
      const expiryTime = new Date(Date.now() - expiryMinutes * 60 * 1000);

      const result = await Ride.updateMany(
        { status: "REQUESTED", requestedAt: { $lt: expiryTime } },
          {
              status: "CANCELED",
              canceledAt: new Date(),
              cancelReason: "No drivers available at the moment"
          }
      );

      if (result.modifiedCount > 0) {
        console.log(`Auto-canceled ${result.modifiedCount} rides`);
      }
    } catch (error) {
      console.error("Ride cleanup job failed:", error);
    }
  });
}
