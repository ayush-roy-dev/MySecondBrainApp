import mongoose from "mongoose";

export const connectDB = async (uri: any) => await mongoose.connect(uri);