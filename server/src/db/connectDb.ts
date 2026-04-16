import mongoose from 'mongoose';

async function connectDb() {
  const MONGO_URI = process.env.MONGO_URI
  await mongoose.connect(MONGO_URI as string)
}

export default connectDb;