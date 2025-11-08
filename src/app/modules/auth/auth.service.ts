import AppError from "../../errorHandlers/AppError";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { createNewAccessTokenWithRefreshToken } from "../../Utils/userTokens";
import { JwtPayload } from "jsonwebtoken";



const getNewAccessToken = async (refreshToken : string) => {
    
     const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

     return{
        accessToken :newAccessToken
        
    }
}

const resetPassword = async (decodedToken : JwtPayload,newPassword: string,oldPassword: string) => {
    
     const user = await User.findById(decodedToken.userId);

     const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string);
     
      if(!isOldPasswordMatch){
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
      }
      user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
      
      user?.save();

}


export const AuthService = {
    getNewAccessToken,
    resetPassword
}
