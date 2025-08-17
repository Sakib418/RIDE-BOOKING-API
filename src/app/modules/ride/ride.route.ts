import { NextFunction, Request, Response, Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { RideController } from "./ride.controller";


const router = Router();

router.get("/",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), RideController.getAllRides);




export const RidesRoutes = router;