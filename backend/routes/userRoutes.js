import express from "express";
import { getUser, login, registerUser } from "../controllers/usercontroller.js";
import { protectShield } from "../middlewares/Auth.js";
import { getPublishedimages } from "../controllers/messageController.js";
const userRouter = express.Router();


userRouter.post("/register",registerUser);
userRouter.post("/login",login);
userRouter.get("/getuser", protectShield , getUser);
userRouter.get("/published-images", protectShield , getPublishedimages);

export default userRouter;


