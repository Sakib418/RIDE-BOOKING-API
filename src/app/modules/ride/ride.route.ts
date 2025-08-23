import { NextFunction, Request, Response, Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RideController } from "./ride.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createRideZodSchema } from "./ride.validation";


const router = Router();

router.get("/",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), RideController.getAllRides);

router.post("/request",validateRequest(createRideZodSchema),checkAuth(...Object.values(Role)), RideController.requestRide);
//router.get("/",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), RideController.getAllRides);






export const RidesRoutes = router;