import { Request, Response } from "express";
import RoleModel from "../models/roleModel";

const createRoleController = async (
    req: Request,
    res: Response
): Promise<any> => {
    
    try {
        const { role } = req.body;
        // validation
        if (!role) {
            return res.status(400).send({ message: "Role is Required" });
        }
        const newRole = await new RoleModel({role}).save();

        res.status(200).send({
            success: true,
            message: "Role Created",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error!",
            error,
        });
    }
};

const updateRoleController = async (
    req: Request,
    res: Response
): Promise<any> => {
    
    try {
        const _id = req.params.id;
        
        
        const role = await RoleModel.findById({_id});
        if(!role){
            return res.status(404).send({ message: "Role not found!" });
        }
        const newData = await RoleModel.findByIdAndUpdate({_id} , {$set: req.body}, {new: true});
        
        res.status(200).send({
            success: true,
            message: "Role Updated!",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error!",
            error,
        });
    }
};

const getAllRoleController = async (
    req: Request,
    res: Response
): Promise<any> => {
    
    try {
        const roles = await RoleModel.find({});
        
        res.status(200).send(roles);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error!",
            error,
        });
    }
};

const deleteRoleController = async (
    req: Request,
    res: Response
): Promise<any> => {
    
    try {
        const _id = req.params.id;
        const role = await RoleModel.findById({_id});
        if(!role){
            return res.status(404).send({ message: "Role not found!" });
        }
        await RoleModel.findByIdAndDelete(_id);
        res.status(200).send({
            success: true,
            message: "Role Deleted!",
        });
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
    createRoleController, updateRoleController, getAllRoleController, deleteRoleController
};
