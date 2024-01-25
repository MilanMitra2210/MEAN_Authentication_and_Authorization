import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Protected Routes, Token Based
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    if (token == null) {
        // console.log(currentToken);
        return res.status(401).json({ message: 'You are not Authenticated' });
    }
    const jwt_secret = process.env.JWT_SECRET || "";

    // Verify the token in the header
    jwt.verify(token, jwt_secret, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ message: 'Access Forbidden, Token is not Valid' });
        }
        req.body.user = user;
        next();
    });
}
const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, ()=>{
        const {id} = req.params;
        const {_id, isAdmin} = req.body.user;

        if(_id === id || isAdmin){
            next();
        }else{
            return res.status(403).json({ message: 'You are not Authorized' });
        }
    });
}

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, ()=>{
        const { isAdmin} = req.body.user;
        

        if(isAdmin){
            next();
        }else{
            return res.status(403).json({ message: 'You are not Authorized' });
        }
    });
}

export { verifyToken, verifyUser, verifyAdmin };
