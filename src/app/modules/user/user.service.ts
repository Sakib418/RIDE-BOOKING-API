import AppError from "../../errorHandlers/AppError";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from 'http-status-codes';
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { driversRoutes } from "../driver/driver.route";
import { Driver } from "../driver/driver.model";
import { QueryBuilder } from "../../Utils/QueryBuilder";
import { rideSearchableFields } from "./user.constant";

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

    console.log(payload);
    
    /**
     * email - can not update
     * name, phone, password address
     * password - re hashing
     *  only admin superadmin - role, isDeleted...
     * 
     * promoting to superadmin - superadmin
     */

    // if (payload.role) {
    //     if (decodedToken.role === Role.USER || decodedToken.role === Role.RIDER) {
    //         throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    //     }

    //     if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
    //         throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    //     }
    // }

    // if (payload.isActive || payload.isDeleted || payload.isVerified) {
    //     if (decodedToken.role === Role.USER || decodedToken.role === Role.RIDER) {
    //         throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    //     }
    // }

    // if (payload.password) {
    //     payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    // }

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
// const getMe = async (userId: string) => {
//     const user = await User.findById(userId).select("-password");
//     return {
//         data: user
//     }
// };

const getMe = async (userId: string) => {
  // Step 1: Find the base user (excluding password)
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const userObj: any = user.toObject(); // convert mongoose doc to plain object

  // Step 2: If the user is a driver, fetch driver info and attach
  if (user.role === "DRIVER") {
    const driver = await Driver.findOne({ user: user._id }).populate("user", "-password");
    if (driver) {
      userObj.driver = driver.toObject(); // add driver as nested object
    }
  }

  // Step 3: Return user (with optional driver)
  return {
    data: userObj,
  };
};


const getAllUsers = async (query: Record<string, string>) => {
    //const users = await User.find();
    let users
    let queryBuilder
    const totolUsers = await User.countDocuments();
    queryBuilder =  new QueryBuilder(User.find(), query);
    

     users = await queryBuilder
            .search(rideSearchableFields)
            .filter()
            .sort()
            .fields()
            .paginate()
    
         //const meta = await queryBuilder.getMeta()
       
         const [data, meta] = await Promise.all([
            users.build(),
            queryBuilder.getMeta()
        ])
        // ✅ Step 2: For each user, if role is DRIVER, attach driver info
  const usersWithDriverInfo = await Promise.all(
    data.map(async (user) => {
      const userObj = user.toObject()  as any;

      if (user.role === "DRIVER") {
        const driver = await Driver.findOne({ user: user._id }).populate(
          "user",
          "-password"
        );

        if (driver) {
          userObj.driver = driver.toObject(); // attach nested driver info
        }
      }

      return userObj;
    })
  );
      

     return {
        data : usersWithDriverInfo,
        meta
    }
}

export const UserService = {
    createUser,
    getAllUsers,
    updateUser,
    toggleUserStatus,
    getMe
};