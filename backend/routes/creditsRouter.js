import express from "express"
import { getPlans, purchasePlan } from "../controllers/creditController.js";
import { protectShield } from "../middlewares/Auth.js";

const creditRouter = express.Router();

creditRouter.get("/plan",getPlans);
creditRouter.post("/purchase",protectShield,purchasePlan);

export default creditRouter;