import mongoose from "mongoose";

const propertySchema = mongoose.Schema({
  no: {
    type: Number,
    required: true
  },
  wing: {
    type: String,
    default: null
  },
  sqFt: {
    type: Number,
    required: true
  },
  propertyType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PropertyType',
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
  }
}, {timeStamps: true});

export const Property = mongoose.model('Property', propertySchema);