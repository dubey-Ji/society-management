import mongoose from 'mongoose';

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      enum: ['OWNER', 'RENT', 'SECRETARY', 'CHAIRMAN', 'TREASURER'],
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timeStamps: true }
);

export const Role = mongoose.model('Role', roleSchema);
