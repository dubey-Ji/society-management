import mongoose from "mongoose";

const propertyTypeSchema = mongoose.Schema({
  name: {
    type: String,
    enum: ['Flat', 'Shop']
  }
}, { timeStamps: true });


export const PropertyType = mongoose.model('PropertyType', propertyTypeSchema);