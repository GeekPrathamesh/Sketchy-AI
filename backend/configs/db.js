import mongoose from "mongoose"
export const connectDatabase=async()=>{

    try {
        
        mongoose.connection.on("connected",()=>{
            console.log("Database Connected")
            
        })
        await mongoose.connect(`${process.env.MONGODB_URI}/sketchyAI`);
    } catch (error) {
       console.log("failed to connect the database" ,error.message); 
    }
}