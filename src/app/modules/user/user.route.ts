import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";


const router = Router();

router.post("/register",validateRequest(createUserZodSchema), UserControllers.createUser);
router.get("/",checkAuth(Role.ADMIN,Role.SUPER_ADMIN), UserControllers.getAllUsers);
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser)
router.patch("/block/:id", validateRequest(updateUserZodSchema), checkAuth(Role.ADMIN,Role.SUPER_ADMIN), UserControllers.toggleUserStatus)

export const UserRoutes = router;