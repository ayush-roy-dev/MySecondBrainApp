import mongoose, { mongo, Schema, Types } from "mongoose";
import User from "./User";

const contentTypes = ['image', 'video', 'article', 'audio']; // Extend as needed

const contentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: Types.ObjectId, ref: 'Tag' }],
  userId: { type: Types.ObjectId, ref: 'User', required: true },
});

contentSchema.pre('save', async function() {
  const user = await User.findById(this.userId);
  if (!user) {
    throw new Error('User does not exist');
  }
});

export default mongoose.model('Content', contentSchema)