import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGODB CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.error("Error connecting to MONGODB", error);
    process.exit(1);
  }
};


// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try{
//     await mongoose.connect("mongodb+srv://vikasbagda5570_db_user:o470yxdStqm8dfAF@cluster0.kk2dl4a.mongodb.net/?appName=Cluster0")
//     console.log("MongoDB Connected Successfully");
//   }
//   catch(error) {
//     console.log("Error in connection to mongodb", error)
//     process.exit(1);
//   }
// }