import mongoose from 'mongoose';

const addressSchema = mongoose.Schema({
  flatNo: {
    type: Number,
    required: true,
  },
  bldgName: {
    type: String,
    required: true,
  },
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: addressSchema,
  },
  { timeStamps: true }
);

export const User = mongoose.model('User', userSchema);
