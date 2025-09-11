import mongoose from "mongoose"

const connectToMongoDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("connected to MONGOdb")

    } catch(error){
        console.log("error connecting to MongoDB ",error.message)
    }
}
export default connectToMongoDB;