import express, { Request, Response, Router } from 'express';
import { createRoleController, getAllRoleController, updateRoleController, deleteRoleController } from '../controller/roleController';

const roleRouter: Router = express.Router();

//create a new role
roleRouter.post('/create', createRoleController);

// update role in db 
roleRouter.put('/update/:id', updateRoleController);

// Get all the roles
roleRouter.get('/getAll', getAllRoleController);

// delete role
roleRouter.delete('/delete/:id', deleteRoleController);

export default roleRouter;