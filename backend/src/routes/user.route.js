import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../controllers/user.controller.js";

const router = Router();

//get user by id
router.get('/:id', getUser);

//get users
router.get('/', getAllUsers);

//create user
router.post('/', createUser);

//update user
router.put('/:id', updateUser);

//delete user
router.delete('/:id', deleteUser);

export default router;