import mongoose from 'mongoose';

// status = ['processing', 'success', 'failed','partial success']
const fileSchema = mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    error: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FileError',
      default: null,
    },
  },
  { timestamps: true }
);

export const File = mongoose.model('File', fileSchema);
