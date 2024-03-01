import mongoose from 'mongoose';

const fileErrorSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const FileError = mongoose.model('FileError', fileErrorSchema);
