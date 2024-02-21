import mongoose from 'mongoose';

const licenseeSchema = mongoose.Schema(
  {
    licenseeUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timeStamps: true }
);

export const Licensee = mongoose.model('Licensee', licenseeSchema);
