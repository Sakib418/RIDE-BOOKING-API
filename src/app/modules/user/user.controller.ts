import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);
    
  sendResponse(res,{
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Created Successfully",
    data: user
  })    
})

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;

    const payload = req.body;
    const user = await UserService.updateUser(userId, payload, verifiedToken as JwtPayload)

    

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
        data: user,
    })
})

const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await UserService.getMe(decodedToken.userId);

    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })
})

const toggleUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    
    const verifiedToken = req.user;

    const payload = req.body;
    const user = await UserService.toggleUserStatus(userId, payload, verifiedToken as JwtPayload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: `User is now ${user?.isActive}`,
        data: user,
    })
})
const getAllUsers = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
   const result = await UserService.getAllUsers();
   
   sendResponse(res,{
    success: true,
    statusCode: httpStatus.CREATED,
    message: "All Users Retrived Successfully",
    data: result.data,
    meta: result.meta
  })
}

)


export const UserControllers = {
    createUser,
    getAllUsers,
    updateUser,
    toggleUserStatus,
    getMe
};