import express from "express"
import { protectShield } from "../middlewares/Auth.js"
import {  imageMessageController, textMessageController } from "../controllers/messageController.js"
const messageRouter = express.Router()

messageRouter.post("/text",protectShield,textMessageController);
messageRouter.post("/image",protectShield,imageMessageController);

export default messageRouter;