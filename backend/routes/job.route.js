import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import{postJob} from "../controllers/job.controller.js";
const router=express.Router();

router.route('/post').post(isAuthenticated,postJob);
// router.route('/get').get(isAuthenticated,getJob);
// router.route('/get/:id').get(isAuthenticated,getJobById);
// router.route('/update/:id').put(isAuthenticated,updateJob);

export default router;