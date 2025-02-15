import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  createdAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
