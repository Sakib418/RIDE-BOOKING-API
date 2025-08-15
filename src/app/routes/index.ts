import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { DivisionRoutes } from "../modules/division/division.route";


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
        path: "/division",
        route: DivisionRoutes
    },
    {
        path: "/division",
        route: DivisionRoutes
    }
]

moduleRouters.forEach((route)=>{
    router.use(route.path,route.route)
})