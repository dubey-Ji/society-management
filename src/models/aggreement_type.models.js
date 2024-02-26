import mongoose from 'mongoose';

const aggreementTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      enum: ['Purchase', 'Rent'],
    },
  },
  { timestamps: true }
);

export const AggreementType = mongoose.model(
  'AggreementType',
  aggreementTypeSchema
);
