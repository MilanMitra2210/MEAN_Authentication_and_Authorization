import express, { Request, Response, Router } from 'express';
import { getAllUsersController, getByIdController } from '../controller/userController';
import { verifyAdmin, verifyUser } from '../middleware/userMiddleware';

const userRouter: Router = express.Router();

//get all user
userRouter.get('/', verifyAdmin, getAllUsersController);

//get by id
userRouter.get('/:id',verifyUser, getByIdController);


export default userRouter;