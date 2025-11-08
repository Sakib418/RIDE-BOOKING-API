import { NextFunction, Request, Response, Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RideController } from "./ride.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideZodSchema } from "./ride.validation";


const router = Router();

router.get("/me",checkAuth(Role.ADMIN,Role.SUPER_ADMIN,Role.DRIVER,Role.RIDER), RideController.getAllRides);
router.get("/getPendingRides",checkAuth(...Object.values(Role)), RideController.getPendingRide);
router.get("/getAcceptedRides",checkAuth(Role.DRIVER), RideController.getAcceptedRides);
router.post("/request",validateRequest(createRideZodSchema),checkAuth(...Object.values(Role)), RideController.requestRide);
router.patch("/:id/status",checkAuth(Role.RIDER,Role.DRIVER,Role.ADMIN), RideController.respondToRide);
router.get("/:id",checkAuth(Role.RIDER,Role.DRIVER,Role.ADMIN,Role.SUPER_ADMIN), RideController.rideDetails);








export const RidesRoutes = router;