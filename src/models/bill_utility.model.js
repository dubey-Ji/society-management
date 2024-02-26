import mongoose from 'mongoose';

const billUtilitySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    bill_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BillType',
    },
  },
  { timestamps: true }
);

export const BillUtility = mongoose.model('BillUtility', billUtilitySchema);
