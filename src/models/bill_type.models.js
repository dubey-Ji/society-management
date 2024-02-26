import mongoose from 'mongoose';

const billTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timeStamps: true }
);

export const BillType = mongoose.model('BillType', billTypeSchema);
