import AppError from "../../errorHandlers/AppError";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
    const {email,password,...rest} = payload;
    
    const ifUserExist = await User.findOne({email});

    if(ifUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }
    
    const hashedPassword = await bcryptjs.hash(password as string,Number(envVars.BCRYPT_SALT_ROUND));
    const authProvider: IAuthProvider ={provider: "credentials", providerId: email as string}
    const user = await User.create({
        email,
        password: hashedPassword,
        auths:  [authProvider],
        ...rest
       })
       return user
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    /**
     * email - can not update
     * name, phone, password address
     * password - re hashing
     *  only admin superadmin - role, isDeleted...
     * 
     * promoting to superadmin - superadmin
     */

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.RIDER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.RIDER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}

const toggleUserStatus = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
    
    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.RIDER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }


    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }
     const newStatus =
      ifUserExist.isActive === IsActive.ACTIVE ? IsActive.BLOCKED : IsActive.ACTIVE;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isActive: newStatus },
      { new: true, select: "-password" }
    );
    
    
     return updatedUser
}

const getAllUsers = async () => {
    const users = await User.find();
    const totolUsers = await User.countDocuments();

    return {
        data: users,
        meta:{
            total: totolUsers
        }
    };

}

export const UserService = {
    createUser,
    getAllUsers,
    updateUser,
    toggleUserStatus
}