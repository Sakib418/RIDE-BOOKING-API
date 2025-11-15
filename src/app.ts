import express, { Request, Response } from "express";
import "./app/config/passport"
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import { envVars } from "./app/config/env";

const app = express()
app.use(expressSession({
    secret: "Your secrat",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

app.use(cors({
    origin: envVars.FRONEND_URL,
    credentials: true
}))
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Ride Booking API"
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app;