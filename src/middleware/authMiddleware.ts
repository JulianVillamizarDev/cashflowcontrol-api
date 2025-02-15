import User from "../models/User.js";
import { authSessionToken } from "../helpers/helpers.js";
import { Request, Response } from "express";

//middleware function to authorize the session token to login
const checkAuth = async (req: Request, res: Response, next: any) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        
        try {
            token = req.headers.authorization.split(" ")[1];

            const authSession = await authSessionToken(token);

            const user = await User.findByPk(authSession.user, {
                attributes: [
                    'id_user', 
                    'username', 
                    'email', 
                    'firstname',
                    'lastname'
                ]
            });

            req.body = {
                authLogin: true,
                user: user.dataValues
            };

            return next();
        } catch (error: any) {
            //const e = new Error("Unvalid token");
            res.clearCookie("CFC_SESSION");
            return res.status(403).json({
                authLogin: false,
                msg: error.message
            });
        }

    }

    if(!token){
        const error = new Error("Token does not exist");
        res.status(403).json({
            authLogin: false, 
            msg: error.message
        }); 
    }   
    

    next();
}

export default checkAuth;