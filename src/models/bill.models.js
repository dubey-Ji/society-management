import mongoose from 'mongoose';

const billSchema = mongoose.Schema(
  {
    billNo: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      required: true,
      default: false,
    },
    lastPayDate: {
      type: Date,
      required: true,
    },
    paidDate: {
      type: Date,
      default: null,
    },
    latePaid: {
      type: Boolean,
      default: false,
    },
    billType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BillType',
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    },
  },
  { timeStamps: true }
);

export const Bill = mongoose.model('Bill', billSchema);
