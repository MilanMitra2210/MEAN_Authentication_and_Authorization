import mongoose, { Schema } from 'mongoose';

const roleSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const RoleModel = mongoose.model('Role', roleSchema);

export default RoleModel;
