import mongoose from "mongoose";

const ownerSchema = mongoose.Schema({
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timeStamps: true });

export const Owner = mongoose.model('Owner', ownerSchema);