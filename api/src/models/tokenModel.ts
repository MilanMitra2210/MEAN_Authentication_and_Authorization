import mongoose, { Schema } from 'mongoose';

const tokenSchema = new Schema(
  {
    _id:{
        type: Schema.Types.ObjectId,
        required: true,
    },
    token: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);

const tokenModel = mongoose.model('token', tokenSchema);

export default tokenModel;
