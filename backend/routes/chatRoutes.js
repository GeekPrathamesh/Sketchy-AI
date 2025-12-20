import express from "express"
import { createChat, deleteChats, getChats } from "../controllers/chatcontroller.js"
import { protectShield } from "../middlewares/Auth.js"
const chatRouter = express.Router()
chatRouter.post("/createchat",protectShield,createChat)
chatRouter.get("/getchats",protectShield,getChats)
chatRouter.delete("/deletechat/:chatId",protectShield,deleteChats)

export default chatRouter;