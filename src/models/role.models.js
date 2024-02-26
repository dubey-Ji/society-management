import mongoose from 'mongoose';

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      enum: ['OWNER', 'RENT', 'SECRETARY', 'CHAIRMAN', 'TREASURER'],
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

roleSchema.pre('save', async function (next) {
  this.name = this.name.toLowerCase();
});

export const Role = mongoose.model('Role', roleSchema);
