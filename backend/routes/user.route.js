import express from "express";
import {register,login,logout,updateProfile} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router=express.Router();

router.route('/register').post(register);
router.route('/login').get(login);
router.route('/logout').get(logout);
router.route('/profile/update').put(isAuthenticated,updateProfile);

export default router;