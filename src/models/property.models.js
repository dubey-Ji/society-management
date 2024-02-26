import mongoose from 'mongoose';

const propertySchema = mongoose.Schema(
  {
    roomNo: {
      type: Number,
      required: false,
    },
    shopNo: {
      type: Number,
      required: false,
    },
    wing: {
      type: String,
      default: null,
    },
    sqFt: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
    },
    licensee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Licensee',
      default: null,
    },
  },
  { timeStamps: true }
);

export const Property = mongoose.model('Property', propertySchema);
