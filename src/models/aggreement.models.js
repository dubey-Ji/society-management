import mongoose from 'mongoose';

const aggreementSchema = mongoose.Schema(
  {
    file: {
      type: String,
      required: true,
    },
    aggreementType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AggreementType',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { timeStamps: true }
);

export const Aggreement = mongoose.model('Aggreement', aggreementSchema);
