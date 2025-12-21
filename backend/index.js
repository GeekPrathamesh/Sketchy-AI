import express from "express"
import "dotenv/config"
import cors from "cors"
import { connectDatabase } from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditsRouter.js";
 
const app = express();

await connectDatabase();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.get("/",(req,res)=>{
    res.send("hello there.. server is running fine")
})
app.use("/api/user",userRouter);
app.use("/api/chat",chatRouter);
app.use("/api/message",messageRouter);
app.use("/api/credit",creditRouter);

const PORT = process.env.PORT || 7000;

app.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}`)
})



