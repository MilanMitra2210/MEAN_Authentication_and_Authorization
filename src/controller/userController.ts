import { Request, Response } from "express";
import UserModel from "../models/userModel";

const getAllUsersController = async (
    req: Request,
    res: Response
): Promise<any> => {

    try {
        const user = await UserModel.find();
        return res.status(200).send({ success: true, message: "All users", user });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error!",
            error,
        });
    }
};
const getByIdController = async (
    req: Request,
    res: Response
): Promise<any> => {

    try {
        const {id} = req.params;
        const user = await UserModel.findById({_id: id});
        if(!user){
            return res.status(404).send({ success: false, message: "User not found" });
        }
        return res.status(200).send({ success: true, message: "User", user });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error!",
            error,
        });
    }
};


export {
    getAllUsersController, getByIdController
};
