import mongoose from 'mongoose';

const billTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const BillType = mongoose.model('BillType', billTypeSchema);
