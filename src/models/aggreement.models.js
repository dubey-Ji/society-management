import mongoose from "mongoose";

const aggreementSchema = mongoose.Schema({
  file: {
    type: String,
    required: true,
  },
  aggreementType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AggreementType',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true
  },
  licensee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Licensee',
    default: null
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  }
}, { timeStamps: true });

export const Aggreement = mongoose.model('Aggreement', aggreementSchema);