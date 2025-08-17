import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { DivisionRoutes } from "../modules/division/division.route";
import { RidesRoutes } from "../modules/ride/ride.route";
import { driversRoutes } from "../modules/driver/driver.route";


export const router = Router();

const moduleRouters = [
    {
        path: "/users",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/rides",
        route: RidesRoutes
    }
    ,
    {
        path: "/drivers",
        route: driversRoutes
    }
]

moduleRouters.forEach((route)=>{
    router.use(route.path,route.route)
})