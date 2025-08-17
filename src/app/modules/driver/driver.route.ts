import { NextFunction, Request, Response, Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { createDriverProfileZodSchema, updateDriverApprovalZodSchema } from "./driver.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { DriverController } from "./driver.controller";



const router = Router();


router.get("/",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), DriverController.getAllDrivers);

router.post(
    "/create/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createDriverProfileZodSchema),
    DriverController.createDriverProfile
);



router.patch(
  "/approve/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDriverApprovalZodSchema),
  DriverController.approveOrSuspendDriver
);



export const driversRoutes = router;