import { Schema } from 'mongoose';
export const ContentSchema = new Schema({
  courseId: { type: Number, index: true, required: true },
  title: String,
  body: Schema.Types.Mixed,
}, { timestamps: true });
