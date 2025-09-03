"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_routes_1 = require("../modules/auth/auth.routes");
const ride_route_1 = require("../modules/ride/ride.route");
const driver_route_1 = require("../modules/driver/driver.route");
exports.router = (0, express_1.Router)();
const moduleRouters = [
    {
        path: "/users",
        route: user_route_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes
    },
    {
        path: "/rides",
        route: ride_route_1.RidesRoutes
    },
    {
        path: "/drivers",
        route: driver_route_1.driversRoutes
    }
];
moduleRouters.forEach((route) => {
    exports.router.use(route.path, route.route);
});
